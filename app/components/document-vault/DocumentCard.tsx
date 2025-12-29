'use client';

import { DocumentDefinition, UploadedDocument } from '@/lib/document-vault/types';
import {
  formatExpirationDate,
  getExpirationStatusColor,
  getDaysUntilExpiration,
} from '@/lib/document-vault/expiration-tracker';
import { formatFileSize, getShortDisplayName } from '@/lib/document-vault/file-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  FileArchive,
  Package,
  Eye,
} from 'lucide-react';

interface DocumentCardProps {
  documentDef: DocumentDefinition;
  uploadedDoc?: UploadedDocument;
  onUpload: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onOpenWizard: () => void;
  onExport?: () => void;
  onPreview?: () => void;
}

export function DocumentCard({
  documentDef,
  uploadedDoc,
  onUpload,
  onDownload,
  onDelete,
  onOpenWizard,
  onExport,
  onPreview,
}: DocumentCardProps) {
  const getStatusBadge = () => {
    if (!uploadedDoc) {
      // Show "Not Uploaded" for missing documents
      return (
        <Badge variant={documentDef.required ? 'destructive' : 'secondary'} className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Not Uploaded
        </Badge>
      );
    }

    switch (uploadedDoc.status) {
      case 'UPLOADED':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-500">
            <CheckCircle className="w-3 h-3" />
            Uploaded
          </Badge>
        );
      case 'NEEDS_ATTENTION':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500">
            <Clock className="w-3 h-3" />
            Expiring Soon
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleBadges = () => {
    return documentDef.roles.map((role) => (
      <Badge key={role} variant="outline" className="text-xs">
        {role.replace('_', ' ')}
      </Badge>
    ));
  };

  const getStageBadges = () => {
    return documentDef.stages.map((stage) => (
      <Badge key={stage} variant="outline" className="text-xs">
        {stage}
      </Badge>
    ));
  };

  const getExpirationInfo = () => {
    if (!uploadedDoc?.expirationDate) return null;

    const daysUntil = getDaysUntilExpiration(uploadedDoc);
    if (daysUntil === null) return null;

    const color = getExpirationStatusColor(uploadedDoc);
    const colorClass = {
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      gray: 'text-gray-600',
    }[color];

    return (
      <div className={`text-sm ${colorClass} flex items-center gap-1`}>
        <Clock className="w-4 h-4" />
        {formatExpirationDate(uploadedDoc.expirationDate)}
      </div>
    );
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold text-base">
                {documentDef.name}
                {documentDef.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {documentDef.description}
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Document metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">Who provides:</div>
          {getRoleBadges()}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">Used in:</div>
          {getStageBadges()}
        </div>
      </div>

      {/* Uploaded document info */}
      {uploadedDoc && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Saved As:</span>
              <Badge variant="outline" className="text-xs">
                {uploadedDoc.uploadedBy.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs font-medium text-foreground" title={uploadedDoc.standardizedFilename}>
              {getShortDisplayName(uploadedDoc.standardizedFilename, documentDef.name)}
            </p>
            <p className="text-xs text-muted-foreground font-mono break-all bg-muted px-2 py-1 rounded">
              {uploadedDoc.standardizedFilename}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Size:</span>
            <span className="text-muted-foreground">
              {formatFileSize(uploadedDoc.fileSize)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Uploaded:</span>
            <span className="text-muted-foreground">
              {new Date(uploadedDoc.uploadedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          {uploadedDoc.expirationDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Validity:</span>
              {getExpirationInfo()}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Version:</span>
            <Badge variant="secondary" className="text-xs">
              v{uploadedDoc.version}
            </Badge>
          </div>
          {uploadedDoc.notes && (
            <div className="text-sm pt-2 border-t">
              <span className="font-medium block mb-1">Notes:</span>
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                {uploadedDoc.notes}
              </p>
            </div>
          )}

          {/* Compressed File Info */}
          {uploadedDoc.hasCompressedVersion && uploadedDoc.compressedFileSize && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <FileArchive className="w-4 h-4" />
              
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Compressed: {formatFileSize(uploadedDoc.compressedFileSize)}
                </span>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                  {((1 - uploadedDoc.compressedFileSize / uploadedDoc.fileSize) * 100).toFixed(0)}% smaller
                </Badge>
              </div>
            </div>
          )}

          {/* Large file warning if > 4MB and no compressed version */}
          {uploadedDoc.fileSize > 4 * 1024 * 1024 && !uploadedDoc.hasCompressedVersion && (
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">File exceeds 4MB NVC/USCIS limit</span>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Re-upload this file to auto-generate a compressed version
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!uploadedDoc ? (
          <>
            <Button onClick={onUpload} size="sm" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button
              onClick={onOpenWizard}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-2" />
              How to Obtain
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onPreview}
              size="sm"
              variant="outline"
              title="Preview document"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDownload}
              size="sm"
              variant="outline"
              className="flex-1"
              title="Download original file"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {/* Export button - shows ZIP icon if compressed version exists */}
            {onExport && (
              <Button
                onClick={onExport}
                size="sm"
                variant="outline"
                className={uploadedDoc.hasCompressedVersion ? "bg-blue-50 hover:bg-blue-100 border-blue-300" : ""}
                title={uploadedDoc.hasCompressedVersion
                  ? "Export ZIP (original + compressed for NVC/USCIS)"
                  : "Export document"
                }
              >
                {uploadedDoc.hasCompressedVersion ? (
                  <Package className="w-4 h-4 text-blue-600" />
                ) : (
                  <FileArchive className="w-4 h-4" />
                )}
              </Button>
            )}
            <Button onClick={onUpload} size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Replace
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Wizard link at bottom */}
      {documentDef.wizardSteps && documentDef.wizardSteps.length > 0 && (
        <button
          onClick={onOpenWizard}
          className="text-xs text-brand hover:underline mt-3 w-full text-center"
        >
          View step-by-step guide
        </button>
      )}
    </Card>
  );
}
