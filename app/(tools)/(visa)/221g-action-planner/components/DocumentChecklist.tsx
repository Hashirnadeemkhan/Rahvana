import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, FileText } from 'lucide-react';

interface DocumentChecklistProps {
  selectedItems: string[]; // Array of selected 221(g) form items
  embassy: string; // Selected embassy
  onStatusChange: (docId: string, status: 'missing' | 'in-progress' | 'ready' | 'submitted') => void;
}

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  recommended?: boolean;
  submissionMethod?: string;
  status: 'missing' | 'in-progress' | 'ready' | 'submitted';
}

export default function DocumentChecklist({ selectedItems, embassy, onStatusChange }: DocumentChecklistProps) {
  // Map selected 221(g) items to required documents
  const requiredDocuments: DocumentItem[] = [];

  // Financial documents
  if (selectedItems.some(item => item.includes('FINANCIAL') || item.includes('I864'))) {
    requiredDocuments.push(
      {
        id: 'i864',
        name: 'Affidavit of Support (Form I-864)',
        description: 'Financial sponsorship form proving income requirements',
        category: 'financial',
        required: true,
        status: 'missing'
      },
      {
        id: 'tax-transcripts',
        name: 'Federal Tax Transcripts',
        description: 'IRS tax transcripts for the last 3 years',
        category: 'financial',
        required: true,
        status: 'missing'
      },
      {
        id: 'employment-letter',
        name: 'Employment Verification Letter',
        description: 'Letter from sponsor\'s employer verifying job and salary',
        category: 'financial',
        required: true,
        status: 'missing'
      },
      {
        id: 'pay-stubs',
        name: 'Recent Pay Stubs',
        description: 'Pay stubs for the last 6 months',
        category: 'financial',
        required: true,
        status: 'missing'
      }
    );
  }

  // Civil documents
  if (selectedItems.some(item => item.includes('CIVIL_DOCUMENTS') || item.includes('BIRTH_CERT'))) {
    requiredDocuments.push(
      {
        id: 'birth-cert',
        name: 'Birth Certificate (NADRA)',
        description: 'Certified copy of birth certificate',
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  if (selectedItems.some(item => item.includes('MARRIAGE_CERT') || item.includes('NIKAH_NAMA'))) {
    requiredDocuments.push(
      {
        id: 'marriage-cert',
        name: 'Marriage Certificate (Nikah Nama)',
        description: 'Certified copy of marriage certificate',
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  if (selectedItems.some(item => item.includes('POLICE_CERTIFICATE'))) {
    requiredDocuments.push(
      {
        id: 'police-cert',
        name: 'Police Certificate',
        description: 'Police certificate from relevant jurisdiction',
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  // Legal documents
  if (selectedItems.some(item => item.includes('LEGAL_DOCUMENTS') || item.includes('DIVORCE_CERT'))) {
    requiredDocuments.push(
      {
        id: 'divorce-decree',
        name: 'Divorce Decree',
        description: 'Certified copy of divorce decree',
        category: 'legal',
        required: true,
        status: 'missing'
      }
    );
  }

  if (selectedItems.some(item => item.includes('DEATH_CERTIFICATE'))) {
    requiredDocuments.push(
      {
        id: 'death-cert',
        name: 'Death Certificate',
        description: 'Certified copy of death certificate',
        category: 'legal',
        required: true,
        status: 'missing'
      }
    );
  }

  // Passport
  if (selectedItems.includes('PASSPORT_ISSUES')) {
    requiredDocuments.push(
      {
        id: 'passport',
        name: 'Passport',
        description: 'Valid passport with at least 6 months validity',
        category: 'travel',
        required: true,
        status: 'missing'
      }
    );
  }

  // Medical
  if (selectedItems.includes('MEDICAL_EXAMINATION_ISSUES')) {
    requiredDocuments.push(
      {
        id: 'medical-exam',
        name: 'Medical Examination',
        description: 'Completed medical examination by panel physician',
        category: 'medical',
        required: true,
        status: 'missing'
      }
    );
  }

  // Add any additional documents based on other selections
  if (selectedItems.includes('TRANSLATION_REQUIREMENTS')) {
    requiredDocuments.push(
      {
        id: 'translations',
        name: 'Certified Translations',
        description: 'Certified English translations of non-English documents',
        category: 'supporting',
        required: true,
        status: 'missing'
      }
    );
  }

  // Add recommended documents based on embassy
  if (embassy === 'islamabad') {
    requiredDocuments.push(
      {
        id: 'nadra-family-reg',
        name: 'NADRA Family Registration Certificate',
        description: 'Family registration certificate from NADRA',
        category: 'civil',
        required: false,
        recommended: true,
        status: 'missing'
      }
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-700">Document Checklist</CardTitle>
          <Badge variant="secondary">{requiredDocuments.length} items</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Track the status of required documents based on your 221(g) requirements
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {requiredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  doc.status === 'missing' ? 'border-red-200 bg-red-50' :
                  doc.status === 'in-progress' ? 'border-yellow-200 bg-yellow-50' :
                  doc.status === 'ready' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="pt-1">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{doc.name}</h3>
                    <Badge 
                      variant={
                        doc.status === 'missing' ? 'destructive' :
                        doc.status === 'in-progress' ? 'secondary' :
                        doc.status === 'ready' ? 'default' :
                        'outline'
                      }
                    >
                      {doc.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{doc.category}</Badge>
                    {doc.required ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : doc.recommended ? (
                      <Badge variant="secondary">Recommended</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant={doc.status === 'missing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusChange(doc.id, 'missing')}
                    className="text-xs"
                  >
                    {doc.status === 'missing' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Missing
                  </Button>
                  <Button
                    variant={doc.status === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusChange(doc.id, 'in-progress')}
                    className="text-xs"
                  >
                    {doc.status === 'in-progress' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    In Progress
                  </Button>
                  <Button
                    variant={doc.status === 'ready' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusChange(doc.id, 'ready')}
                    className="text-xs"
                  >
                    {doc.status === 'ready' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Ready
                  </Button>
                  <Button
                    variant={doc.status === 'submitted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusChange(doc.id, 'submitted')}
                    className="text-xs"
                  >
                    {doc.status === 'submitted' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Submitted
                  </Button>
                </div>
              </div>
            ))}
            
            {requiredDocuments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-300" />
                <p>No specific documents required based on your selections</p>
                <p className="text-sm mt-1">Select items from your 221(g) form to see required documents</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}