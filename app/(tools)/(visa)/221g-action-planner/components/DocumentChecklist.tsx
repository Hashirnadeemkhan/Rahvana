import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Upload,
  ChevronRight,
  Package,
  Eye
} from 'lucide-react';
import { FormSelections } from '../types/221g';
import DocumentValidator from './DocumentValidator';

type DocumentStatus = 'missing' | 'in-progress' | 'ready' | 'submitted';

interface DocumentItem {
  id: string;
  name: string;
  type: keyof FormSelections;
  required: boolean;
  status: DocumentStatus;
  filePath?: string;
  notes?: string;
}

interface DocumentChecklistProps {
  selectedItems: FormSelections;
  onDocumentStatusChange: (documentId: string, status: DocumentStatus) => void;
  onFileUpload: (docId: string, files: FileList) => void;
  onFileRemove: (docId: string, fileIndex: number) => void;
  uploadedDocs: Record<string, { file: File; uploadDate: Date; quality: 'excellent' | 'good' | 'needs-review' }[]>;
  docQualityChecks: Record<string, { passed: boolean; issues: string[] }>;
}

export default function DocumentChecklist({ 
  selectedItems, 
  onDocumentStatusChange, 
  onFileUpload,
  onFileRemove,
  uploadedDocs,
  docQualityChecks
}: DocumentChecklistProps) {
  // Map selected form items to document checklist
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  
  // Manual Verification State
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [manualVerifyDocId, setManualVerifyDocId] = useState<string | null>(null);
  const [manualChecklist, setManualChecklist] = useState<Record<string, boolean>>({});
  
  // Validation Error State
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update documents when selectedItems change
  useEffect(() => {
    import('../utils/documentDefinitions').then(({ generateRequiredDocumentsList }) => {
      const newDocuments = generateRequiredDocumentsList(selectedItems);
      setDocuments(newDocuments);
    });
  }, [selectedItems]);
  
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'missing': return 'secondary';
      case 'in-progress': return 'default';
      case 'ready': return 'success';
      case 'submitted': return 'outline';
      default: return 'secondary';
    }
  };
  
  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'missing': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ready': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'submitted': return <Package className="h-4 w-4 text-blue-500" />;
      default: return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };
  
  const handleDocumentValidation = (documentId: string, result: any) => {
    // On successful validation, update document status to 'ready'
    if (result.isValid) {
      onDocumentStatusChange(documentId, 'ready');
    }
  };
  
  const openManualVerification = (docId: string) => {
    setManualVerifyDocId(docId);
    setManualChecklist({
      'bride_name': false,
      'groom_name': false,
      'marriage_date': false,
      'official_stamp': false,
      'signatures': false
    });
    setShowManualVerify(true);
  };

  const handleManualVerifySubmit = () => {
    const allChecked = Object.values(manualChecklist).every(v => v);
    if (allChecked && manualVerifyDocId) {
      onDocumentStatusChange(manualVerifyDocId, 'ready');
      setShowManualVerify(false);
    } else {
      alert('Please verify all items in the checklist before proceeding.');
    }
  };

  // Calculate progress
  const completedCount = documents.filter(d => d.status === 'ready' || d.status === 'submitted').length;
  const totalCount = documents.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-end">
          <Badge variant="outline">{completedCount}/{totalCount} completed</Badge>
        </div>
        <CardDescription>
          Upload and validate your required documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => {
              const docId = doc.id;
              const hasUploads = uploadedDocs[docId]?.length > 0;
              const qualityCheck = docQualityChecks[docId];
              const isNikahNama = doc.type === 'nikah_nama' || doc.id === 'nikah_nama';
              
              return (
                <div 
                  key={doc.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-xs text-gray-500">
                          {doc.required ? 'Required' : 'Recommended'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(doc.status)}>
                      {doc.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files && onFileUpload(docId, e.target.files)}
                      className="flex-1 text-sm"
                    />
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Find the most recently uploaded file for this document
                        if (hasUploads) {
                          const latestFile = uploadedDocs[docId][uploadedDocs[docId].length - 1];

                          // Create a temporary validator to validate this specific file
                          const validator = async () => {
                            try {
                              // Use the new OCR processor that handles both images and PDFs
                              const { processDocumentOCR } = await import('../utils/ocrProcessor');
                              
                              const text = await processDocumentOCR(latestFile.file, (progressInfo) => {
                                console.log(`OCR Progress: ${progressInfo.status} - ${progressInfo.current}%`);
                              });

                              // Import the validation function from the utility
                              const { validateByDocumentType } = await import('../utils/documentValidation');

                              // Validate based on document type
                              const validationResult = validateByDocumentType(text, doc.type as any);

                              // Update the document status based on validation result
                              if (validationResult.isValid) {
                                onDocumentStatusChange(docId, 'ready');
                              } else {
                                // Show the validation issues to the user
                                const issues = validationResult.issues.map(issue => `${issue.message}`);
                                setValidationErrors(issues);
                                setShowErrorDialog(true);
                              }
                            } catch (error) {
                              console.error('Validation error:', error);
                              setValidationErrors([`Error validating document: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`]);
                              setShowErrorDialog(true);
                            }
                          };

                          validator();
                        } else {
                          alert('Please upload a file first before validating.');
                        }
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1 " />
                      Validate
                    </Button>
                    
                    {isNikahNama && hasUploads && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openManualVerification(docId)}
                        title="Manually verify Urdu document"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Manual Verify
                      </Button>
                    )}
                  </div>
                  
                  {hasUploads && (
                    <div className="mt-3 space-y-2">
                      {uploadedDocs[docId].map((upload, fileIdx) => (
                        <div key={fileIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="flex items-center gap-2">
                            📄 {upload.file.name}
                            <Badge variant="outline" className="text-xs">
                              {upload.quality}
                            </Badge>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              {(upload.file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              onClick={() => onFileRemove(docId, fileIdx)}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {qualityCheck && (
                        <div className={`p-2 rounded text-xs ${
                          qualityCheck.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {qualityCheck.passed ? '✓ Document validated successfully' : 
                           `⚠ Issues found: ${qualityCheck.issues.join(', ')}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <p>No documents required based on your 221(g) form selections</p>
              <p className="text-sm mt-1">Go back to the 221(g) form checker to select required documents</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Document Preparation Tips
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Make sure all documents are clear and readable</li>
            <li>• Check that names match across all documents</li>
            <li>• Ensure documents are not expired</li>
            <li>• For translations, use certified translators</li>
            <li>• Keep copies of all submitted documents</li>
          </ul>
        </div>
      </CardContent>

      {/* Manual Verification Dialog */}
      <Dialog open={showManualVerify} onOpenChange={setShowManualVerify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Verification: Nikah Nama</DialogTitle>
            <DialogDescription>
              Since Urdu OCR can be unreliable, please manually verify that your document contains the following required details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bride_name" 
                checked={manualChecklist['bride_name']}
                onCheckedChange={(checked) => setManualChecklist(prev => ({...prev, 'bride_name': !!checked}))}
              />
              <Label htmlFor="bride_name">Bride's Full Name is clearly visible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="groom_name" 
                checked={manualChecklist['groom_name']}
                onCheckedChange={(checked) => setManualChecklist(prev => ({...prev, 'groom_name': !!checked}))}
              />
              <Label htmlFor="groom_name">Groom's Full Name is clearly visible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marriage_date" 
                checked={manualChecklist['marriage_date']}
                onCheckedChange={(checked) => setManualChecklist(prev => ({...prev, 'marriage_date': !!checked}))}
              />
              <Label htmlFor="marriage_date">Date of Marriage is legible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="official_stamp" 
                checked={manualChecklist['official_stamp']}
                onCheckedChange={(checked) => setManualChecklist(prev => ({...prev, 'official_stamp': !!checked}))}
              />
              <Label htmlFor="official_stamp">Official Union Council Stamp/Seal is present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="signatures" 
                checked={manualChecklist['signatures']}
                onCheckedChange={(checked) => setManualChecklist(prev => ({...prev, 'signatures': !!checked}))}
              />
              <Label htmlFor="signatures">Signatures of Bride, Groom, and Witnesses are present</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualVerify(false)}>Cancel</Button>
            <Button onClick={handleManualVerifySubmit}>Confirm & Mark Ready</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validation Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Validation Issues Found
            </DialogTitle>
            <DialogDescription>
              We found some issues with your document. Please review them below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {validationErrors.map((error, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-800">
                • {error}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}