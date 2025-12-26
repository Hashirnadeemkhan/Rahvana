'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useDocumentVaultStore } from '@/lib/document-vault/store';
import {
  getDocumentsByCategory,
  getCategoryDisplayName,
} from '@/lib/document-vault/personalization-engine';
import { ALL_DOCUMENTS } from '@/lib/document-vault/document-definitions';
import { DocumentCard } from '@/app/components/document-vault/DocumentCard';
import { DocumentUploadModal } from '@/app/components/document-vault/DocumentUploadModal';
import { DocumentWizard } from '@/app/components/document-vault/DocumentWizard';
import { ConfigurationWizard } from '@/app/components/document-vault/ConfigurationWizard';
import { LiveConfigPanel } from '@/app/components/document-vault/LiveConfigPanel';
import { NotificationBell } from '@/app/components/document-vault/NotificationCenter';
import { NotificationTestPanel } from '@/app/components/document-vault/NotificationTestPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  Download,
  Bell,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentVaultPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    config,
    uploadedDocuments,
    requiredDocuments,
    selectedDocumentDefId,
    wizardOpen,
    uploadModalOpen,
    initialize,
    openUploadModal,
    closeUploadModal,
    openWizard,
    closeWizard,
    refreshDocumentStatuses,
    refreshNotifications,
    notifications,
  } = useDocumentVaultStore();

  const [showConfigWizard, setShowConfigWizard] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Calculate stats - must be before any conditional returns
  const stats = useMemo(() => {
    const total = requiredDocuments.length;
    const uploaded = uploadedDocuments.filter((d) => d.status === 'UPLOADED').length;
    const missing = requiredDocuments.filter(
      (rd) =>
        !uploadedDocuments.some(
          (ud) => ud.documentDefId === rd.id && ud.status !== 'MISSING'
        )
    ).length;
    const expiring = uploadedDocuments.filter(
      (d) => d.status === 'NEEDS_ATTENTION'
    ).length;
    const expired = uploadedDocuments.filter((d) => d.status === 'EXPIRED').length;

    return {
      total,
      uploaded,
      missing,
      expiring,
      expired,
      percentComplete: total > 0 ? Math.round((uploaded / total) * 100) : 0,
    };
  }, [uploadedDocuments, requiredDocuments]);
  const documentsByCategory = useMemo(() => config ? getDocumentsByCategory(config) : {}, [config]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !initialized) {
      setIsInitializing(true);
      initialize(user.id).then(() => {
        setInitialized(true);
        setIsInitializing(false);
      }).catch(() => {
        setIsInitializing(false);
      });
    }
  }, [user, authLoading, router, initialized, initialize]);

  useEffect(() => {
    // Check if config exists after initialization
    if (initialized && !config) {
      setShowConfigWizard(true);
    }
  }, [initialized, config]);

  useEffect(() => {
    // Refresh document statuses and notifications on mount and periodically
    if (config) {
      refreshDocumentStatuses();
      refreshNotifications();

      const interval = setInterval(() => {
        refreshDocumentStatuses();
        refreshNotifications();
      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  if (authLoading || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if ((!config && initialized) || showConfigWizard) {
    return (
      <ConfigurationWizard
        userId={user.id}
        onComplete={() => {
          setShowConfigWizard(false);
          setInitialized(false); // Reset to trigger re-initialization
        }}
      />
    );
  }

  const selectedDoc = selectedDocumentDefId
    ? ALL_DOCUMENTS.find((d) => d.id === selectedDocumentDefId)
    : undefined;

  const handleDownload = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleExportSingle = async (documentId: string, hasCompressed: boolean) => {
    try {
      toast.info(hasCompressed ? 'Preparing ZIP with original + compressed...' : 'Preparing export...');
      const response = await fetch(`/api/documents/${documentId}/export`);

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get filename from Content-Disposition header
      const disposition = response.headers.get('content-disposition');
      const filenameMatch = disposition?.match(/filename="(.+?)"/);
      a.download = filenameMatch ? filenameMatch[1] : 'document-export';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(hasCompressed ? 'ZIP exported with original + NVC-compliant compressed version' : 'Document exported');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export document');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success('Document deleted');
      setInitialized(false); // Trigger re-initialization to reload data
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Preparing export...');
      const response = await fetch('/api/documents/export?structureByCategory=true');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-vault-export-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Export completed');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export documents');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL documents? This action cannot be undone!')) {
      return;
    }

    if (!confirm('⚠️ Final confirmation: Delete ALL uploaded documents?')) {
      return;
    }

    try {
      toast.loading('Deleting all documents...', { id: 'delete-all' });

      // Get all uploaded document IDs
      const documentIds = uploadedDocuments.map(doc => doc.id);

      // Delete each document
      let deleted = 0;
      for (const docId of documentIds) {
        const response = await fetch(`/api/documents/${docId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          deleted++;
        }
      }

      toast.success(`✅ Deleted ${deleted} documents successfully!`, { id: 'delete-all' });

      // Reload data
      if (user) {
        await initialize(user.id);
      }
    } catch (error) {
      console.error('Delete all error:', error);
      toast.error('Failed to delete all documents', { id: 'delete-all' });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-[1800px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Document Vault</h1>
            <p className="text-muted-foreground">
              Manage your immigration documents for {config?.visaCategory}
            </p>
          </div>
          <div className="flex gap-2">
            <NotificationBell />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={uploadedDocuments.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAll}
              disabled={uploadedDocuments.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Uploaded</p>
                <p className="text-xl font-bold text-green-600">{stats.uploaded}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </Card>

          <Card className="p-3 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 dark:text-white font-medium">Missing</p>
                <p className="text-xl font-bold text-red-600 dark:text-white">{stats.missing}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-white" />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Expiring</p>
                <p className="text-xl font-bold text-yellow-600">
                  {stats.expiring + stats.expired}
                </p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Completion Progress</span>
          <span className="text-xs text-muted-foreground">
            {stats.percentComplete}%
          </span>
        </div>
        <Progress value={stats.percentComplete} className="h-2" />
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="p-3 mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-yellow-900 dark:text-yellow-100 mb-2">
                Action Required ({notifications.length})
              </h3>
              <div className="space-y-1">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className="text-xs text-yellow-800 dark:text-yellow-200"
                  >
                    <Badge
                      variant={
                        notif.severity === 'error'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="mr-2 text-xs"
                    >
                      {notif.severity}
                    </Badge>
                    {notif.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Configuration Panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <LiveConfigPanel />
        </div>

        {/* Right Content - Documents */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="space-y-6">
        {Object.entries(documentsByCategory).map(([category, docs]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4">
              {getCategoryDisplayName(category)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map((doc) => {
                const uploadedDoc = uploadedDocuments.find(
                  (ud) => ud.documentDefId === doc.id
                );

                return (
                  <DocumentCard
                    key={doc.id}
                    documentDef={doc}
                    uploadedDoc={uploadedDoc}
                    onUpload={() => openUploadModal(doc.id)}
                    onDownload={
                      uploadedDoc ? () => handleDownload(uploadedDoc.id) : undefined
                    }
                    onDelete={
                      uploadedDoc ? () => handleDelete(uploadedDoc.id) : undefined
                    }
                    onExport={
                      uploadedDoc
                        ? () => handleExportSingle(uploadedDoc.id, uploadedDoc.hasCompressedVersion || false)
                        : undefined
                    }
                    onOpenWizard={() => openWizard(doc.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedDoc && (
        <>
          <DocumentUploadModal
            open={uploadModalOpen}
            onClose={closeUploadModal}
            documentDef={selectedDoc}
            onUploadComplete={async () => {
              // Reload all data from database
              if (user) {
                await initialize(user.id);
              }
            }}
          />

          <DocumentWizard
            open={wizardOpen}
            onClose={closeWizard}
            documentDef={selectedDoc}
          />

          {/* Testing Panel - only shows in development */}
          <NotificationTestPanel />
        </>
      )}
    </div>
  );
}
