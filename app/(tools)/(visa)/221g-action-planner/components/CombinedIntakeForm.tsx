'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import Actual221GFormChecker from './Actual221GFormChecker';
import { FormSelections, FormData } from '../types/221g';

const VISA_TYPES = [
  { value: 'IR1', label: 'IR1 - Spouse of U.S. Citizen' },
  { value: 'CR1', label: 'CR1 - Conditional Spouse of U.S. Citizen' },
  { value: 'IR2', label: 'IR2 - Unmarried Child Under 21 of U.S. Citizen' },
  { value: 'IR5', label: 'IR5 - Parent of U.S. Citizen' },
  { value: 'F1', label: 'F1 - Unmarried Son/Daughter of U.S. Citizen' },
  { value: 'F2A', label: 'F2A - Spouse/Child of Permanent Resident' },
  { value: 'F2B', label: 'F2B - Unmarried Son/Daughter of Permanent Resident' },
  { value: 'F3', label: 'F3 - Married Son/Daughter of U.S. Citizen' },
  { value: 'F4', label: 'F4 - Sibling of U.S. Citizen' },
  { value: 'K1', label: 'K1 - Fiancé(e) of U.S. Citizen' },
  { value: 'Other', label: 'Other (Please specify)' },
];

const EMBASSIES = [
  { value: 'islamabad', label: 'U.S. Embassy Islamabad, Pakistan' },
  { value: 'karachi', label: 'U.S. Consulate Karachi, Pakistan' },
  { value: 'lahore', label: 'U.S. Consulate Lahore, Pakistan' },
  { value: 'other', label: 'Other Embassy' },
];

const OFFICER_REQUESTS = [
  { value: 'financial', label: 'Financial documents (I-864, tax transcripts, employment letters)' },
  { value: 'civil', label: 'Civil documents (birth certificates, marriage certificates, police certificates)' },
  { value: 'security', label: 'Security clearance (background checks, additional screening)' },
  { value: 'legal', label: 'Legal documents (divorce decrees, death certificates, court records)' },
  { value: 'medical', label: 'Medical examination corrections' },
  { value: 'translation', label: 'Document translations' },
  { value: 'other', label: 'Other (please specify)' },
];

interface CombinedFormProps {
  onSubmit: (data: import('../types/221g').FormData, selected221gItems: FormSelections) => void;
}

