"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useDocumentVaultStore } from "@/lib/document-vault/store";
import {
  getDocumentsByCategory,
  getCategoryDisplayName,
} from "@/lib/document-vault/personalization-engine";
import { ALL_DOCUMENTS } from "@/lib/document-vault/document-definitions";
import type { UploadedDocument } from "@/lib/document-vault/types";
import { DocumentCard } from "@/app/components/document-vault/DocumentCard";
import { DocumentTableView } from "@/app/components/document-vault/DocumentTableView";
import { DocumentPreviewModal } from "@/app/components/document-vault/DocumentPreviewModal";
import { DocumentUploadModal } from "@/app/components/document-vault/DocumentUploadModal";
import { DocumentWizard } from "@/app/components/document-vault/DocumentWizard";
import { ConfigurationWizard } from "@/app/components/document-vault/ConfigurationWizard";
import { LiveConfigPanel } from "@/app/components/document-vault/LiveConfigPanel";
import { NotificationBell } from "@/app/components/document-vault/NotificationCenter";
import { NotificationTestPanel } from "@/app/components/document-vault/NotificationTestPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  Download,
  Bell,
  Trash2,
  BookOpen,
  LayoutGrid,
  List,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Calculate stats - must be before any conditional returns
  const stats = useMemo(() => {
    // Only count required documents, not optional ones
    const requiredDocs = requiredDocuments.filter((doc) => doc.required);
    const total = requiredDocs.length;
    const uploaded = requiredDocs.filter((rd) =>
      uploadedDocuments.some(
        (ud) => ud.documentDefId === rd.id && ud.status === "UPLOADED",
      ),
    ).length;
    const missing = requiredDocs.filter(
      (rd) =>
        !uploadedDocuments.some(
          (ud) => ud.documentDefId === rd.id && ud.status !== "MISSING",
        ),
    ).length;
    const expiring = uploadedDocuments.filter(
      (d) => d.status === "NEEDS_ATTENTION",
    ).length;
    const expired = uploadedDocuments.filter(
      (d) => d.status === "EXPIRED",
    ).length;

    return {
      total,
      uploaded,
      missing,
      expiring,
      expired,
      percentComplete: total > 0 ? Math.round((uploaded / total) * 100) : 0,
    };
  }, [uploadedDocuments, requiredDocuments]);
  const documentsByCategory = useMemo(
    () => (config ? getDocumentsByCategory(config, true) : {}),
    [config],
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && !initialized) {
      setIsInitializing(true);
      initialize(user.id)
        .then(() => {
          setInitialized(true);
          setIsInitializing(false);
        })
        .catch(() => {
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

  // Categories for tabs
  const categories = useMemo(() => {
    const cats = Object.keys(documentsByCategory).sort();
    return ['all', ...cats];
  }, [documentsByCategory]);

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
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Document downloaded");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleExportSingle = async (
    documentId: string,
    hasCompressed: boolean,
  ) => {
    try {
      toast.info(
        hasCompressed
          ? "Preparing ZIP with original + compressed..."
          : "Preparing export...",
      );
      const response = await fetch(`/api/documents/${documentId}/export`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Get filename from Content-Disposition header
      const disposition = response.headers.get("content-disposition");
      const filenameMatch = disposition?.match(/filename="(.+?)"/);
      a.download = filenameMatch ? filenameMatch[1] : "document-export";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        hasCompressed
          ? "ZIP exported with original + NVC-compliant compressed version"
          : "Document exported",
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export document");
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Document deleted");
      setInitialized(false); // Trigger re-initialization to reload data
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const handlePreview = (uploadedDoc: UploadedDocument) => {
    setPreviewDoc(uploadedDoc);
    setPreviewOpen(true);
  };

  const handleExport = async () => {
    try {
      toast.info("Preparing export...");
      const response = await fetch(
        "/api/documents/export?structureByCategory=true",
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document-vault-export-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export completed");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export documents");
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to delete ALL documents? This action cannot be undone!",
      )
    ) {
      return;
    }

    if (!confirm("⚠️ Final confirmation: Delete ALL uploaded documents?")) {
      return;
    }

    try {
      toast.loading("Deleting all documents...", { id: "delete-all" });

      // Get all uploaded document IDs
      const documentIds = uploadedDocuments.map((doc) => doc.id);

      // Delete each document
      let deleted = 0;
      for (const docId of documentIds) {
        const response = await fetch(`/api/documents/${docId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          deleted++;
        }
      }

      toast.success(`✅ Deleted ${deleted} documents successfully!`, {
        id: "delete-all",
      });

      // Reload data
      if (user) {
        await initialize(user.id);
      }
    } catch (error) {
      console.error("Delete all error:", error);
      toast.error("Failed to delete all documents", { id: "delete-all" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      {/* Top Professional Header */}
      <div className="bg-white dark:bg-slate-900 border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 max-w-[1800px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Document Vault</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/5 text-primary border-primary/20 font-bold px-2.5 py-0.5">
                    {config?.visaCategory} Case
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">Compliance-Ready Repository</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
                <Button 
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('table')}
                  className={`h-8 rounded-lg ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                  className={`h-8 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

              <Link href="/document-vault/guide" className="hidden sm:flex">
                <Button variant="ghost" size="sm" className="font-semibold gap-2">
                  <BookOpen className="w-4 h-4" />
                  Guide
                </Button>
              </Link>
              
              <NotificationBell />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="outline" size="sm" className="font-bold border-2">
                    Actions
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Vault Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExport} disabled={uploadedDocuments.length === 0}>
                    <Download className="w-4 h-4 mr-2" /> Export Entire Vault
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={refreshDocumentStatuses}>
                    <Clock className="w-4 h-4 mr-2" /> Force Status Sync
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleDeleteAll}
                    disabled={uploadedDocuments.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Purge All Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-[1800px]">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Stats & Configuration */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            {/* Professional Stats Card */}
            <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white p-0">
               <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold tracking-tight uppercase text-xs opacity-80">Sync Progress</span>
                  </div>
                  <Badge variant="outline" className="text-white border-white/30 font-bold bg-white/10 backdrop-blur-sm">
                    {stats.percentComplete}%
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-2xl font-black mb-1">
                      <span>{stats.uploaded} / {stats.total}</span>
                      <span className="text-white/60 text-sm font-medium self-end mb-1">Items Ready</span>
                    </div>
                    <Progress value={stats.percentComplete} className="h-3 bg-white/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Critical Missing</p>
                      <p className={`text-xl font-black ${stats.missing > 0 ? 'text-white' : 'text-emerald-300'}`}>
                        {stats.missing}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Alerts/Expiring</p>
                      <p className={`text-xl font-black ${stats.expiring > 0 ? 'text-amber-300' : 'text-white'}`}>
                        {stats.expiring + stats.expired}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span className="text-[11px] font-semibold opacity-90">Bank-Grade Encryption Active</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
            </Card>

            {/* Config Panel */}
            <LiveConfigPanel />
            
            {/* Mini Tips Card */}
            <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 shadow-sm">
               <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">NVC/USCIS Tip</h4>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 leading-relaxed">
                    Always use the <strong>original</strong> color scans. Documents over 4MB will be auto-compressed by Rahvana's NVC engine.
                  </p>
                </div>
               </div>
            </Card>
          </div>

          {/* Right Side: Document Management Tabs */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {notifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8"
                >
                  <Card className="p-4 border-l-4 border-l-amber-500 bg-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Bell className="w-16 h-16" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-2.5 rounded-2xl">
                        <Bell className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-900 dark:text-white mb-1">Action Required</h3>
                          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 font-bold">
                            {notifications.length} Alerts
                          </Badge>
                        </div>
                        <div className="space-y-2 mt-3">
                          {notifications.slice(0, 2).map((notif) => (
                            <div key={notif.id} className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{notif.message}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs font-bold text-primary hover:bg-primary/5"
                                onClick={() => notif.documentDefId && openUploadModal(notif.documentDefId)}
                              >
                                Fix Now
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <TabsList className="bg-white dark:bg-slate-900 border shadow-sm h-11 p-1 rounded-xl">
                  {categories.slice(0, 5).map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="px-6 rounded-lg font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300"
                    >
                      {cat === 'all' ? 'All Master Checklist' : getCategoryDisplayName(cat).split(' ')[0]}
                    </TabsTrigger>
                  ))}
                  {categories.length > 5 && (
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg font-bold text-xs gap-1">
                          More <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {categories.slice(5).map(cat => (
                          <DropdownMenuItem key={cat} onClick={() => setActiveTab(cat)}>
                            {getCategoryDisplayName(cat)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                     </DropdownMenu>
                  )}
                </TabsList>
                
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeTab === 'all' ? 'Comprehensive Master Checklist' : getCategoryDisplayName(activeTab)}
                </h2>
              </div>

              <TabsContent value={activeTab} className="mt-0 ring-offset-0 focus-visible:ring-0">
                <div className="space-y-10">
                  {activeTab === 'all' ? (
                    // Show all categories in 'all' tab
                    Object.entries(documentsByCategory).map(([category, docs]) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="h-1 w-12 bg-primary rounded-full"></div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                             {getCategoryDisplayName(category)}
                           </h3>
                        </div>
                        
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {docs.map((doc) => {
                              const uploadedDoc = uploadedDocuments.find(ud => ud.documentDefId === doc.id);
                              return (
                                <DocumentCard
                                  key={doc.id}
                                  documentDef={doc}
                                  uploadedDoc={uploadedDoc}
                                  onUpload={() => openUploadModal(doc.id)}
                                  onPreview={uploadedDoc ? () => handlePreview(uploadedDoc) : undefined}
                                  onDownload={uploadedDoc ? () => handleDownload(uploadedDoc.id) : undefined}
                                  onDelete={uploadedDoc ? () => handleDelete(uploadedDoc.id) : undefined}
                                  onExport={uploadedDoc ? () => handleExportSingle(uploadedDoc.id, uploadedDoc.hasCompressedVersion || false) : undefined}
                                  onOpenWizard={() => openWizard(doc.id)}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <DocumentTableView 
                            documents={docs}
                            uploadedDocuments={uploadedDocuments}
                            onUpload={openUploadModal}
                            onPreview={handlePreview}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            onExport={handleExportSingle}
                            onOpenWizard={openWizard}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    // Show specific category
                    <div className="space-y-4">
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {documentsByCategory[activeTab]?.map((doc) => {
                            const uploadedDoc = uploadedDocuments.find(ud => ud.documentDefId === doc.id);
                            return (
                              <DocumentCard
                                key={doc.id}
                                documentDef={doc}
                                uploadedDoc={uploadedDoc}
                                onUpload={() => openUploadModal(doc.id)}
                                onPreview={uploadedDoc ? () => handlePreview(uploadedDoc) : undefined}
                                onDownload={uploadedDoc ? () => handleDownload(uploadedDoc.id) : undefined}
                                onDelete={uploadedDoc ? () => handleDelete(uploadedDoc.id) : undefined}
                                onExport={uploadedDoc ? () => handleExportSingle(uploadedDoc.id, uploadedDoc.hasCompressedVersion || false) : undefined}
                                onOpenWizard={() => openWizard(doc.id)}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <DocumentTableView 
                          documents={documentsByCategory[activeTab] || []}
                          uploadedDocuments={uploadedDocuments}
                          onUpload={openUploadModal}
                          onPreview={handlePreview}
                          onDownload={handleDownload}
                          onDelete={handleDelete}
                          onExport={handleExportSingle}
                          onOpenWizard={openWizard}
                        />
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewDoc(null);
          }}
          documentDef={
            selectedDoc ||
            ALL_DOCUMENTS.find((d) => d.id === previewDoc.documentDefId)!
          }
          uploadedDoc={previewDoc}
        />
      )}
    </div>
  );
}
