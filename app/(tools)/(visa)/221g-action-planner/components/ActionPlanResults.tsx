'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ClockIcon,
  FileTextIcon,
  CheckCircledIcon,
  InfoCircledIcon,
  ArrowLeftIcon
} from '@radix-ui/react-icons';

import { ActionPlan } from '../utils/actionPlanGenerator';
import { ClassificationResult } from '../utils/classifier';
import DocumentChecklist from './DocumentChecklist';
import DocumentQualityChecker from './DocumentQualityChecker';

interface ActionPlanResultsProps {
  classification: ClassificationResult | null;
  actionPlan: ActionPlan | null;
  formData: import('../types/221g').FormData | null;
  onBackToForm: () => void;
}

export default function ActionPlanResults({
  classification,
  actionPlan,
  formData,
  onBackToForm
}: ActionPlanResultsProps) {
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, 'missing' | 'in-progress' | 'ready' | 'submitted'>>({});
  // const [qualityCheckResults, setQualityCheckResults] = useState<{documentId: string, issues: {severity: 'critical' | 'warning' | 'info', message: string, suggestion: string}[], score: number}[]>([]);

  const handleDocumentStatusChange = (docId: string, status: 'missing' | 'in-progress' | 'ready' | 'submitted') => {
    setDocumentStatuses(prev => ({
      ...prev,
      [docId]: status
    }));
  };


  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={onBackToForm}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Form
        </Button>
        {classification && (
          <Badge variant="secondary" className="text-lg py-1 px-3">
            {classification.confidence.toUpperCase()} CONFIDENCE
          </Badge>
        )}
      </div>

      {actionPlan && classification && (
        <>
          <Card className="mb-8">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-blue-800">
                  {actionPlan.title}
                </CardTitle>
              </div>
              <p className="text-gray-600 mt-2">{actionPlan.description}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 flex items-center">
                  <InfoCircledIcon className="mr-2 h-5 w-5" />
                  Scenario: {classification.description}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Based on your responses, our system has identified this specific situation.
                  The action plan below is tailored to your unique circumstances.
                </p>

                {actionPlan.selected221gItems && actionPlan.selected221gItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-yellow-800 text-sm">Selected 221(g) Items:</h4>
                    <ul className="mt-1 space-y-1">
                      {actionPlan.selected221gItems.map((item, index) => (
                        <li key={index} className="text-sm text-yellow-700 flex items-start">
                          <span className="mr-2">•</span>
                          {item.replace(/_/g, ' ').split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-8">
                  {actionPlan.stages.map((stage, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <ClockIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{stage.title}</h3>
                          <p className="text-sm text-gray-500 mb-3">{stage.timeframe}</p>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                              <CheckCircledIcon className="mr-2 h-4 w-4" />
                              Actions to Take
                            </h4>
                            <ul className="space-y-2">
                              {stage.actions.map((action, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="mr-2 text-blue-500">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                              <InfoCircledIcon className="mr-2 h-4 w-4" />
                              Tips & Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {stage.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="mr-2 text-blue-500">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {stage.documents && stage.documents.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                Required Documents
                              </h4>
                              <ul className="space-y-1">
                                {stage.documents.map((doc, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {index < actionPlan.stages.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Document Checklist Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-700">Document Checklist</CardTitle>
              <p className="text-gray-600">
                Track the status of required documents based on your 221(g) requirements
              </p>
            </CardHeader>
            <CardContent>
              <DocumentChecklist
                selectedItems={actionPlan.selected221gItems || []}
                embassy={formData?.embassy || 'islamabad'}
                onStatusChange={handleDocumentStatusChange}
              />
            </CardContent>
          </Card>

          {/* Document Quality Checker Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-700">Document Quality Checker</CardTitle>
              <p className="text-gray-600">
                Check your documents for common issues before submission
              </p>
            </CardHeader>
            <CardContent>
              <DocumentQualityChecker
                documents={[
                  { id: 'i864', name: 'Affidavit of Support (Form I-864)', type: 'financial', status: documentStatuses['i864'] || 'missing' },
                  { id: 'tax-transcripts', name: 'Federal Tax Transcripts', type: 'financial', status: documentStatuses['tax-transcripts'] || 'missing' },
                  { id: 'employment-letter', name: 'Employment Verification Letter', type: 'financial', status: documentStatuses['employment-letter'] || 'missing' },
                  { id: 'pay-stubs', name: 'Recent Pay Stubs', type: 'financial', status: documentStatuses['pay-stubs'] || 'missing' },
                  { id: 'birth-cert', name: 'Birth Certificate (NADRA)', type: 'civil', status: documentStatuses['birth-cert'] || 'missing' },
                  { id: 'marriage-cert', name: 'Marriage Certificate (Nikah Nama)', type: 'civil', status: documentStatuses['marriage-cert'] || 'missing' },
                  { id: 'police-cert', name: 'Police Certificate', type: 'civil', status: documentStatuses['police-cert'] || 'missing' },
                  { id: 'passport', name: 'Passport', type: 'travel', status: documentStatuses['passport'] || 'missing' },
                  { id: 'medical-exam', name: 'Medical Examination', type: 'medical', status: documentStatuses['medical-exam'] || 'missing' },
                  { id: 'translations', name: 'Certified Translations', type: 'supporting', status: documentStatuses['translations'] || 'missing' },
                ]}
                onCheckComplete={() => {}}
              />
            </CardContent>
          </Card>
        </>
      )}

      <div className="text-center">
        <Button onClick={onBackToForm} className="w-full md:w-auto">
          Review and Update Information
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Remember to save this plan and follow the steps in order for the best results.
        </p>
      </div>
    </div>
  );
}