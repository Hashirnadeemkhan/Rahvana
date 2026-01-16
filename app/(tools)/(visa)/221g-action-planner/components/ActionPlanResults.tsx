'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircledIcon,
  InfoCircledIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  UploadIcon,
  DownloadIcon,
  CheckIcon,
  Cross2Icon,
  HamburgerMenuIcon
} from '@radix-ui/react-icons';
import { AlertTriangle, FileCheck, Calendar } from 'lucide-react';

import { ActionPlan } from '../utils/actionPlanGenerator';
import { ClassificationResult } from '../utils/classifier';
import { generatePDFPacket,generateCoverLetter } from '../utils/PdfGenerator';

interface ActionPlanResultsProps {
  classification: ClassificationResult | null;
  actionPlan: ActionPlan | null;
  formData: import('../types/221g').FormData | null;
  onBackToForm: () => void;
}

interface UploadedFile {
  file: File;
  uploadDate: Date;
  quality: 'excellent' | 'good' | 'needs-review';
}

export default function ActionPlanResults({
  classification,
  actionPlan,
  formData,
  onBackToForm
}: ActionPlanResultsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Document management
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedFile[]>>({});
  const [docQualityChecks, setDocQualityChecks] = useState<Record<string, {
    passed: boolean;
    issues: string[];
  }>>({});

  // Packet generation
  const [coverLetterData, setCoverLetterData] = useState({
    applicantName: '',
    caseNumber: formData?.caseNumber || '',
    interviewDate: formData?.interviewDate || '',
    embassy: formData?.embassy || 'islamabad',
    additionalNotes: ''
  });

  // Restore progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('221gActionPlanProgress');
    if (savedProgress) {
      try {
        const progressState = JSON.parse(savedProgress);
        setCurrentStepIndex(progressState.currentStepIndex || 0);
        setCompletedSteps(progressState.completedSteps || []);
        setUploadedDocs(progressState.uploadedDocs || {});
        setDocQualityChecks(progressState.docQualityChecks || {});
        setCoverLetterData(prev => ({
          ...prev,
          ...progressState.coverLetterData
        }));
      } catch (error) {
        console.error('Error restoring progress:', error);
      }
    }
  }, []); 

  // Inquiry tracking
  const [inquiries, setInquiries] = useState<{
    date: Date;
    type: string;
    status: 'sent' | 'pending' | 'responded';
  }[]>([]);

  if (!actionPlan || !classification) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-center text-gray-600">No action plan available</p>
      </div>
    );
  }

  const currentStep = actionPlan.stages[currentStepIndex];
  const totalSteps = actionPlan.stages.length;
  const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);
  const allStepsCompleted = completedSteps.length === totalSteps;

  const handleMarkComplete = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleRevertStep = (stepIndex: number) => {
    setCompletedSteps(prev => prev.filter(step => step !== stepIndex));
  };

  // Save progress to localStorage before navigating back to form
  const handleBackToForm = () => {
    const progressState = {
      currentStepIndex,
      completedSteps,
      uploadedDocs,
      docQualityChecks,
      coverLetterData
    };

    localStorage.setItem('221gActionPlanProgress', JSON.stringify(progressState));
    onBackToForm();
  };

  const handleFileUpload = (docId: string, files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      uploadDate: new Date(),
      quality: checkFileQuality(file)
    }));

    setUploadedDocs(prev => ({
      ...prev,
      [docId]: [...(prev[docId] || []), ...newFiles]
    }));

    performQualityCheck(docId, newFiles);
  };

  const handleRemoveFile = (docId: string, fileIndex: number) => {
    setUploadedDocs(prev => {
      const currentFiles = prev[docId] || [];
      const updatedFiles = currentFiles.filter((_, idx) => idx !== fileIndex);

      if (updatedFiles.length === 0) {
        const newUploadedDocs = { ...prev };
        delete newUploadedDocs[docId];
        return newUploadedDocs;
      }

      return {
        ...prev,
        [docId]: updatedFiles
      };
    });
  };

  const checkFileQuality = (file: File): 'excellent' | 'good' | 'needs-review' => {
    const sizeMB = file.size / (1024 * 1024);
    const isPDF = file.type === 'application/pdf';
    
    if (isPDF && sizeMB < 10 && sizeMB > 0.1) return 'excellent';
    if (sizeMB > 20) return 'needs-review';
    return 'good';
  };

  const performQualityCheck = (docId: string, files: UploadedFile[]) => {
    const issues: string[] = [];
    
    files.forEach(({ file, quality }) => {
      if (quality === 'needs-review') {
        if (file.size > 20 * 1024 * 1024) {
          issues.push(`File ${file.name} is too large (> 20MB)`);
        }
        if (file.size < 100 * 1024) {
          issues.push(`File ${file.name} might be too small - check quality`);
        }
      }
    });

    setDocQualityChecks(prev => ({
      ...prev,
      [docId]: {
        passed: issues.length === 0,
        issues
      }
    }));
  };

  const handleDownloadPacket = async () => {
    try {
      await generatePDFPacket({
        coverLetterData,
        actionPlanStages: actionPlan.stages,
        uploadedDocs
      });
    } catch (error) {
      console.error('Error generating PDF packet:', error);
      alert('There was an error generating your PDF packet. Please try again or contact support if the issue persists.');
    }
  };

  const isStepCompleted = (index: number) => completedSteps.includes(index);
  const isStepAccessible = (index: number) => index === 0 || completedSteps.includes(index - 1);

  // Ref for tracking document scrolling (for UI)
  const documentSectionsRef = useRef<Record<string, HTMLElement | null>>({});

  // Function to scroll to a specific document section in UI
  const scrollToDocumentSection = (sectionId: string) => {
    const element = documentSectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mb-4 w-full justify-start"
          >
            <HamburgerMenuIcon className="w-4 h-4 mr-2" />
            {!sidebarCollapsed && "Collapse"}
          </Button>

          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Journey Progress
                </h2>
                <span className="text-sm font-bold text-teal-600">
                  {progressPercentage}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <p className="text-xs text-gray-500">
                {completedSteps.length} of {totalSteps} steps completed
              </p>
            </>
          )}
        </div>

        {/* Steps List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {!sidebarCollapsed && (
              <div className="mb-4">
                <Badge variant="outline" className="w-full justify-center py-2">
                  {classification.description}
                </Badge>
              </div>
            )}

            {actionPlan.stages.map((stage, index) => {
              const isCompleted = isStepCompleted(index);
              const isCurrent = index === currentStepIndex;
              const isAccessible = isStepAccessible(index);

              return (
                <button
                  key={index}
                  onClick={() => (isAccessible || isCompleted) && setCurrentStepIndex(index)}
                  disabled={!isAccessible && !isCompleted}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-teal-50 border-l-4 border-teal-500 shadow-sm'
                      : isCompleted
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  } ${!isAccessible && !isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {!sidebarCollapsed && (
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-teal-500' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckIcon className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs font-semibold text-white">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isCurrent ? 'text-teal-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {stage.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{stage.timeframe}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Back Button */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBackToForm}
              className="w-full"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {!allStepsCompleted ? (
            <>
              {/* Step Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">
                    Step {currentStepIndex + 1} of {totalSteps}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {currentStep.timeframe}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentStep.title}
                </h1>
                <p className="text-lg text-gray-600">
                  Complete these actions to move forward with your case
                </p>
              </div>

              <Tabs defaultValue="actions" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="actions" className="mt-6">
                  <Card>
                    <CardHeader className="bg-teal-50">
                      <CardTitle className="text-lg font-semibold text-teal-900 flex items-center">
                        <CheckCircledIcon className="w-5 h-5 mr-2" />
                        Required Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {currentStep.actions.map((action, idx) => (
                          <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-teal-600">{idx + 1}</span>
                            </div>
                            <p className="text-gray-800 leading-relaxed flex-1">{action}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  {currentStep.documents && currentStep.documents.length > 0 ? (
                    <Card>
                      <CardHeader className="bg-amber-50">
                        <CardTitle className="text-lg font-semibold text-amber-900 flex items-center">
                          <FileTextIcon className="w-5 h-5 mr-2" />
                          Required Documents ({currentStep.documents.filter(Boolean).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {currentStep.documents.filter(Boolean).map((doc, idx) => {
                            const docId = `step-${currentStepIndex}-doc-${idx}`;
                            const hasUploads = uploadedDocs[docId]?.length > 0;
                            const qualityCheck = docQualityChecks[docId];

                            return (
                              <div
                                key={idx}
                                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                                ref={el => documentSectionsRef.current[docId] = el}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <p
                                    className="font-medium text-gray-900 flex items-center cursor-pointer hover:text-blue-600 hover:underline"
                                    onClick={() => scrollToDocumentSection(docId)}
                                  >
                                    <FileCheck className="w-4 h-4 mr-2 text-gray-400" />
                                    {doc}
                                  </p>
                                  {hasUploads && (
                                    <Badge variant={qualityCheck?.passed ? "default" : "destructive"} className="bg-green-500">
                                      <CheckIcon className="w-3 h-3 mr-1" />
                                      {uploadedDocs[docId].length} file(s)
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => e.target.files && handleFileUpload(docId, e.target.files)}
                                    className="flex-1"
                                  />
                                  <Button size="sm" variant="outline">
                                    <UploadIcon className="w-4 h-4" />
                                  </Button>
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
                                            onClick={() => handleRemoveFile(docId, fileIdx)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            title="Remove file"
                                          >
                                            <Cross2Icon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {qualityCheck && !qualityCheck.passed && (
                                  <Alert variant="destructive" className="mt-3">
                                    <AlertDescription>
                                      {qualityCheck.issues.join(', ')}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-gray-500">
                        No specific documents required for this step
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="tips" className="mt-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                        <InfoCircledIcon className="w-5 h-5 mr-2" />
                        Tips & Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentStep.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                            <span className="text-blue-500 text-xl">💡</span>
                            <span className="text-blue-900 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
                  disabled={currentStepIndex === 0}
                  size="lg"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-sm text-gray-500">
                  Step {currentStepIndex + 1} of {totalSteps}
                </div>

                <Button
                  onClick={completedSteps.includes(currentStepIndex) ? () => handleRevertStep(currentStepIndex) : handleMarkComplete}
                  className={completedSteps.includes(currentStepIndex) ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-teal-500 hover:bg-teal-600 text-white"}
                  size="lg"
                >
                  {completedSteps.includes(currentStepIndex) ? (
                    <>
                      <Cross2Icon className="w-4 h-4 mr-2" />
                      Revert Step
                    </>
                  ) : (
                    <>
                      Mark Complete
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* Completion & Packet Generation */
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircledIcon className="w-16 h-16 text-green-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Congratulations! 🎉
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  You&apos;ve completed all preparation steps. Now let&apos;s create your submission packet.
                </p>
              </div>

              {/* Packet Builder */}
              <Card className="max-w-4xl mx-auto mb-8 text-left">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Submission Packet Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">Applicant Name *</Label>
                      <Input
                        value={coverLetterData.applicantName}
                        onChange={(e) => setCoverLetterData({...coverLetterData, applicantName: e.target.value})}
                        placeholder="Full name as on passport"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">Case Number *</Label>
                      <Input
                        value={coverLetterData.caseNumber}
                        onChange={(e) => setCoverLetterData({...coverLetterData, caseNumber: e.target.value})}
                        placeholder="From 221(g) letter"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">Interview Date *</Label>
                      <Input
                        type="date"
                        value={coverLetterData.interviewDate}
                        onChange={(e) => setCoverLetterData({...coverLetterData, interviewDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">Embassy *</Label>
                      <Input
                        value={coverLetterData.embassy}
                        onChange={(e) => setCoverLetterData({...coverLetterData, embassy: e.target.value})}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium mb-2">Additional Notes (Optional)</Label>
                    <Textarea
                      value={coverLetterData.additionalNotes}
                      onChange={(e) => setCoverLetterData({...coverLetterData, additionalNotes: e.target.value})}
                      placeholder="Any additional information for the consular officer"
                      rows={4}
                    />
                  </div>

                  <Alert>
                    <FileCheck className="h-4 w-4" />
                    <AlertDescription>
                      Your packet will include: Cover letter, Document index, and all uploaded documents
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Download Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={handleDownloadPacket}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-lg px-8"
                  disabled={!coverLetterData.applicantName || !coverLetterData.caseNumber}
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Generate Packet (PDF)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                  onClick={() => {
                    const coverLetter = generateCoverLetter(coverLetterData, actionPlan.stages);
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Cover Letter Preview</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 40px; }
                              h1 { color: #1f2937; }
                              pre { white-space: pre-wrap; }
                            </style>
                          </head>
                          <body>
                            <h1>Cover Letter Preview</h1>
                            <pre>${coverLetter.replace(/\n/g, '<br>')}</pre>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                    }
                  }}
                >
                  <FileTextIcon className="w-5 h-5 mr-2" />
                  Preview Cover Letter
                </Button>
              </div>

              {/* Next Steps */}
              <Card className="max-w-3xl mx-auto bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Important: Next Steps After Download
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-2 text-yellow-900">
                    <li className="flex items-start">
                      <CheckCircledIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      Review the complete packet for accuracy and completeness
                    </li>
                    <li className="flex items-start">
                      <CheckCircledIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      Submit via your embassy&apos;s specified method (courier/email/in-person)
                    </li>
                    <li className="flex items-start">
                      <CheckCircledIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      Keep proof of submission (tracking number, receipt, confirmation email)
                    </li>
                    <li className="flex items-start">
                      <CheckCircledIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      Monitor your CEAC status regularly (every 2-3 days)
                    </li>
                    <li className="flex items-start">
                      <CheckCircledIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      Wait 4-6 weeks before sending a status inquiry
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}