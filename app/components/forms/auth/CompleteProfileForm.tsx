"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { MasterProfile } from "@/types/profile";
import { ChevronRight, ChevronLeft, Save, Loader2, } from "lucide-react";
import { FormField, FormSelect, FormSection, FormCheckbox } from "@/app/(main)/profile/form-field";
import { mapProfileToGenericForm } from "@/lib/autoFill/mapper";

export default function CompleteProfileForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [formData, setFormData] = useState<Partial<MasterProfile>>({
    name: { first: "", last: "", middle: "" },
    dateOfBirth: "",
    placeOfBirth: { city: "", country: "" },
    sex: "Male",
    maritalStatus: "Single",
    phone: "",
    email: user?.email || "",
    currentAddress: { street: "", city: "", state: "", zipCode: "", country: "" },
    relationship: { 
      type: "", 
      startDate: "",
      // Evidence
      cohabitationProof: false,
      sharedFinancialAccounts: false,
      weddingPhotos: false,
      communicationLogs: false,
      moneyTransferReceipts: false,
      meetingProof: false 
    },
    immigrationHistory: {
      previousVisaApplications: false,
      previousVisaDenial: false,
      overstayOrViolation: false,
      criminalRecord: false,
      removedOrDeported: false,
      priorMilitaryService: false,
      specializedWeaponsTraining: false,
      unofficialArmedGroups: false
    },
    financialProfile: {
      hasTaxReturns: false,
      hasEmploymentLetter: false,
      hasPaystubs: false,
      hasBankStatements: false
    },
    documents: {
      hasPassport: false,
      hasBirthCertificate: false,
      hasMarriageCertificate: false,
      hasPoliceCertificate: false,
      hasMedicalRecord: false,
      hasPhotos: false
    },
    employer: { name: "" },
    educationLevel: "", 
    educationField: "",
    annualIncome: ""
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Auto-fill profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('profile_details')
          .eq('id', user.id)
          .single();

        if (data?.profile_details && !profileLoaded) {
          const profile = data.profile_details as MasterProfile;

          // Map profile data to form structure
          const mappedData = mapProfileToGenericForm(profile, {
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            placeOfBirth: formData.placeOfBirth,
            sex: formData.sex,
            maritalStatus: formData.maritalStatus,
            phone: formData.phone,
            email: formData.email,
            currentAddress: formData.currentAddress,
            relationship: formData.relationship,
            employer: formData.employer,
            passportNumber: formData.passportNumber,
            passportExpiry: formData.passportExpiry,
            intendedUSState: formData.intendedUSState,
          });

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));
          setProfileLoaded(true);
        }
      } catch (err) {
        console.error("Error auto-filling profile:", err);
      }
    };

    fetchProfile();
  }, [user, profileLoaded, supabase, formData]);

  const handleChange = <T extends keyof MasterProfile>(field: T, value: MasterProfile[T] | string) => {
    setFormData((prev) => ({ ...prev, [field]: value as MasterProfile[T] }));
  };

  const handleNestedChange = <T extends keyof MasterProfile>(parent: T, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev[parent] as Record<string, unknown>) || {}),
        [field]: value
      }
    }));
  };

  // Step definitions
  const steps = [
    {
      title: "Personal Information",
      description: "Basic details about yourself",
      render: () => (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="First Name"
              value={formData.name?.first || ""}
              onChange={(v) => handleNestedChange("name", "first", v)}
              placeholder="John"
              required
            />
            <FormField
              label="Middle Name"
              value={formData.name?.middle || ""}
              onChange={(v) => handleNestedChange("name", "middle", v)}
              placeholder="William"
            />
            <FormField
              label="Last Name"
              value={formData.name?.last || ""}
              onChange={(v) => handleNestedChange("name", "last", v)}
              placeholder="Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date of Birth"
              value={formData.dateOfBirth || ""}
              onChange={(v) => handleChange("dateOfBirth", v)}
              type="date"
              required
            />
            <FormSelect
              label="Sex"
              value={formData.sex || "Male"}
              onChange={(v) => handleChange("sex", v)}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="City of Birth"
              value={formData.placeOfBirth?.city || ""}
              onChange={(v) => handleNestedChange("placeOfBirth", "city", v)}
              placeholder="New York"
              helpText="As shown on passport"
            />
            <FormField
              label="Country of Birth"
              value={formData.placeOfBirth?.country || ""}
              onChange={(v) => handleNestedChange("placeOfBirth", "country", v)}
              placeholder="United States"
              helpText="As shown on passport"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Marital Status"
              value={formData.maritalStatus || "Single"}
              onChange={(v) => handleChange("maritalStatus", v)}
              options={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
                { value: "Widowed", label: "Widowed" },
                { value: "Separated", label: "Separated" },
                { value: "Annulled", label: "Annulled" },
              ]}
            />
          </div>

          <FormSection title="Passport Details" description="Optional but recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Passport Number"
                value={formData.passportNumber || ""}
                onChange={(v) => handleChange("passportNumber", v)}
                placeholder="AB1234567"
              />
              <FormField
                label="Passport Expiry Date"
                value={formData.passportExpiry || ""}
                onChange={(v) => handleChange("passportExpiry", v)}
                type="date"
              />
            </div>
          </FormSection>
        </div>
      )
    },
    {
      title: "Contact & Address",
      description: "Your contact information and current address",
      render: () => (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              value={formData.phone || ""}
              onChange={(v) => handleChange("phone", v)}
              placeholder="+1 (555) 000-0000"
              required
            />
            <FormField
              label="Email"
              value={formData.email || ""}
              onChange={() => {}}
              disabled
            />
          </div>

          <FormSection title="Current Physical Address">
            <FormField
              label="Street Address"
              value={formData.currentAddress?.street || ""}
              onChange={(v) => handleNestedChange("currentAddress", "street", v)}
              placeholder="123 Main Street, Apt 4B"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="City"
                value={formData.currentAddress?.city || ""}
                onChange={(v) => handleNestedChange("currentAddress", "city", v)}
                placeholder="New York"
                required
              />
              <FormField
                label="State / Province"
                value={formData.currentAddress?.state || ""}
                onChange={(v) => handleNestedChange("currentAddress", "state", v)}
                placeholder="NY"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Zip / Postal Code"
                value={formData.currentAddress?.zipCode || ""}
                onChange={(v) => handleNestedChange("currentAddress", "zipCode", v)}
                placeholder="10001"
              />
              <FormField
                label="Country"
                value={formData.currentAddress?.country || ""}
                onChange={(v) => handleNestedChange("currentAddress", "country", v)}
                placeholder="United States"
                required
              />
            </div>

            <FormField
              label="Intended US State"
              value={formData.intendedUSState || ""}
              onChange={(v) => handleChange("intendedUSState", v)}
              placeholder="Where do you plan to live?"
              helpText="If applicable"
            />
          </FormSection>
        </div>
      )
    },
    {
      title: "Relationship Details",
      description: "Information for spousal visa forms",
      render: () => (
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5">
            <p className="text-xs text-slate-600">
              This information helps us auto-fill spousal visa forms (I-130). Skip if not applicable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Relationship Type"
              value={formData.relationship?.type || ""}
              onChange={(v) => handleNestedChange("relationship", "type", v)}
              options={[
                { value: "Spouse", label: "Spouse" },
                { value: "Fiance", label: "Fiance(e)" },
              ]}
              placeholder="Select relationship"
            />
            <FormField
              label="Marriage Date"
              value={formData.relationship?.marriageDate || ""}
              onChange={(v) => handleNestedChange("relationship", "marriageDate", v)}
              type="date"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Relationship Start Date"
              value={formData.relationship?.startDate || ""}
              onChange={(v) => handleNestedChange("relationship", "startDate", v)}
              type="date"
            />
            <FormField
              label="Number of In-Person Visits"
              value={formData.relationship?.numberOfInPersonVisits?.toString() || ""}
              onChange={(v) => handleNestedChange("relationship", "numberOfInPersonVisits", v ? Number(v) : null)}
              type="number"
              placeholder="0"
            />
          </div>

          <FormField
            label="How did you meet?"
            value={formData.relationship?.howDidYouMeet || ""}
            onChange={(v) => handleNestedChange("relationship", "howDidYouMeet", v)}
            placeholder="e.g. at university, online, through family..."
          />
        </div>
      )
    },
    {
      title: "Employment & Education",
      description: "Your work and educational background",
      render: () => (
        <div className="space-y-5">
          <FormSection title="Employment Background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Current Occupation"
                value={formData.occupation || ""}
                onChange={(v) => handleChange("occupation", v)}
                placeholder="e.g. Software Engineer"
              />
              <FormField
                label="Job Title"
                value={formData.jobTitle || ""}
                onChange={(v) => handleChange("jobTitle", v)}
                placeholder="Exact title on employment letter"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Employer Name"
                value={formData.employer?.name || ""}
                onChange={(v) => handleNestedChange("employer", "name", v)}
                placeholder="e.g. ABC Corporation"
              />
              <FormSelect
                label="Industry Sector"
                value={formData.industrySector || ""}
                onChange={(v) => handleChange("industrySector", v)}
                options={[
                  { value: "Technology", label: "Technology" },
                  { value: "Healthcare", label: "Healthcare" },
                  { value: "Education", label: "Education" },
                  { value: "Finance", label: "Finance" },
                  { value: "Construction", label: "Construction" },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Retail", label: "Retail" },
                  { value: "Government", label: "Government" },
                  { value: "Military/Defense", label: "Military/Defense" },
                  { value: "Other", label: "Other" },
                ]}
                placeholder="Select an option"
              />
            </div>

            <div className="md:w-1/2">
              <FormField
                label="Annual Income (USD)"
                value={formData.annualIncome || ""}
                onChange={(v) => handleChange("annualIncome", v)}
                type="number"
                placeholder="e.g. 50000"
              />
            </div>
          </FormSection>

          <FormSection title="Education Background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Highest Education Level"
                value={formData.educationLevel || ""}
                onChange={(v) => handleChange("educationLevel", v)}
                options={[
                  { value: "Did not graduate high school", label: "Did not graduate high school" },
                  { value: "High School", label: "High School" },
                  { value: "Some College", label: "Some College" },
                  { value: "Associate Degree", label: "Associate Degree" },
                  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                  { value: "Master's Degree", label: "Master's Degree" },
                  { value: "Doctorate", label: "Doctorate (PhD)" },
                ]}
                placeholder="Select an option"
              />
              <FormField
                label="Field of Study"
                value={formData.educationField || ""}
                onChange={(v) => handleChange("educationField", v)}
                placeholder="e.g. Computer Science"
              />
            </div>
          </FormSection>
        </div>
      )
    },
    {
      title: "Immigration & Documents",
      description: "Your immigration history and document readiness",
      render: () => (
        <div className="space-y-5">
          <FormSection title="Immigration History">
            <div className="space-y-3 bg-slate-50 rounded-md px-4 py-3 border border-slate-200">
              <FormCheckbox
                id="prevVisa"
                label="I have applied for a US visa before"
                checked={formData.immigrationHistory?.previousVisaApplications || false}
                onCheckedChange={(checked) => handleNestedChange("immigrationHistory", "previousVisaApplications", checked)}
              />
              <FormCheckbox
                id="prevDenial"
                label="I have been denied a visa before"
                checked={formData.immigrationHistory?.previousVisaDenial || false}
                onCheckedChange={(checked) => handleNestedChange("immigrationHistory", "previousVisaDenial", checked)}
                variant="warning"
              />
              <FormCheckbox
                id="overstay"
                label="I have overstayed a visa or violated terms"
                checked={formData.immigrationHistory?.overstayOrViolation || false}
                onCheckedChange={(checked) => handleNestedChange("immigrationHistory", "overstayOrViolation", checked)}
                variant="warning"
              />
              <FormCheckbox
                id="criminal"
                label="I have a criminal record (anywhere in world)"
                checked={formData.immigrationHistory?.criminalRecord || false}
                onCheckedChange={(checked) => handleNestedChange("immigrationHistory", "criminalRecord", checked)}
                variant="warning"
              />
               <FormCheckbox
                id="military"
                label="I have served in the military"
                checked={formData.immigrationHistory?.priorMilitaryService || false}
                onCheckedChange={(checked) => handleNestedChange("immigrationHistory", "priorMilitaryService", checked)}
              />
            </div>
          </FormSection>

          <FormSection title="Relationship Evidence" description="Do you have these proofs available?">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 rounded-md px-4 py-3 border border-slate-200">
              <FormCheckbox
                id="cohabitation"
                label="Proof of living together (Lease/Deed)"
                checked={formData.relationship?.cohabitationProof || false}
                onCheckedChange={(checked) => handleNestedChange("relationship", "cohabitationProof", checked)}
              />
              <FormCheckbox
                id="financial"
                label="Joint Financial Accounts"
                checked={formData.relationship?.sharedFinancialAccounts || false}
                onCheckedChange={(checked) => handleNestedChange("relationship", "sharedFinancialAccounts", checked)}
              />
              <FormCheckbox
                id="wedding"
                label="Wedding Photos"
                checked={formData.relationship?.weddingPhotos || false}
                onCheckedChange={(checked) => handleNestedChange("relationship", "weddingPhotos", checked)}
              />
              <FormCheckbox
                id="comms"
                label="Communication Logs (Chats/Calls)"
                checked={formData.relationship?.communicationLogs || false}
                onCheckedChange={(checked) => handleNestedChange("relationship", "communicationLogs", checked)}
              />
             </div>
          </FormSection>


          <FormSection title="Document Readiness" description="Check documents you currently have available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 rounded-md px-4 py-3 border border-slate-200">
              <FormCheckbox
                id="hasPassport"
                label="Valid Passport"
                checked={formData.documents?.hasPassport || false}
                onCheckedChange={(checked) => handleNestedChange("documents", "hasPassport", checked)}
              />
              <FormCheckbox
                id="hasBirthCert"
                label="Birth Certificate"
                checked={formData.documents?.hasBirthCertificate || false}
                onCheckedChange={(checked) => handleNestedChange("documents", "hasBirthCertificate", checked)}
              />
              <FormCheckbox
                id="hasMarriageCert"
                label="Marriage Certificate"
                checked={formData.documents?.hasMarriageCertificate || false}
                onCheckedChange={(checked) => handleNestedChange("documents", "hasMarriageCertificate", checked)}
              />
              <FormCheckbox
                id="hasPolice"
                label="Police Certificate"
                checked={formData.documents?.hasPoliceCertificate || false}
                onCheckedChange={(checked) => handleNestedChange("documents", "hasPoliceCertificate", checked)}
              />
              <FormCheckbox
                id="hasTax"
                label="Tax Returns (Last 3 Years)"
                checked={formData.financialProfile?.hasTaxReturns || false}
                onCheckedChange={(checked) => handleNestedChange("financialProfile", "hasTaxReturns", checked)}
              />
              <FormCheckbox
                id="hasPaystubs"
                label="Recent Paystubs"
                checked={formData.financialProfile?.hasPaystubs || false}
                onCheckedChange={(checked) => handleNestedChange("financialProfile", "hasPaystubs", checked)}
              />
            </div>
          </FormSection>
        </div>
      )
    }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const { error: dbError } = await supabase
        .from("user_profiles")
        .upsert({
          id: user?.id,
          profile_details: formData,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (dbError) throw dbError;

      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to save profile");
      } else {
        setError("Failed to save profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{steps[currentStep].title}</h2>
          {steps[currentStep].description && (
            <p className="text-xs text-slate-500 mt-0.5">{steps[currentStep].description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div 
          className="h-full bg-slate-700 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="mb-5">
          {steps[currentStep].render()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || loading}
            className="h-9 px-4 text-sm bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={loading}
            className="h-9 px-4 text-sm min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Save & Complete
                <Save className="ml-1.5 w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="ml-1.5 w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
