"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { MasterProfile } from "@/types/profile";
import { ChevronDown, Loader2, Pencil, Check, X } from "lucide-react";
import { getProfileCompleteness } from "@/lib/profile/helpers";
import { FormField, FormSelect, FormCheckbox } from "./form-field";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [formData, setFormData] = useState<MasterProfile>({} as MasterProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const [sections, setSections] = useState({
    personal: true,
    contact: true,
    employment: true,
    immigration: true,
    documents: true,
    financial: true,
    relationship: true
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User ID is required');
      }

      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .select('profile_details')
        .eq('id', user.id)
        .single();

      if (dbError) {
        console.error('Database error fetching profile:', dbError);
        throw dbError;
      }

      if (data?.profile_details) {
        setFormData(data.profile_details as MasterProfile);
      }
    } catch (fetchError) {
      console.error('Error fetching profile:', fetchError);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, isLoading, router, fetchProfile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          profile_details: formData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = <T extends keyof MasterProfile>(field: T, value: MasterProfile[T] extends string ? string : MasterProfile[T]) => {
    setFormData(prev => ({ ...prev, [field]: value as MasterProfile[T] }));
  };

  const updateNested = <T extends keyof MasterProfile>(parent: T, field: string, value: unknown) => {
    setFormData(prev => {
      const parentValue = prev[parent];
      const updatedParent = typeof parentValue === 'object' && parentValue !== null
        ? { ...(parentValue as Record<string, unknown>), [field]: value }
        : { [field]: value };

      return {
        ...prev,
        [parent]: updatedParent
      };
    });
  };

  const updateAddress = (field: keyof MasterProfile['currentAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      currentAddress: {
        ...(prev.currentAddress || {}),
        [field]: value
      }
    }));
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!user) return null;

  const completeness = formData.name ? getProfileCompleteness(formData) : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Your Profile</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage your data for auto-filling forms</p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="h-8 text-xs px-3 bg-transparent"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-8 text-xs px-3"
                >
                  {saving ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="h-8 text-xs px-3">
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-4 px-3 py-2 rounded-md text-xs ${
            message.includes("Error") 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        {/* Profile Completeness */}
        {formData.name && (
          <div className="mb-4 px-4 py-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Profile Completeness</span>
              <span className="text-sm font-semibold text-slate-800">{completeness}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-700 transition-all duration-500 rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Personal Information */}
          <Card className="bg-white border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("personal")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Personal Information</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.personal ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
            {sections.personal && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="First Name"
                    value={formData.name?.first || ""}
                    onChange={(v: string) => updateNested("name", "first", v)}
                    readOnly={!isEditing}
                    placeholder="Enter first name"
                  />
                  <FormField
                    label="Middle Name"
                    value={formData.name?.middle || ""}
                    onChange={(v: string) => updateNested("name", "middle", v)}
                    readOnly={!isEditing}
                    placeholder="Enter middle name"
                  />
                  <FormField
                    label="Last Name"
                    value={formData.name?.last || ""}
                    onChange={(v: string) => updateNested("name", "last", v)}
                    readOnly={!isEditing}
                    placeholder="Enter last name"
                  />
                  <FormField
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(v: string) => updateField("dateOfBirth", v)}
                    readOnly={!isEditing}
                  />
                  <FormField
                    label="City of Birth"
                    value={formData.placeOfBirth?.city || ""}
                    onChange={(v: string) => updateNested("placeOfBirth", "city", v)}
                    readOnly={!isEditing}
                    placeholder="Enter city"
                  />
                  <FormField
                    label="Country of Birth"
                    value={formData.placeOfBirth?.country || ""}
                    onChange={(v: string) => updateNested("placeOfBirth", "country", v)}
                    readOnly={!isEditing}
                    placeholder="Enter country"
                  />
                  {isEditing ? (
                    <FormSelect
                      label="Sex"
                      value={formData.sex || "Male"}
                      onChange={(v: string) => updateField("sex", v)}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                    />
                  ) : (
                    <FormField
                      label="Sex"
                      value={formData.sex || ""}
                      onChange={() => {}}
                      readOnly
                    />
                  )}
                  {isEditing ? (
                    <FormSelect
                      label="Marital Status"
                      value={formData.maritalStatus || "Single"}
                      onChange={(v: string) => updateField("maritalStatus", v)}
                      options={[
                        { value: "Single", label: "Single" },
                        { value: "Married", label: "Married" },
                        { value: "Divorced", label: "Divorced" },
                        { value: "Widowed", label: "Widowed" },
                        { value: "Separated", label: "Separated" },
                        { value: "Annulled", label: "Annulled" },
                      ]}
                    />
                  ) : (
                    <FormField
                      label="Marital Status"
                      value={formData.maritalStatus || ""}
                      onChange={() => {}}
                      readOnly
                    />
                  )}
                  <FormField
                    label="Passport Number"
                    value={formData.passportNumber || ""}
                    onChange={(v: string) => updateField("passportNumber", v)}
                    readOnly={!isEditing}
                    placeholder="Enter passport number"
                  />
                  <FormField
                    label="Passport Expiry"
                    type="date"
                    value={formData.passportExpiry || ""}
                    onChange={(v: string) => updateField("passportExpiry", v)}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Contact & Address */}
          <Card className="bg-white border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("contact")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Contact & Address</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.contact ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
            {sections.contact && (
              <CardContent className="pt-0 pb-4 px-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Phone"
                    value={formData.phone || ""}
                    onChange={(v: string) => updateField("phone", v)}
                    readOnly={!isEditing}
                    placeholder="+1 (555) 000-0000"
                  />
                  <FormField
                    label="Email"
                    value={user.email || ""}
                    onChange={() => {}}
                    disabled
                  />
                  <FormField
                    label="CNIC / National ID"
                    value={formData.cnic || ""}
                    onChange={(v: string) => updateField("cnic", v)}
                    readOnly={!isEditing}
                    placeholder="Enter national ID"
                  />
                </div>
                
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-medium text-slate-600 mb-3">Current Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        label="Street Address"
                        value={formData.currentAddress?.street || ""}
                        onChange={(v: string) => updateAddress("street", v)}
                        readOnly={!isEditing}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <FormField
                      label="City"
                      value={formData.currentAddress?.city || ""}
                      onChange={(v: string) => updateAddress("city", v)}
                      readOnly={!isEditing}
                      placeholder="Enter city"
                    />
                    <FormField
                      label="State"
                      value={formData.currentAddress?.state || ""}
                      onChange={(v: string) => updateAddress("state", v)}
                      readOnly={!isEditing}
                      placeholder="Enter state"
                    />
                    <FormField
                      label="Zip Code"
                      value={formData.currentAddress?.zipCode || ""}
                      onChange={(v: string) => updateAddress("zipCode", v)}
                      readOnly={!isEditing}
                      placeholder="Enter zip code"
                    />
                    <FormField
                      label="Country"
                      value={formData.currentAddress?.country || ""}
                      onChange={(v: string) => updateAddress("country", v)}
                      readOnly={!isEditing}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Employment & Education */}
          <Card className="bg-white border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("employment")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Employment & Education</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.employment ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
            {sections.employment && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Occupation"
                    value={formData.occupation || ""}
                    onChange={(v: string) => updateField("occupation", v)}
                    readOnly={!isEditing}
                    placeholder="Enter occupation"
                  />
                  <FormField
                    label="Employer Name"
                    value={formData.employer?.name || ""}
                    onChange={(v: string) => updateNested("employer", "name", v)}
                    readOnly={!isEditing}
                    placeholder="Enter employer name"
                  />
                  <FormField
                    label="Annual Income"
                    value={formData.annualIncome || ""}
                    onChange={(v: string) => updateField("annualIncome", v)}
                    readOnly={!isEditing}
                    placeholder="Enter annual income"
                  />
                  {isEditing ? (
                    <FormSelect
                      label="Education Level"
                      value={formData.educationLevel || ""}
                      onChange={(v: string) => updateField("educationLevel", v)}
                      options={[
                        { value: "High School", label: "High School" },
                        { value: "Associate Degree", label: "Associate Degree" },
                        { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                        { value: "Master's Degree", label: "Master's Degree" },
                        { value: "Doctorate", label: "Doctorate" },
                      ]}
                      placeholder="Select level"
                    />
                  ) : (
                    <FormField
                      label="Education Level"
                      value={formData.educationLevel || ""}
                      onChange={() => {}}
                      readOnly
                    />
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Immigration History */}
          <Card className="bg-white border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("immigration")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Immigration History</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.immigration ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
            {sections.immigration && (
              <CardContent className="pt-0 pb-4 px-4 space-y-3">
                 <FormCheckbox
                  id="pva"
                  label="Previous US Visa Applications"
                  checked={formData.immigrationHistory?.previousVisaApplications || false}
                  onCheckedChange={(c) => updateNested("immigrationHistory", "previousVisaApplications", c)}
                  disabled={!isEditing}
                />
                <FormCheckbox
                  id="pvd"
                  label="Previous Visa Denials"
                  checked={formData.immigrationHistory?.previousVisaDenial || false}
                  onCheckedChange={(c) => updateNested("immigrationHistory", "previousVisaDenial", c)}
                  disabled={!isEditing}
                  variant="warning"
                />
                <FormCheckbox
                  id="cr"
                  label="Criminal Record"
                  checked={formData.immigrationHistory?.criminalRecord || false}
                  onCheckedChange={(c) => updateNested("immigrationHistory", "criminalRecord", c)}
                  disabled={!isEditing}
                  variant="warning"
                />
                <FormCheckbox
                  id="ms"
                  label="Prior Military Service"
                  checked={formData.immigrationHistory?.priorMilitaryService || false}
                  onCheckedChange={(c) => updateNested("immigrationHistory", "priorMilitaryService", c)}
                  disabled={!isEditing}
                />
              </CardContent>
            )}
          </Card>

          {/* Relationship Evidence */}
          <Card className="bg-white border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("relationship")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Relationship Evidence</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.relationship ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
             {sections.relationship && (
              <CardContent className="pt-0 pb-4 px-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <FormSelect
                      label="Relationship Type"
                      value={formData.relationship?.type || ""}
                      onChange={(v) => updateNested("relationship", "type", v)}
                      options={[
                        { value: "Spouse", label: "Spouse" },
                        { value: "Fiance", label: "Fiance(e)" },
                      ]}
                      placeholder="Select type"
                      readOnly={!isEditing}
                    />
                    <FormField
                      label="Relationship Start Date"
                      type="date"
                      value={formData.relationship?.startDate || ""}
                      onChange={(v) => updateNested("relationship", "startDate", v)}
                      readOnly={!isEditing}
                    />
                 </div>
                 <h4 className="text-xs font-medium text-slate-600 mb-3">Available Evidence</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormCheckbox
                    id="coh"
                    label="Cohabitation Proof (Lease/Deed)"
                    checked={formData.relationship?.cohabitationProof || false}
                    onCheckedChange={(c) => updateNested("relationship", "cohabitationProof", c)}
                    disabled={!isEditing}
                  />
                  <FormCheckbox
                    id="fin"
                    label="Shared Financial Accounts"
                    checked={formData.relationship?.sharedFinancialAccounts || false}
                    onCheckedChange={(c) => updateNested("relationship", "sharedFinancialAccounts", c)}
                    disabled={!isEditing}
                  />
                  <FormCheckbox
                    id="wed"
                    label="Wedding Photos"
                    checked={formData.relationship?.weddingPhotos || false}
                    onCheckedChange={(c) => updateNested("relationship", "weddingPhotos", c)}
                    disabled={!isEditing}
                  />
                 </div>
              </CardContent>
             )}
          </Card>

          {/* Documents & Financial */}
          <Card className="bg-white border-slate-200">
             <CardHeader 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors px-4 py-3" 
              onClick={() => toggleSection("documents")}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-slate-800">Documents & Financial</CardTitle>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sections.documents ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
            {sections.documents && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-medium text-slate-600 mb-3 block">Identity Documents</h4>
                    <div className="space-y-3">
                      <FormCheckbox
                        id="ppt"
                        label="Valid Passport"
                        checked={formData.documents?.hasPassport || false}
                        onCheckedChange={(c) => updateNested("documents", "hasPassport", c)}
                        disabled={!isEditing}
                      />
                      <FormCheckbox
                        id="bc"
                        label="Birth Certificate"
                        checked={formData.documents?.hasBirthCertificate || false}
                        onCheckedChange={(c) => updateNested("documents", "hasBirthCertificate", c)}
                        disabled={!isEditing}
                      />
                      <FormCheckbox
                        id="mc"
                        label="Marriage Certificate"
                        checked={formData.documents?.hasMarriageCertificate || false}
                        onCheckedChange={(c) => updateNested("documents", "hasMarriageCertificate", c)}
                        disabled={!isEditing}
                      />
                      <FormCheckbox
                        id="pc"
                        label="Police Certificate"
                        checked={formData.documents?.hasPoliceCertificate || false}
                        onCheckedChange={(c) => updateNested("documents", "hasPoliceCertificate", c)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-600 mb-3 block">Financial Documents</h4>
                     <div className="space-y-3">
                      <FormCheckbox
                        id="tr"
                        label="Tax Returns (Last 3 Years)"
                        checked={formData.financialProfile?.hasTaxReturns || false}
                        onCheckedChange={(c) => updateNested("financialProfile", "hasTaxReturns", c)}
                        disabled={!isEditing}
                      />
                      <FormCheckbox
                        id="ps"
                        label="Paystubs (Recent)"
                        checked={formData.financialProfile?.hasPaystubs || false}
                        onCheckedChange={(c) => updateNested("financialProfile", "hasPaystubs", c)}
                        disabled={!isEditing}
                      />
                      <FormCheckbox
                        id="bs"
                        label="Bank Statements"
                        checked={formData.financialProfile?.hasBankStatements || false}
                        onCheckedChange={(c) => updateNested("financialProfile", "hasBankStatements", c)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
