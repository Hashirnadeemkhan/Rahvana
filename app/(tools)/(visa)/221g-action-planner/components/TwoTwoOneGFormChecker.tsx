import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TwoTwoOneGFormCheckerProps {
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
  onNext: () => void;
}

// Define the actual fields from a typical 221(g) form
const TWENTY_TWO_ONE_G_FORM_FIELDS = [
  {
    id: 'sec_214b',
    title: '(214)(b)',
    description: 'Failure to establish eligibility for the benefits sought',
    category: 'eligibility',
    checked: false
  },
  {
    id: 'sec_221g_a_1',
    title: '221(g)(a)(1)',
    description: 'Failure to establish applicants eligibility for the benefits sought',
    category: 'eligibility',
    checked: false
  },
  {
    id: 'sec_221g_a_2',
    title: '221(g)(a)(2)',
    description: 'Failure to provide required documentation',
    category: 'documentation',
    checked: false
  },
  {
    id: 'sec_221g_b',
    title: '221(g)(b)',
    description: 'Requires additional administrative processing',
    category: 'processing',
    checked: false
  },
  {
    id: 'financial_docs',
    title: 'Financial Documents Required',
    description: 'Income/tax documents, Affidavit of Support (Form I-864), employment verification',
    category: 'financial',
    checked: false
  },
  {
    id: 'civil_docs',
    title: 'Civil Documents Required',
    description: 'Birth certificates, marriage certificates, divorce/death certificates',
    category: 'civil',
    checked: false
  },
  {
    id: 'police_cert',
    title: 'Police Certificates',
    description: 'Local, state, and federal police certificates',
    category: 'civil',
    checked: false
  },
  {
    id: 'security_clearance',
    title: 'Security Clearance',
    description: 'Additional security screening required',
    category: 'security',
    checked: false
  },
  {
    id: 'medical_issues',
    title: 'Medical Examination Issues',
    description: 'Incomplete or deficient medical examination',
    category: 'medical',
    checked: false
  },
  {
    id: 'translation_req',
    title: 'Document Translation Required',
    description: 'Documents not in English require certified translation',
    category: 'documentation',
    checked: false
  },
  {
    id: 'passport_issue',
    title: 'Passport Issues',
    description: 'Passport problems requiring resolution',
    category: 'travel',
    checked: false
  },
  {
    id: 'name_change',
    title: 'Name Change Documentation',
    description: 'Legal documentation of name changes required',
    category: 'civil',
    checked: false
  },
  {
    id: 'prior_visa_issues',
    title: 'Prior Visa Issues',
    description: 'Issues with previous visa applications or entries',
    category: 'history',
    checked: false
  },
  {
    id: 'fraud_allegation',
    title: 'Fraud Allegation',
    description: 'Allegations of fraud requiring investigation',
    category: 'security',
    checked: false
  },
  {
    id: 'immigration_violation',
    title: 'Immigration Violations',
    description: 'Potential violations of immigration law',
    category: 'legal',
    checked: false
  },
  {
    id: 'public_charge',
    title: 'Public Charge Concerns',
    description: 'Failure to demonstrate non-dependency on government benefits',
    category: 'financial',
    checked: false
  },
  {
    id: 'work_authorization',
    title: 'Work Authorization',
    description: 'Documentation of work authorization required',
    category: 'employment',
    checked: false
  },
  {
    id: 'student_status',
    title: 'Student Status Verification',
    description: 'Verification of student status and enrollment',
    category: 'education',
    checked: false
  },
  {
    id: 'relationship_verification',
    title: 'Relationship Verification',
    description: 'Additional evidence of relationship required',
    category: 'family',
    checked: false
  },
  {
    id: 'address_verification',
    title: 'Address Verification',
    description: 'Verification of U.S. address required',
    category: 'residence',
    checked: false
  }
];

export default function TwoTwoOneGFormChecker({ 
  selectedItems, 
  onSelectionChange, 
  onNext 
}: TwoTwoOneGFormCheckerProps) {
  const handleCheckboxChange = (itemId: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    onSelectionChange(newSelected);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700">221(g) Form Checker</CardTitle>
        <CardDescription>
          Check the boxes that match your actual 221(g) letter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">221(g) FORM - REFUSAL UNDER SECTION 214(b)</h3>
          <p className="text-sm text-blue-700">
            <strong>TO:</strong> [APPLICANT NAME] 
            <br />
            <strong>CASE NO:</strong> [CASE NUMBER] 
            <br />
            <strong>DATE:</strong> [DATE]
          </p>
        </div>

        <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h4 className="font-bold text-lg mb-3">SELECT THE APPROPRIATE REASON(S) FOR ADMINISTRATIVE PROCESSING:</h4>
            
            {TWENTY_TWO_ONE_G_FORM_FIELDS.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border mb-2 ${
                  selectedItems.includes(item.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="pt-1">
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={item.id} 
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.title}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 flex items-center">
            <span className="mr-2">💡</span>
            Instructions
          </h4>
          <p className="text-sm text-yellow-700 mt-1">
            Carefully compare each item with your actual 221(g) letter. Check all items that 
            match your specific situation. Based on your selections, you&apos;ll receive tailored 
            guidance on next steps.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onNext} 
            disabled={selectedItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue with Selected Items ({selectedItems.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}