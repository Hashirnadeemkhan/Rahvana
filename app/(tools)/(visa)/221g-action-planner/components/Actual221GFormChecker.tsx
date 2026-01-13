import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSelections } from '../types/221g';

interface Actual221GFormCheckerProps {
  selectedItems: FormSelections;
  onSelectionChange: (selected: FormSelections) => void;
  onNext: () => void;
}

export default function Actual221GFormChecker({ 
  selectedItems, 
  onSelectionChange, 
  onNext 
}: Actual221GFormCheckerProps) {
  const handleCheckboxChange = <T extends keyof FormSelections>(fieldId: T, value: boolean = true) => {
    const newSelected = { ...selectedItems, [fieldId]: value } as FormSelections;
    onSelectionChange(newSelected);
  };

  const handleInputChange = <T extends keyof FormSelections>(fieldId: T, value: string) => {
    const newSelected = { ...selectedItems, [fieldId]: value } as FormSelections;
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
          <h3 className="font-semibold text-blue-800 text-center text-lg">U.S. Embassy Islamabad, Pakistan</h3>
          <h4 className="font-medium text-blue-700 text-center">Immigrant Visa Unit</h4>
          <div className="mt-2 flex justify-between">
            <span><strong>Case ID(s):</strong> {selectedItems.caseId || '[CASE NUMBER]'}</span>
            <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h4 className="font-bold text-lg mb-4 text-center">221(g) FORM - REQUIRED DOCUMENTS</h4>
            
            {/* Administrative processing */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="admin_processing"
                checked={!!selectedItems.admin_processing}
                onCheckedChange={(checked) => handleCheckboxChange('admin_processing', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="admin_processing" className="text-base font-medium">
                  Administrative processing (you will be notified if further action is needed)
                </Label>
              </div>
            </div>

            {/* Passport */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="passport"
                checked={!!selectedItems.passport}
                onCheckedChange={(checked) => handleCheckboxChange('passport', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="passport" className="text-base font-medium">
                  Passport (submit via courier)
                </Label>
              </div>
            </div>

            {/* Medical examination */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="medical_examination"
                checked={!!selectedItems.medical_examination}
                onCheckedChange={(checked) => handleCheckboxChange('medical_examination', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="medical_examination" className="text-base font-medium">
                  Medical examination (through panel physician)
                </Label>
              </div>
            </div>

            {/* Original NADRA Family Registration Certificate */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="nadra_family_reg"
                checked={!!selectedItems.nadra_family_reg}
                onCheckedChange={(checked) => handleCheckboxChange('nadra_family_reg', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="nadra_family_reg" className="text-base font-medium">
                  Original NADRA Family Registration Certificate (submit via courier)
                </Label>
              </div>
            </div>

            {/* Original NADRA Birth Cert. */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="nadra_birth_cert"
                checked={!!selectedItems.nadra_birth_cert}
                onCheckedChange={(checked) => handleCheckboxChange('nadra_birth_cert', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="nadra_birth_cert" className="text-base font-medium">
                  Original NADRA Birth Cert. (submit via courier)
                </Label>
                <div className="ml-6 mt-2 flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nadra_birth_cert_petitioner"
                      checked={!!selectedItems.nadra_birth_cert_petitioner}
                      onCheckedChange={(checked) => handleCheckboxChange('nadra_birth_cert_petitioner', checked as boolean)}
                    />
                    <Label htmlFor="nadra_birth_cert_petitioner">Petitioner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nadra_birth_cert_beneficiary"
                      checked={!!selectedItems.nadra_birth_cert_beneficiary}
                      onCheckedChange={(checked) => handleCheckboxChange('nadra_birth_cert_beneficiary', checked as boolean)}
                    />
                    <Label htmlFor="nadra_birth_cert_beneficiary">Beneficiary</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Original NADRA Marriage Certificate */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="nadra_marriage_cert"
                checked={!!selectedItems.nadra_marriage_cert}
                onCheckedChange={(checked) => handleCheckboxChange('nadra_marriage_cert', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="nadra_marriage_cert" className="text-base font-medium">
                  Original NADRA Marriage Certificate (submit via courier)
                </Label>
              </div>
            </div>

            {/* Original Nikah Nama */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="nikah_nama"
                checked={!!selectedItems.nikah_nama}
                onCheckedChange={(checked) => handleCheckboxChange('nikah_nama', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="nikah_nama" className="text-base font-medium">
                  Original Nikah Nama (submit via courier)
                </Label>
              </div>
            </div>

            {/* Original NADRA Divorce Cert. */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="nadra_divorce_cert"
                checked={!!selectedItems.nadra_divorce_cert}
                onCheckedChange={(checked) => handleCheckboxChange('nadra_divorce_cert', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="nadra_divorce_cert" className="text-base font-medium">
                  Original NADRA Divorce Cert. (submit via courier)
                </Label>
                <div className="ml-6 mt-2 flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nadra_divorce_cert_petitioner"
                      checked={!!selectedItems.nadra_divorce_cert_petitioner}
                      onCheckedChange={(checked) => handleCheckboxChange('nadra_divorce_cert_petitioner', checked as boolean)}
                    />
                    <Label htmlFor="nadra_divorce_cert_petitioner">Petitioner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nadra_divorce_cert_beneficiary"
                      checked={!!selectedItems.nadra_divorce_cert_beneficiary}
                      onCheckedChange={(checked) => handleCheckboxChange('nadra_divorce_cert_beneficiary', checked as boolean)}
                    />
                    <Label htmlFor="nadra_divorce_cert_beneficiary">Beneficiary</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Original U.S. Divorce Decree */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="us_divorce_decree"
                checked={!!selectedItems.us_divorce_decree}
                onCheckedChange={(checked) => handleCheckboxChange('us_divorce_decree', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="us_divorce_decree" className="text-base font-medium">
                  Original U.S. Divorce Decree or certified copy (submit via courier)
                </Label>
              </div>
            </div>

            {/* Original Death Certificate */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="death_certificate"
                checked={!!selectedItems.death_certificate}
                onCheckedChange={(checked) => handleCheckboxChange('death_certificate', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="death_certificate" className="text-base font-medium">
                  Original Death Certificate (submit via courier) for:
                </Label>
                <Input
                  type="text"
                  placeholder="Name"
                  className="mt-2 ml-6 w-1/2"
                  value={selectedItems.death_certificate_name || ''}
                  onChange={(e) => handleInputChange('death_certificate_name', e.target.value)}
                />
              </div>
            </div>

            {/* Original Police Certificate */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="police_certificate"
                checked={!!selectedItems.police_certificate}
                onCheckedChange={(checked) => handleCheckboxChange('police_certificate', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="police_certificate" className="text-base font-medium">
                  Original Police Certificate (submit via courier) for country:
                </Label>
                <Input
                  type="text"
                  placeholder="Country"
                  className="mt-2 ml-6 w-1/2"
                  value={selectedItems.police_certificate_country || ''}
                  onChange={(e) => handleInputChange('police_certificate_country', e.target.value)}
                />
              </div>
            </div>

            {/* English translation */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="english_translation"
                checked={!!selectedItems.english_translation}
                onCheckedChange={(checked) => handleCheckboxChange('english_translation', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="english_translation" className="text-base font-medium">
                  English translation (submit via courier) of document:
                </Label>
                <Input
                  type="text"
                  placeholder="Document name"
                  className="mt-2 ml-6 w-1/2"
                  value={selectedItems.english_translation_document || ''}
                  onChange={(e) => handleInputChange('english_translation_document', e.target.value)}
                />
              </div>
            </div>

            {/* I-864 Affidavit of Support */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="i864_affidavit"
                checked={!!selectedItems.i864_affidavit}
                onCheckedChange={(checked) => handleCheckboxChange('i864_affidavit', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="i864_affidavit" className="text-base font-medium">
                  I-864 Affidavit of Support (submit via courier / online)
                </Label>
                <div className="ml-6 mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864_courier"
                      checked={!!selectedItems.i864_courier}
                      onCheckedChange={(checked) => handleCheckboxChange('i864_courier', checked as boolean)}
                    />
                    <Label htmlFor="i864_courier">Courier</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864_online"
                      checked={!!selectedItems.i864_online}
                      onCheckedChange={(checked) => handleCheckboxChange('i864_online', checked as boolean)}
                    />
                    <Label htmlFor="i864_online">Online</Label>
                  </div>
                </div>
                <div className="ml-6 mt-2 flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864_petitioner"
                      checked={!!selectedItems.i864_petitioner}
                      onCheckedChange={(checked) => handleCheckboxChange('i864_petitioner', checked as boolean)}
                    />
                    <Label htmlFor="i864_petitioner">Petitioner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864_joint_sponsor"
                      checked={!!selectedItems.i864_joint_sponsor}
                      onCheckedChange={(checked) => handleCheckboxChange('i864_joint_sponsor', checked as boolean)}
                    />
                    <Label htmlFor="i864_joint_sponsor">Joint Sponsor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864a"
                      checked={!!selectedItems.i864a}
                      onCheckedChange={(checked) => handleCheckboxChange('i864a', checked as boolean)}
                    />
                    <Label htmlFor="i864a">I-864A</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i134"
                      checked={!!selectedItems.i134}
                      onCheckedChange={(checked) => handleCheckboxChange('i134', checked as boolean)}
                    />
                    <Label htmlFor="i134">I-134</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="i864w"
                      checked={!!selectedItems.i864w}
                      onCheckedChange={(checked) => handleCheckboxChange('i864w', checked as boolean)}
                    />
                    <Label htmlFor="i864w">I-864W</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tax_1040"
                      checked={!!selectedItems.tax_1040}
                      onCheckedChange={(checked) => handleCheckboxChange('tax_1040', checked as boolean)}
                    />
                    <Label htmlFor="tax_1040">1040</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="w2"
                      checked={!!selectedItems.w2}
                      onCheckedChange={(checked) => handleCheckboxChange('w2', checked as boolean)}
                    />
                    <Label htmlFor="w2">W-2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="irs_transcript"
                      checked={!!selectedItems.irs_transcript}
                      onCheckedChange={(checked) => handleCheckboxChange('irs_transcript', checked as boolean)}
                    />
                    <Label htmlFor="irs_transcript">IRS tax transcript</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="proof_citizenship"
                      checked={!!selectedItems.proof_citizenship}
                      onCheckedChange={(checked) => handleCheckboxChange('proof_citizenship', checked as boolean)}
                    />
                    <Label htmlFor="proof_citizenship">Proof of U.S. citizenship</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="domicile"
                      checked={!!selectedItems.domicile}
                      onCheckedChange={(checked) => handleCheckboxChange('domicile', checked as boolean)}
                    />
                    <Label htmlFor="domicile">Domicile</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* DNA test */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="dna_test"
                checked={!!selectedItems.dna_test}
                onCheckedChange={(checked) => handleCheckboxChange('dna_test', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="dna_test" className="text-base font-medium">
                  DNA test recommended for:
                </Label>
                <Input
                  type="text"
                  placeholder="Name"
                  className="mt-2 ml-6 w-1/2"
                  value={selectedItems.dna_test_name || ''}
                  onChange={(e) => handleInputChange('dna_test_name', e.target.value)}
                />
              </div>
            </div>

            {/* Other */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border mb-2">
              <Checkbox
                id="other"
                checked={!!selectedItems.other}
                onCheckedChange={(checked) => handleCheckboxChange('other', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="other" className="text-base font-medium">
                  Other:
                </Label>
                <Textarea
                  placeholder="Specify other requirements"
                  className="mt-2 ml-6 w-1/2"
                  value={selectedItems.other_details || ''}
                  onChange={(e) => handleInputChange('other_details', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 flex items-center">
            <span className="mr-2">💡</span>
            Instructions
          </h4>
          <p className="text-sm text-yellow-700 mt-1">
            Carefully compare each item with your actual 221(g) letter. Check all items that
            match your specific situation. Based on your selections, you will receive tailored
            guidance on next steps.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onNext} 
            disabled={Object.values(selectedItems).filter(value => Boolean(value)).length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue with Selected Items ({Object.values(selectedItems).filter(value => Boolean(value)).length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}