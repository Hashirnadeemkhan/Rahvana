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
  if (selectedItems.some(item =>
    item.includes('i864') ||
    item.includes('tax') ||
    item.includes('irs_transcript') ||
    item.includes('w2') ||
    item.includes('proof_citizenship')
  )) {
    // Check for specific sponsor types
    const isPetitioner = selectedItems.includes('i864_petitioner');
    const isJointSponsor = selectedItems.includes('i864_joint_sponsor');
    const isI864A = selectedItems.includes('i864a');
    const isI134 = selectedItems.includes('i134');
    const isI864W = selectedItems.includes('i864w');
    const isTax1040 = selectedItems.includes('tax_1040');
    const isW2 = selectedItems.includes('w2');
    const isIRSTranscript = selectedItems.includes('irs_transcript');
    const isProofCitizenship = selectedItems.includes('proof_citizenship');
    const isDomicile = selectedItems.includes('domicile');

    requiredDocuments.push(
      {
        id: 'i864',
        name: 'Affidavit of Support (Form I-864)',
        description: `Financial sponsorship form proving income requirements ${isPetitioner ? '(Petitioner)' : ''} ${isJointSponsor ? '(Joint Sponsor)' : ''}`,
        category: 'financial',
        required: true,
        status: 'missing'
      }
    );

    // Add tax documents based on specific selections
    if (isTax1040 || isIRSTranscript) {
      requiredDocuments.push(
        {
          id: 'tax-transcripts',
          name: 'Federal Tax Transcripts',
          description: `IRS tax transcripts for the last 3 years ${isTax1040 ? '(Form 1040)' : ''} ${isIRSTranscript ? '(IRS Transcript)' : ''}`,
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isW2 || isIRSTranscript) {
      requiredDocuments.push(
        {
          id: 'employment-letter',
          name: 'Employment Verification Letter',
          description: `Letter from sponsor's employer verifying job and salary ${isW2 ? '(W-2 related)' : ''} ${isIRSTranscript ? '(IRS Transcript related)' : ''}`,
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isW2) {
      requiredDocuments.push(
        {
          id: 'pay-stubs',
          name: 'Recent Pay Stubs',
          description: `Pay stubs for the last 6 months ${isW2 ? '(W-2 related)' : ''}`,
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    // Add specific financial forms if selected
    if (isI864A) {
      requiredDocuments.push(
        {
          id: 'i864a',
          name: 'Contract Between Sponsor and Household Member (Form I-864A)',
          description: 'Contract between sponsor and household member (if applicable)',
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isI134) {
      requiredDocuments.push(
        {
          id: 'i134',
          name: 'Affidavit of Support (Form I-134)',
          description: 'Affidavit of support (if applicable)',
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isI864W) {
      requiredDocuments.push(
        {
          id: 'i864w',
          name: 'Request for Exemption of I-864 (Form I-864W)',
          description: 'Request for exemption of I-864 (if applicable)',
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isProofCitizenship) {
      requiredDocuments.push(
        {
          id: 'proof-citizenship',
          name: 'Proof of U.S. Citizenship',
          description: 'Proof of U.S. citizenship or LPR status',
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }

    if (isDomicile) {
      requiredDocuments.push(
        {
          id: 'domicile',
          name: 'Domicile Evidence',
          description: 'Evidence of domicile in the United States',
          category: 'financial',
          required: true,
          status: 'missing'
        }
      );
    }
  }

  // Civil documents
  if (selectedItems.some(item =>
    item.includes('nadra_birth_cert') ||
    item.includes('nadra_birth_cert_petitioner') ||
    item.includes('nadra_birth_cert_beneficiary')
  )) {
    const isPetitioner = selectedItems.includes('nadra_birth_cert_petitioner');
    const isBeneficiary = selectedItems.includes('nadra_birth_cert_beneficiary');

    requiredDocuments.push(
      {
        id: 'birth-cert',
        name: 'Birth Certificate (NADRA)',
        description: `Certified copy of birth certificate ${isPetitioner ? '(Petitioner)' : ''} ${isBeneficiary ? '(Beneficiary)' : ''}`,
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  if (selectedItems.some(item =>
    item.includes('nadra_marriage_cert') ||
    item.includes('nikah_nama')
  )) {
    const isPetitioner = selectedItems.includes('nadra_marriage_cert') && selectedItems.includes('nadra_birth_cert_petitioner');
    const isBeneficiary = selectedItems.includes('nikah_nama');

    requiredDocuments.push(
      {
        id: 'marriage-cert',
        name: 'Marriage Certificate (Nikah Nama)',
        description: `Certified copy of marriage certificate ${isPetitioner ? '(Petitioner)' : ''} ${isBeneficiary ? '(Beneficiary)' : ''}`,
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  if (selectedItems.some(item => item.includes('police_certificate'))) {
    const country = selectedItems.find(item => item.includes('police_certificate_country')) || '';
    requiredDocuments.push(
      {
        id: 'police-cert',
        name: 'Police Certificate',
        description: `Police certificate from relevant jurisdiction ${country ? `for country: ${country}` : ''}`,
        category: 'civil',
        required: true,
        status: 'missing'
      }
    );
  }

  // Divorce documents
  if (selectedItems.some(item =>
    item.includes('us_divorce_decree') ||
    item.includes('nadra_divorce_cert') ||
    item.includes('nadra_divorce_cert_petitioner') ||
    item.includes('nadra_divorce_cert_beneficiary')
  )) {
    const isPetitioner = selectedItems.includes('nadra_divorce_cert_petitioner');
    const isBeneficiary = selectedItems.includes('nadra_divorce_cert_beneficiary');

    requiredDocuments.push(
      {
        id: 'divorce-decree',
        name: 'Divorce Decree',
        description: `Certified copy of divorce decree ${isPetitioner ? '(Petitioner)' : ''} ${isBeneficiary ? '(Beneficiary)' : ''}`,
        category: 'legal',
        required: true,
        status: 'missing'
      }
    );
  }

  // Legal documents
  if (selectedItems.some(item =>
    item.includes('us_divorce_decree') ||
    item.includes('nadra_divorce_cert') ||
    item.includes('nadra_divorce_cert_petitioner') ||
    item.includes('nadra_divorce_cert_beneficiary')
  )) {
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

  if (selectedItems.some(item => item.includes('death_certificate'))) {
    const deathCertName = selectedItems.find(item => item.includes('death_certificate_name')) || '';
    requiredDocuments.push(
      {
        id: 'death-cert',
        name: 'Death Certificate',
        description: `Certified copy of death certificate ${deathCertName ? `for: ${deathCertName}` : ''}`,
        category: 'legal',
        required: true,
        status: 'missing'
      }
    );
  }

  // Passport
  if (selectedItems.includes('passport')) {
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
  if (selectedItems.includes('medical_examination')) {
    const isMedicalIssue = selectedItems.includes('medical_examination');
    requiredDocuments.push(
      {
        id: 'medical-exam',
        name: 'Medical Examination',
        description: `Completed medical examination by panel physician ${isMedicalIssue ? '(Addressing medical examination issues)' : ''}`,
        category: 'medical',
        required: true,
        status: 'missing'
      }
    );
  }

  // Translations
  if (selectedItems.includes('english_translation')) {
    const translationDoc = selectedItems.find(item => item.includes('english_translation_document')) || 'specific document';
    requiredDocuments.push(
      {
        id: 'translations',
        name: 'Certified Translations',
        description: `Certified English translations of non-English documents ${translationDoc ? `(for: ${translationDoc})` : ''}`,
        category: 'supporting',
        required: true,
        status: 'missing'
      }
    );
  }

  // DNA Test
  if (selectedItems.includes('dna_test')) {
    const dnaTestName = selectedItems.find(item => item.includes('dna_test_name')) || 'specific individual';
    requiredDocuments.push(
      {
        id: 'dna-test',
        name: 'DNA Test Results',
        description: `DNA test results ${dnaTestName ? `for: ${dnaTestName}` : ''}`,
        category: 'supporting',
        required: true,
        status: 'missing'
      }
    );
  }

  // Other documents
  if (selectedItems.includes('other')) {
    const otherDetails = selectedItems.find(item => item.includes('other_details')) || 'additional requirements';
    requiredDocuments.push(
      {
        id: 'other-docs',
        name: 'Other Required Documents',
        description: `Other required documents: ${otherDetails}`,
        category: 'supporting',
        required: true,
        status: 'missing'
      }
    );
  }

  // Add recommended documents based on embassy
  if (embassy === 'islamabad') {
    // Only add NADRA Family Registration if it's not already required based on user's selections
    if (!selectedItems.includes('nadra_family_reg')) {
      requiredDocuments.push(
        {
          id: 'nadra-family-reg',
          name: 'NADRA Family Registration Certificate',
          description: 'Family registration certificate from NADRA (recommended for Islamabad Embassy)',
          category: 'civil',
          required: false,
          recommended: true,
          status: 'missing'
        }
      );
    } else {
      // If user selected nadra_family_reg, add it as required
      requiredDocuments.push(
        {
          id: 'nadra-family-reg',
          name: 'NADRA Family Registration Certificate',
          description: 'Family registration certificate from NADRA (required based on your 221(g) letter)',
          category: 'civil',
          required: true,
          status: 'missing'
        }
      );
    }
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