export default function CombinedIntakeForm({ onSubmit }: CombinedFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<import('../types/221g').FormData>({
    visaType: '',
    interviewDate: '',
    embassy: 'islamabad',
    letterReceived: null,
    officerRequests: [],
    passportKept: null,
    ceacStatus: '',
    ceacUpdateDate: '',
    caseNumber: '',
    additionalNotes: '',
  });
  const [selected221gItems, setSelected221gItems] = useState<FormSelections>({});
  const [showFormChecker, setShowFormChecker] = useState(false);

  const steps = [
    { id: 0, title: 'Visa Details', description: 'Basic information about your visa application' },
    { id: 1, title: 'Interview Outcome', description: 'What happened during your interview' },
    { id: 2, title: '221(g) Letter', description: 'Details about your 221(g) letter' },
    { id: 3, title: '221(g) Items', description: 'Check items that match your letter' },
    { id: 4, title: 'CEAC Status', description: 'Current status on CEAC system' },
    { id: 5, title: 'Additional Info', description: 'Any other relevant details' },
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (request: string) => {
    setFormData(prev => {
      const requests = [...prev.officerRequests];
      if (requests.includes(request)) {
        return { ...prev, officerRequests: requests.filter(r => r !== request) };
      } else {
        return { ...prev, officerRequests: [...requests, request] };
      }
    });
  };

  const handleSubmit = () => {
    onSubmit(formData, selected221gItems);
  };

  const nextStep = () => {
    if (currentStep === 2 && formData.letterReceived) {
      // If user received a 221(g) letter, show the form checker
      setShowFormChecker(true);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (showFormChecker) {
      setShowFormChecker(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + (showFormChecker ? 0.5 : 0) + 1) / (steps.length + (formData.letterReceived ? 0.5 : 0))) * 100;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">221(g) / Administrative Processing Action Planner</CardTitle>
          <CardDescription>
            Get your personalized action plan after your visa interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={progress} className="w-full h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Step {currentStep + (showFormChecker ? 0.5 : 0) + 1} of {steps.length + (formData.letterReceived ? 0.5 : 0)}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Step 0: Visa Details */}
          {currentStep === 0 && !showFormChecker && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Visa Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Select value={formData.visaType} onValueChange={(value) => handleInputChange('visaType', value)}>
                    <SelectTrigger id="visaType">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISA_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="embassy">Embassy/Consulate</Label>
                  <Select value={formData.embassy} onValueChange={(value) => handleInputChange('embassy', value)}>
                    <SelectTrigger id="embassy">
                      <SelectValue placeholder="Select embassy" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMBASSIES.map((emb) => (
                        <SelectItem key={emb.value} value={emb.value}>
                          {emb.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input 
                  id="interviewDate" 
                  type="date" 
                  value={formData.interviewDate} 
                  onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 1: Interview Outcome */}
          {currentStep === 1 && !showFormChecker && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Interview Outcome</h3>
              
              <div>
                <Label>Did the officer keep your passport?</Label>
                <RadioGroup 
                  value={formData.passportKept?.toString()} 
                  onValueChange={(value) => handleInputChange('passportKept', value === 'true')}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="passport-kept-yes" />
                    <Label htmlFor="passport-kept-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="passport-kept-no" />
                    <Label htmlFor="passport-kept-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>What did the officer request?</Label>
                <div className="mt-2 space-y-2">
                  {OFFICER_REQUESTS.map((request) => (
                    <div key={request.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`request-${request.value}`}
                        checked={formData.officerRequests.includes(request.value)}
                        onCheckedChange={() => handleCheckboxChange(request.value)}
                      />
                      <Label htmlFor={`request-${request.value}`}>{request.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 221(g) Letter */}
          {currentStep === 2 && !showFormChecker && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">221(g) Letter Details</h3>
              
              <div>
                <Label>Did you receive a 221(g) letter?</Label>
                <RadioGroup 
                  value={formData.letterReceived?.toString()} 
                  onValueChange={(value) => handleInputChange('letterReceived', value === 'true')}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="letter-received-yes" />
                    <Label htmlFor="letter-received-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="letter-received-no" />
                    <Label htmlFor="letter-received-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.letterReceived && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseNumber">Case Number (from 221(g) letter)</Label>
                    <Input 
                      id="caseNumber" 
                      value={formData.caseNumber} 
                      onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                      placeholder="Enter case number if available"
                    />
                  </div>

                  <div>
                    <Label>221(g) Letter Items</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      You will check the items that match your 221(g) letter on the next screen
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 221(g) Form Checker - Special step when letter received */}
          {showFormChecker && (
            <Actual221GFormChecker
              selectedItems={selected221gItems}
              onSelectionChange={setSelected221gItems}
              onNext={() => {
                setCurrentStep(3); // Skip to CEAC status after form checker
                setShowFormChecker(false);
              }}
            />
          )}

          {/* Step 3: CEAC Status (was originally step 3, now step 4 if form checker was shown) */}
          {currentStep === (formData.letterReceived ? 3 : 2) && !showFormChecker && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">CEAC Status</h3>
              
              <div>
                <Label htmlFor="ceacStatus">Current CEAC Status</Label>
                <Input 
                  id="ceacStatus" 
                  value={formData.ceacStatus} 
                  onChange={(e) => handleInputChange('ceacStatus', e.target.value)}
                  placeholder="e.g., Administrative Processing, 221(g), Documentarily Qualified"
                />
              </div>
              
              <div>
                <Label htmlFor="ceacUpdateDate">Last CEAC Update Date</Label>
                <Input 
                  id="ceacUpdateDate" 
                  type="date" 
                  value={formData.ceacUpdateDate} 
                  onChange={(e) => handleInputChange('ceacUpdateDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Additional Info (was originally step 4, now step 5 if form checker was shown) */}
          {currentStep === (formData.letterReceived ? 4 : 3) && !showFormChecker && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="additionalNotes">Any additional notes or special circumstances</Label>
                <Textarea 
                  id="additionalNotes" 
                  value={formData.additionalNotes} 
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Describe any special circumstances, additional documents you have, or concerns..."
                  rows={4}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Review Your Information</h4>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">Visa Type:</span> {formData.visaType || 'Not selected'}</li>
                  <li><span className="font-medium">Embassy:</span> {EMBASSIES.find(e => e.value === formData.embassy)?.label || formData.embassy}</li>
                  <li><span className="font-medium">Interview Date:</span> {formData.interviewDate || 'Not provided'}</li>
                  <li><span className="font-medium">Letter Received:</span> {formData.letterReceived === null ? 'Not answered' : formData.letterReceived ? 'Yes' : 'No'}</li>
                  <li><span className="font-medium">CEAC Status:</span> {formData.ceacStatus || 'Not provided'}</li>
                  <li><span className="font-medium">221(g) Items Checked:</span> {Object.values(selected221gItems).filter(value => Boolean(value)).length} items</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0 && !showFormChecker}
            >
              Previous
            </Button>
            
            {!showFormChecker && currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : !showFormChecker && currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>
                Generate My Action Plan
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}