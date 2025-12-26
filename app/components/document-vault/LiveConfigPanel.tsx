'use client';

import { useState, useEffect } from 'react';
import { useDocumentVaultStore } from '@/lib/document-vault/store';
import { VisaCategory, ScenarioFlags } from '@/lib/document-vault/types';
import { getVisaCategoryDisplayName } from '@/lib/document-vault/personalization-engine';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

const VISA_CATEGORIES: VisaCategory[] = [
  'IR-1',
  'CR-1',
  'IR-2',
  'CR-2',
  'IR-5',
  'F1',
  'F2A',
  'F2B',
  'F3',
  'F4',
];

export function LiveConfigPanel() {
  const { config, setConfig, updateScenarioFlags, setVisaCategory } = useDocumentVaultStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localCategory, setLocalCategory] = useState<VisaCategory>(config?.visaCategory || 'IR-1');
  const [localFlags, setLocalFlags] = useState<ScenarioFlags>(config?.scenarioFlags || {});
  const [caseId, setCaseId] = useState('');
  const [petitionerName, setPetitionerName] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [jointSponsorName, setJointSponsorName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update only category and flags from config, keep inputs empty
  useEffect(() => {
    if (config) {
      setLocalCategory(config.visaCategory);
      setLocalFlags(config.scenarioFlags || {});
    }
  }, [config]);

  const handleCategoryChange = (category: VisaCategory) => {
    setLocalCategory(category);
    setVisaCategory(category);
  };

  const handleFlagChange = (flag: keyof ScenarioFlags, checked: boolean) => {
    const newFlags = {
      ...localFlags,
      [flag]: checked,
    };
    setLocalFlags(newFlags);
    updateScenarioFlags({ [flag]: checked });
  };

  const handleSaveCaseInfo = async () => {
    if (config) {
      // Validate required fields
      if (!caseId.trim() || !petitionerName.trim() || !beneficiaryName.trim()) {
        toast.error('❌ Please fill all required fields (Case ID, Petitioner, Beneficiary)', {
          duration: 3000,
        });
        return;
      }

      setIsSaving(true);

      // Simulate save delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      setConfig({
        ...config,
        caseId: caseId.trim(),
        petitionerName: petitionerName.trim(),
        beneficiaryName: beneficiaryName.trim(),
        jointSponsorName: jointSponsorName?.trim() || undefined,
      });

      // Show success with preview
      const normalizedCaseId = caseId.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const normalizedName = petitionerName.trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .toUpperCase()
        .substring(0, 30);

      toast.success(
        <div className="space-y-1">
          <p className="font-bold text-sm">✅ Case Information Saved Successfully!</p>
          <p className="text-xs opacity-90">All future uploads will use USCIS naming:</p>
          <code className="text-xs block bg-green-800 bg-opacity-20 p-1 rounded mt-1">
            {normalizedCaseId}_PETITIONER_{normalizedName}_PASSPORT_2024-12-24_v1.pdf
          </code>
        </div>,
        {
          duration: 6000,
          style: {
            background: '#10b981',
            color: 'white',
          },
        }
      );

      setIsSaving(false);
    }
  };

  if (!config) return null;

  return (
    <div className="sticky top-6 space-y-4">
      {/* Header */}
      <Card className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand" />
            <h3 className="font-semibold text-lg">Configuration</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </Card>

      {isExpanded && (
        <>
          {/* Visa Category Selection */}
          <Card className="p-4">
            <div className="mb-3">
              <Label className="text-sm font-semibold">Visa Category</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Select your visa type
              </p>
            </div>
            <div className="space-y-2">
              {VISA_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    localCategory === category
                      ? 'border-brand bg-brand/10 ring-2 ring-brand/20'
                      : 'border-border hover:border-brand/50 hover:bg-brand/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="visaCategory"
                    value={category}
                    checked={localCategory === category}
                    onChange={(e) =>
                      handleCategoryChange(e.target.value as VisaCategory)
                    }
                    className="mr-3 accent-brand"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{category}</div>
                    <div className="text-xs text-muted-foreground">
                      {getVisaCategoryDisplayName(category).split(': ')[1]}
                    </div>
                  </div>
                  {localCategory === category && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-4">
            <div className="mb-3">
              <Label className="text-sm font-semibold">Additional Information</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Select what applies to your case
              </p>
            </div>

            <div className="space-y-4">
              {/* Marriage/Relationship flags */}
              {(localCategory === 'IR-1' || localCategory === 'CR-1') && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Marriage History
                  </h4>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={localFlags.prior_marriage_petitioner || false}
                      onCheckedChange={(checked) =>
                        handleFlagChange('prior_marriage_petitioner', checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Prior Marriage (Petitioner)</span>
                      <p className="text-xs text-muted-foreground">
                        Petitioner was previously married
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={localFlags.prior_marriage_beneficiary || false}
                      onCheckedChange={(checked) =>
                        handleFlagChange('prior_marriage_beneficiary', checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Prior Marriage (Beneficiary)</span>
                      <p className="text-xs text-muted-foreground">
                        Beneficiary was previously married
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Children */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Children</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.child_adopted || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('child_adopted', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Adopted Child</span>
                    <p className="text-xs text-muted-foreground">
                      Child is adopted
                    </p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.child_stepchild || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('child_stepchild', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Stepchild</span>
                    <p className="text-xs text-muted-foreground">
                      Child is a stepchild
                    </p>
                  </div>
                </label>
              </div>

              {/* Financial */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Financial</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.joint_sponsor_used || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('joint_sponsor_used', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Joint Sponsor Used</span>
                    <p className="text-xs text-muted-foreground">
                      Using a joint sponsor for financial support
                    </p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.household_member_used || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('household_member_used', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Household Member Used</span>
                    <p className="text-xs text-muted-foreground">
                      Including household member income
                    </p>
                  </div>
                </label>
              </div>

              {/* Background */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Background</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.criminal_history || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('criminal_history', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Criminal History</span>
                    <p className="text-xs text-muted-foreground">
                      Beneficiary has criminal history
                    </p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={localFlags.previous_immigration_violations || false}
                    onCheckedChange={(checked) =>
                      handleFlagChange('previous_immigration_violations', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Previous Immigration Violations</span>
                    <p className="text-xs text-muted-foreground">
                      Previous visa overstay or violations
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Case Information - For USCIS Naming Convention */}
          <Card className="p-4">
            <div className="mb-3">
              <Label className="text-sm font-semibold">Case Information</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Required for USCIS/NVC compliant file naming
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="caseId" className="text-xs font-medium">
                  Case/Receipt Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="caseId"
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="e.g., IOE1234567890 or NVC2024XXXXX"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  USCIS Receipt or NVC Case Number
                </p>
              </div>

              <div>
                <Label htmlFor="petitionerName" className="text-xs font-medium">
                  Petitioner Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="petitionerName"
                  type="text"
                  value={petitionerName}
                  onChange={(e) => setPetitionerName(e.target.value)}
                  placeholder="e.g., John Michael Doe"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Full legal name → normalized as JOHN_MICHAEL_DOE
                </p>
              </div>

              <div>
                <Label htmlFor="beneficiaryName" className="text-xs font-medium">
                  Beneficiary Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="beneficiaryName"
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g., Jane Elizabeth Smith"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Full legal name → normalized as JANE_ELIZABETH_SMITH
                </p>
              </div>

              {localFlags.joint_sponsor_used && (
                <div>
                  <Label htmlFor="jointSponsorName" className="text-xs font-medium">
                    Joint Sponsor Name
                  </Label>
                  <Input
                    id="jointSponsorName"
                    type="text"
                    value={jointSponsorName}
                    onChange={(e) => setJointSponsorName(e.target.value)}
                    placeholder="e.g., Robert James Williams"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Full legal name (if using joint sponsor)
                  </p>
                </div>
              )}

              <Button
                size="sm"
                onClick={handleSaveCaseInfo}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!caseId || !petitionerName || !beneficiaryName || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {(!caseId || !petitionerName || !beneficiaryName)
                      ? 'Fill Required Fields Above'
                      : 'Save Case Information'}
                  </>
                )}
              </Button>

              {(caseId && petitionerName && beneficiaryName) && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-2">
                  <p className="text-xs text-blue-900 dark:text-blue-100 font-medium mb-1">
                    📋 Naming Preview:
                  </p>
                  <code className="text-xs text-blue-800 dark:text-blue-200 block break-all">
                    {caseId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_{'{ROLE}'}_{
                      petitionerName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-zA-Z0-9\s]/g, '')
                        .trim()
                        .replace(/\s+/g, '_')
                        .toUpperCase()
                        .substring(0, 30)
                    }_{'{DOC_KEY}'}_2024-12-24_v1.pdf
                  </code>
                </div>
              )}

              {(!caseId || !petitionerName || !beneficiaryName) && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded p-2">
                  <p className="text-xs text-red-800 dark:text-red-200">
                    ⚠️ <strong>Required for USCIS naming!</strong><br/>
                    Fill all fields above to enable proper file naming.
                  </p>
                </div>
              )}
            </div>
          </Card>

        </>
      )}
    </div>
  );
}
