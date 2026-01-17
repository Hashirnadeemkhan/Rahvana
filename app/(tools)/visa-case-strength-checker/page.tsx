"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResultPage } from "./components/ResultPage";

type CaseType = "Spouse";

interface FormData {
  caseType: CaseType | "";
  // Basic Profile
  sponsor_full_name?: string;
  beneficiary_full_name?: string;
  sponsor_dob?: string;
  beneficiary_dob?: string;
  country_of_residence?: string;
  relationship_start_date?: string;
  marriage_date?: string;
  spousal_relationship_type?: string;
  intended_us_state_of_residence?: string;
  // Education & Employment Background
  highest_education_field?: string;
  current_occupation_role?: string;
  industry_sector?: string;
  employer_type?: string;
  // Relationship Strength
  how_did_you_meet?: string;
  number_of_in_person_visits?: number;
  cohabitation_proof?: boolean;
  shared_financial_accounts?: boolean;
  wedding_photos_available?: boolean;
  communication_logs?: boolean;
  money_transfer_receipts_available?: boolean;
  driving_license_copy_available?: boolean;
  // Immigration History
  previous_visa_applications?: boolean;
  previous_visa_denial?: boolean;
  overstay_or_violation?: boolean;
  criminal_record?: boolean;
  // Financial Profile
  sponsor_annual_income?: number;
  household_size?: number;
  has_tax_returns?: boolean;
  has_employment_letter?: boolean;
  has_paystubs?: boolean;
  joint_sponsor_available?: boolean;
  i864_affidavit_submitted?: boolean;
  i864_supporting_financial_documents?: boolean;
  // Core Identity Documents
  urdu_marriage_certificate?: boolean;
  english_translation_certificate?: boolean;
  union_council_certificate?: boolean;
  family_registration_certificate?: boolean;
  birth_certificates?: boolean;
  // Passport & Police Documents
  passports_available?: boolean;
  passport_copy_available?: boolean;
  police_certificate_new?: boolean;
  police_certificate_old?: boolean;
  // Interview & Medical Documents
  ds260_confirmation?: boolean;
  interview_letter?: boolean;
  courier_registration?: boolean;
  medical_report_available?: boolean;
  polio_vaccination_certificate?: boolean;
  covid_vaccination_certificate?: boolean;
  passport_photos_2x2?: boolean;
}

interface CaseTypeStepProps {
  formData: FormData;
  error: string | null;
  onCaseTypeChange: (caseType: CaseType) => void;
  onNext: () => void;
  onBack: () => void;
}

const CaseTypeStep = ({
  formData,
  error,
  onCaseTypeChange,
  onNext,
  onBack,
}: CaseTypeStepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Select Case Type
    </h2>

    <p className="text-slate-600 mb-8">
      Please select the type of visa case you want to assess.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ACTIVE: SPOUSE */}
      <button
        type="button"
        className={`p-6 border-2 rounded-xl text-center transition-all ${
          formData.caseType === "Spouse"
            ? "border-teal-600 bg-teal-50"
            : "border-gray-200 hover:border-teal-400"
        }`}
        onClick={() => onCaseTypeChange("Spouse")}
      >
        <h3 className="font-semibold text-lg mb-2">
          Spouse Visa
        </h3>
        <p className="text-sm text-slate-600">
          IR-1 / CR-1 – Spouse of U.S. Citizen
        </p>
      </button>

      {/* COMING SOON: PARENT */}
      <button
        type="button"
        disabled
        className="p-6 border-2 rounded-xl text-center bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          Parent Visa
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Coming Soon
          </span>
        </h3>
        <p className="text-sm text-slate-500">
          IR-5 – Parent of U.S. Citizen
        </p>
      </button>

      {/* COMING SOON: CHILD */}
      <button
        type="button"
        disabled
        className="p-6 border-2 rounded-xl text-center bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          Child Visa
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Coming Soon
          </span>
        </h3>
        <p className="text-sm text-slate-500">
          IR-2 – Unmarried Child of U.S. Citizen
        </p>
      </button>

      {/* COMING SOON: FAMILY */}
      <button
        type="button"
        disabled
        className="p-6 border-2 rounded-xl text-center bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          Family Visa
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Coming Soon
          </span>
        </h3>
        <p className="text-sm text-slate-500">
          F1 / F2A / F2B / F3 / F4 – Family Preference Visas
        </p>
      </button>
    </div>

    

    {error && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    )}

    <div className="flex justify-between pt-6">
      <Button
        onClick={onBack}
        variant="outline"
        className="bg-teal-600 hover:bg-teal-700 text-white"
      >
        Back
      </Button>

      <Button
        onClick={onNext}
        className="bg-teal-600 hover:bg-teal-700 text-white"
        disabled={!formData.caseType}
      >
        Next
      </Button>
    </div>
  </div>
);

interface QuestionStepProps {
  title: string;
  description: string;
  questions: Array<{
    id: keyof FormData;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
    options?: string | string[] | "US_STATES_LIST";
    risk_tag?: string;
  }>;
  formData: FormData;
  error: string | null;
  onChange: (id: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveForLater?: () => void;
}

const QuestionStep = ({
  title,
  description,
  questions,
  formData,
  error,
  onChange,
  onNext,
  onBack,
  onSaveForLater,
}: QuestionStepProps) => {
  const renderInput = (question: {
    id: keyof FormData;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
    options?: string | string[] | "US_STATES_LIST";
    risk_tag?: string;
  }) => {
    const value = formData[question.id] as string | number | boolean | undefined;

    switch (question.type) {
      case "text":
      case "number":
      case "date":
        return (
          <input
            type={question.type}
            value={
              typeof value === "number"
                ? value.toString()
                : typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) =>
              onChange(
                question.id,
                question.type === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );
      case "textarea":
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Enter details for ${question.label.toLowerCase()}`}
            rows={3}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${question.id}-yes`}
                name={question.id}
                checked={value === true}
                onChange={() => onChange(question.id, true)}
                className="h-4 w-4 text-teal-600 border-gray-300"
              />
              <label htmlFor={`${question.id}-yes`}>Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${question.id}-no`}
                name={question.id}
                checked={value === false}
                onChange={() => onChange(question.id, false)}
                className="h-4 w-4 text-teal-600 border-gray-300"
              />
              <label htmlFor={`${question.id}-no`}>No</label>
            </div>
          </div>
        );
      case "select":
        if (question.options === "US_STATES_LIST") {
          const US_STATES = [
            "Alabama",
            "Alaska",
            "Arizona",
            "Arkansas",
            "California",
            "Colorado",
            "Connecticut",
            "Delaware",
            "Florida",
            "Georgia",
            "Hawaii",
            "Idaho",
            "Illinois",
            "Indiana",
            "Iowa",
            "Kansas",
            "Kentucky",
            "Louisiana",
            "Maine",
            "Maryland",
            "Massachusetts",
            "Michigan",
            "Minnesota",
            "Mississippi",
            "Missouri",
            "Montana",
            "Nebraska",
            "Nevada",
            "New Hampshire",
            "New Jersey",
            "New Mexico",
            "New York",
            "North Carolina",
            "North Dakota",
            "Ohio",
            "Oklahoma",
            "Oregon",
            "Pennsylvania",
            "Rhode Island",
            "South Carolina",
            "South Dakota",
            "Tennessee",
            "Texas",
            "Utah",
            "Vermont",
            "Virginia",
            "Washington",
            "West Virginia",
            "Wisconsin",
            "Wyoming",
          ];

          return (
            <select
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          );
        } else if (Array.isArray(question.options)) {
          return (
            <select
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select an option</option>
              {question.options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">
          {title.substring(0, 3).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>

      <p className="text-slate-600 mb-6">{description}</p>

      <div className="space-y-6">
        {questions.map((question) => {
          if (question.id === "intended_us_state_of_residence") {
            const relationshipType = formData.spousal_relationship_type;
            if (
              !relationshipType ||
              relationshipType === "Select" ||
              relationshipType === "No biological relation"
            ) {
              return null;
            }
          }

          let modifiedQuestion = question;
          if (question.id === "intended_us_state_of_residence") {
            modifiedQuestion = { ...question, type: "text" };
          }

          return (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {modifiedQuestion.label}
              </label>
              {renderInput(modifiedQuestion)}
            </div>
          );
        })}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Prev
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={() => onSaveForLater && onSaveForLater()}
              variant="outline"
              className="text-slate-600"
              type="button"
            >
              Save for Later
            </Button>
            <Button
              onClick={onNext}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReviewStepProps {
  formData: FormData;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
  onSaveForLater?: () => void;
}

const ReviewStep = ({
  formData,
  error,
  loading,
  onSubmit,
  onBack,
  onSaveForLater,
}: ReviewStepProps) => {
  // Helper function to format boolean values
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return "Not answered";
    return value ? "Yes" : "No";
  };

  // Helper function to format dates
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Not provided";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">
          Preview
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Review Your Information
        </h2>
      </div>

      <div className="space-y-6">
        {/* Case Type Section */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Case Type
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Selected Type</p>
              <p className="font-medium capitalize">{formData.caseType}</p>
            </div>
          </div>
        </div>

        {/* Basic Profile Section */}
        {(formData.sponsor_dob || formData.beneficiary_dob || formData.country_of_residence || formData.relationship_start_date || formData.marriage_date || formData.spousal_relationship_type || formData.intended_us_state_of_residence) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Basic Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.sponsor_dob && (
                <div>
                  <p className="text-sm text-slate-600">Sponsor DOB</p>
                  <p className="font-medium">{formatDate(formData.sponsor_dob)}</p>
                </div>
              )}
              {formData.beneficiary_dob && (
                <div>
                  <p className="text-sm text-slate-600">Beneficiary DOB</p>
                  <p className="font-medium">{formatDate(formData.beneficiary_dob)}</p>
                </div>
              )}
              {formData.country_of_residence && (
                <div>
                  <p className="text-sm text-slate-600">Country of Residence</p>
                  <p className="font-medium">{formData.country_of_residence}</p>
                </div>
              )}
              {formData.spousal_relationship_type && (
                <div>
                  <p className="text-sm text-slate-600">Spousal Relationship Type</p>
                  <p className="font-medium">{formData.spousal_relationship_type}</p>
                </div>
              )}
              {formData.intended_us_state_of_residence && (
                <div>
                  <p className="text-sm text-slate-600">Intended US State of Residence</p>
                  <p className="font-medium">{formData.intended_us_state_of_residence}</p>
                </div>
              )}
        </div>
        <div className="bg-slate-50 rounded-lg py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
              </svg>
              Education & Employment Background
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.highest_education_field && (
                <div>
                  <p className="text-sm text-slate-600">Highest Education Field</p>
                  <p className="font-medium">{formData.highest_education_field}</p>
                </div>
              )}
              {formData.current_occupation_role && (
                <div>
                  <p className="text-sm text-slate-600">Current Occupation Role</p>
                  <p className="font-medium">{formData.current_occupation_role}</p>
                </div>
              )}
              {formData.industry_sector && (
                <div>
                  <p className="text-sm text-slate-600">Industry Sector</p>
                  <p className="font-medium">{formData.industry_sector}</p>
                </div>
              )}
              {formData.employer_type && (
                <div>
                  <p className="text-sm text-slate-600">Employer Type</p>
                  <p className="font-medium">{formData.employer_type}</p>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Relationship Strength Section */}
        {(formData.how_did_you_meet || formData.number_of_in_person_visits !== undefined || formData.cohabitation_proof !== undefined || formData.shared_financial_accounts !== undefined || formData.wedding_photos_available !== undefined || formData.communication_logs !== undefined || formData.money_transfer_receipts_available !== undefined || formData.driving_license_copy_available !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              Relationship Strength
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.how_did_you_meet && (
                <div>
                  <p className="text-sm text-slate-600">How Did You Meet</p>
                  <p className="font-medium">{formData.how_did_you_meet}</p>
                </div>
              )}
              {formData.number_of_in_person_visits !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Number of In-Person Visits</p>
                  <p className="font-medium">{formData.number_of_in_person_visits}</p>
                </div>
              )}
              {formData.cohabitation_proof !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Cohabitation Proof</p>
                  <p className="font-medium">{formatBoolean(formData.cohabitation_proof)}</p>
                </div>
              )}
              {formData.shared_financial_accounts !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Shared Financial Accounts</p>
                  <p className="font-medium">{formatBoolean(formData.shared_financial_accounts)}</p>
                </div>
              )}
              {formData.wedding_photos_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Wedding Photos Available</p>
                  <p className="font-medium">{formatBoolean(formData.wedding_photos_available)}</p>
                </div>
              )}
              {formData.communication_logs !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Communication Logs</p>
                  <p className="font-medium">{formatBoolean(formData.communication_logs)}</p>
                </div>
              )}
              {formData.money_transfer_receipts_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Money Transfer Receipts Available</p>
                  <p className="font-medium">{formatBoolean(formData.money_transfer_receipts_available)}</p>
                </div>
              )}
              {formData.driving_license_copy_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Driving License Copy Available</p>
                  <p className="font-medium">{formatBoolean(formData.driving_license_copy_available)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Immigration History Section */}
        {(formData.previous_visa_applications !== undefined || formData.previous_visa_denial !== undefined || formData.overstay_or_violation !== undefined || formData.criminal_record !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9"
                ></path>
              </svg>
              Immigration History
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.previous_visa_applications !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Previous Visa Applications</p>
                  <p className="font-medium">{formatBoolean(formData.previous_visa_applications)}</p>
                </div>
              )}
              {formData.previous_visa_denial !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Previous Visa Denial</p>
                  <p className="font-medium">{formatBoolean(formData.previous_visa_denial)}</p>
                </div>
              )}
              {formData.overstay_or_violation !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Overstay or Violation</p>
                  <p className="font-medium">{formatBoolean(formData.overstay_or_violation)}</p>
                </div>
              )}
              {formData.criminal_record !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Criminal Record</p>
                  <p className="font-medium">{formatBoolean(formData.criminal_record)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Profile Section */}
        {(formData.sponsor_annual_income || formData.household_size || formData.has_tax_returns !== undefined || formData.has_employment_letter !== undefined || formData.has_paystubs !== undefined || formData.joint_sponsor_available !== undefined || formData.i864_affidavit_submitted !== undefined || formData.i864_supporting_financial_documents !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Financial Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.sponsor_annual_income && (
                <div>
                  <p className="text-sm text-slate-600">Sponsor Annual Income</p>
                  <p className="font-medium">${formData.sponsor_annual_income?.toLocaleString()}</p>
                </div>
              )}
              {formData.household_size && (
                <div>
                  <p className="text-sm text-slate-600">Household Size</p>
                  <p className="font-medium">{formData.household_size}</p>
                </div>
              )}
              {formData.has_tax_returns !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Has Tax Returns</p>
                  <p className="font-medium">{formatBoolean(formData.has_tax_returns)}</p>
                </div>
              )}
              {formData.has_employment_letter !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Has Employment Letter</p>
                  <p className="font-medium">{formatBoolean(formData.has_employment_letter)}</p>
                </div>
              )}
              {formData.has_paystubs !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Has Paystubs</p>
                  <p className="font-medium">{formatBoolean(formData.has_paystubs)}</p>
                </div>
              )}
              {formData.joint_sponsor_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Joint Sponsor Available</p>
                  <p className="font-medium">{formatBoolean(formData.joint_sponsor_available)}</p>
                </div>
              )}
              {formData.i864_affidavit_submitted !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">I-864 Affidavit Submitted</p>
                  <p className="font-medium">{formatBoolean(formData.i864_affidavit_submitted)}</p>
                </div>
              )}
              {formData.i864_supporting_financial_documents !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">I-864 Supporting Financial Documents</p>
                  <p className="font-medium">{formatBoolean(formData.i864_supporting_financial_documents)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Core Identity Documents Section */}
        {(formData.urdu_marriage_certificate !== undefined || formData.english_translation_certificate !== undefined || formData.union_council_certificate !== undefined || formData.family_registration_certificate !== undefined || formData.birth_certificates !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Core Identity Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.urdu_marriage_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Urdu Marriage Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.urdu_marriage_certificate)}</p>
                </div>
              )}
              {formData.english_translation_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">English Translation Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.english_translation_certificate)}</p>
                </div>
              )}
              {formData.union_council_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Union Council Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.union_council_certificate)}</p>
                </div>
              )}
              {formData.family_registration_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Family Registration Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.family_registration_certificate)}</p>
                </div>
              )}
              {formData.birth_certificates !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Birth Certificates</p>
                  <p className="font-medium">{formatBoolean(formData.birth_certificates)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Passport & Police Documents Section */}
        {(formData.passports_available !== undefined || formData.passport_copy_available !== undefined || formData.police_certificate_new !== undefined || formData.police_certificate_old !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Passport & Police Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.passports_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Passports Available</p>
                  <p className="font-medium">{formatBoolean(formData.passports_available)}</p>
                </div>
              )}
              {formData.passport_copy_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Passport Copy Available</p>
                  <p className="font-medium">{formatBoolean(formData.passport_copy_available)}</p>
                </div>
              )}
              {formData.police_certificate_new !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Police Certificate (New)</p>
                  <p className="font-medium">{formatBoolean(formData.police_certificate_new)}</p>
                </div>
              )}
              {formData.police_certificate_old !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Police Certificate (Old)</p>
                  <p className="font-medium">{formatBoolean(formData.police_certificate_old)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interview & Medical Documents Section */}
        {(formData.ds260_confirmation !== undefined || formData.interview_letter !== undefined || formData.courier_registration !== undefined || formData.medical_report_available !== undefined || formData.polio_vaccination_certificate !== undefined || formData.covid_vaccination_certificate !== undefined || formData.passport_photos_2x2 !== undefined) && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
              Interview & Medical Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.ds260_confirmation !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">DS-260 Confirmation</p>
                  <p className="font-medium">{formatBoolean(formData.ds260_confirmation)}</p>
                </div>
              )}
              {formData.interview_letter !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Interview Letter</p>
                  <p className="font-medium">{formatBoolean(formData.interview_letter)}</p>
                </div>
              )}
              {formData.courier_registration !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Courier Registration</p>
                  <p className="font-medium">{formatBoolean(formData.courier_registration)}</p>
                </div>
              )}
              {formData.medical_report_available !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Medical Report Available</p>
                  <p className="font-medium">{formatBoolean(formData.medical_report_available)}</p>
                </div>
              )}
              {formData.polio_vaccination_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Polio Vaccination Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.polio_vaccination_certificate)}</p>
                </div>
              )}
              {formData.covid_vaccination_certificate !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">COVID Vaccination Certificate</p>
                  <p className="font-medium">{formatBoolean(formData.covid_vaccination_certificate)}</p>
                </div>
              )}
              {formData.passport_photos_2x2 !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Passport Photos (2x2)</p>
                  <p className="font-medium">{formatBoolean(formData.passport_photos_2x2)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Prev
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={() => onSaveForLater && onSaveForLater()}
              variant="outline"
              className="text-slate-600"
              type="button"
              disabled={loading}
            >
              Save for Later
            </Button>
            <Button
              onClick={onSubmit}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? "Submitting..." : "Submit for Analysis"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VisaCaseStrengthChecker() {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    caseType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const savedSessionId = localStorage.getItem('visaCheckerSessionId');
      
      if (savedSessionId) {
        try {
          setLoading(true);
          const response = await fetch(`/api/visa-checker/session/${savedSessionId}`);
          const sessionData = await response.json();
          
          if (response.ok && sessionData.completed === false) {
            // Found an incomplete session, restore it
            setSessionId(savedSessionId);
            setFormData(prev => ({
              ...prev,
              caseType: sessionData.caseType,
              ...sessionData.answers
            }));
            
            const answeredQuestions = Object.keys(sessionData.answers).filter(key => sessionData.answers[key] !== undefined && sessionData.answers[key] !== "").length;
            
            setStep(0); 
          } else {
            // Session doesn't exist or is already completed, remove from localStorage
            localStorage.removeItem('visaCheckerSessionId');
          }
        } catch (err) {
          console.error('Error restoring session:', err);
          localStorage.removeItem('visaCheckerSessionId');
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkExistingSession();
  }, []);

  // Load questions from the JSON file
  interface QuestionDefinition {
    id: string;
    label: string;
    type: string;
    options?: string | string[] | "US_STATES_LIST";
    risk_tag?: string;
  }

  interface QuestionnaireData {
    sections: Array<{
      title: string;
      questions: QuestionDefinition[];
    }>;
  }

  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);

  useEffect(() => {
    if (!questionnaireData) {
      import("../../../data/visa-case-strength-checker.json")
        .then((data) => setQuestionnaireData(data.default || data as QuestionnaireData))
        .catch((err) => console.error("Error loading questionnaire data:", err));
    }
  }, [questionnaireData]);

  const handleCaseTypeChange = (caseType: CaseType) => {
    setFormData((prev) => ({ ...prev, caseType }));
    setError(null);
  };

  const handleInputChange = (id: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) {
      setError(null);
    }
    
    // Debounce the save operation to prevent rapid API calls
    if (sessionId) {
      // Clear the existing timeout if there is one
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set a new timeout to save the answers after 500ms
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          // Create updated form data with the new value
          const updatedFormData = { ...formData, [id]: value };
          // Filter out non-question fields before saving
          const { caseType, ...answers } = updatedFormData;
          const answersResponse = await fetch(`/api/visa-checker/session/${sessionId}/answers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers,
            }),
          });
          
          if (!answersResponse.ok) {
            console.error('Failed to save answer:', await answersResponse.text());
          }
        } catch (err) {
          console.error('Error saving answer:', err);
        }
      }, 500); // Wait 500ms before saving
    }
  };

  const nextStep = async () => {
    // Validate current step if needed
    if (step === 0 && !formData.caseType) {
      setError("Please select a case type");
      return;
    }
    
    // If we're on the first step (case type selection), create a session
    if (step === 0 && formData.caseType) {
      try {
        setLoading(true);
        const sessionResponse = await fetch('/api/visa-checker/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caseType: formData.caseType,
            userEmail: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'guest@example.com' : 'guest@example.com',
            userName: typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Guest User' : 'Guest User',
          }),
        });
        
        const sessionResult = await sessionResponse.json();
        
        if (sessionResponse.ok) {
          setSessionId(sessionResult.sessionId);
          // Save session ID to localStorage for resume later functionality
          localStorage.setItem('visaCheckerSessionId', sessionResult.sessionId);
          
          // Save initial answers, excluding non-question fields
          const { caseType, ...answers } = formData;
          const answersResponse = await fetch(`/api/visa-checker/session/${sessionResult.sessionId}/answers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers,
            }),
          });
          
          if (!answersResponse.ok) {
            console.error('Failed to save initial answers:', await answersResponse.text());
          }
        } else {
          throw new Error(sessionResult.error || 'Failed to create session');
        }
      } catch (err) {
        console.error('Error creating session:', err);
        setError(err instanceof Error ? err.message : 'Failed to create session. Please try again.');
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    if (step > 0 && questionnaireData) {
      const currentSectionIndex = step - 1;
      const currentSection = questionnaireData.sections[currentSectionIndex];

      if (currentSection) {
        for (const question of currentSection.questions as Array<{
          id: keyof FormData;
          label: string;
          type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
          options?: string[] | "US_STATES_LIST";
          risk_tag?: string;
        }>) {
          const fieldValue = formData[question.id];

          // Skip validation for the US state question as it's optional
          if (question.id === 'intended_us_state_of_residence') {
            continue;
          }

          if (question.type === "boolean") {
            if (fieldValue === undefined || fieldValue === null) {
              setError(`Please select an option for: ${question.label}`);
              return;
            }
          } else if (question.type === "select") {
            if (
              fieldValue === undefined ||
              fieldValue === null ||
              fieldValue === ""
            ) {
              setError(`Please select an option for: ${question.label}`);
              return;
            }
          } else {
            if (
              fieldValue === undefined ||
              fieldValue === null ||
              fieldValue === ""
            ) {
              setError(`Please fill in all required fields: ${question.label}`);
              return;
            }
          }

          if (
            question.type === "number" &&
            typeof fieldValue === "number" &&
            isNaN(Number(fieldValue))
          ) {
            setError(`Please enter a valid number for ${question.label}`);
            return;
          }

          if (
            question.type === "date" &&
            typeof fieldValue === "string" &&
            fieldValue === ""
          ) {
            setError(`Please enter a valid date for ${question.label}`);
            return;
          }

          if (
            question.type === "number" &&
            typeof fieldValue === "number" &&
            fieldValue < 0
          ) {
            setError(`Please enter a valid positive number for ${question.label}`);
            return;
          }

          // Additional validation for date type
          if (
            question.type === "date" &&
            typeof fieldValue === "string" &&
            fieldValue !== "" &&
            !isNaN(Date.parse(fieldValue))
          ) {
            const dateValue = new Date(fieldValue);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // For DOB fields, ensure date is in the past
            if (
              question.id.includes('dob') &&
              dateValue >= today
            ) {
              setError(`Date of birth must be in the past for ${question.label}`);
              return;
            }
          }
        }
      }
    }

    setStep((prev) => prev + 1);
    if (error) {
      setError(null);
    }
  };

  const prevStep = async () => {
    // Save answers before moving to previous step if we have a session ID
    if (sessionId) {
      try {
        // Filter out non-question fields before saving
        const { caseType, ...answers } = formData;
        const answersResponse = await fetch(`/api/visa-checker/session/${sessionId}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
          }),
        });
        
        if (!answersResponse.ok) {
          console.error('Failed to save answers on step change:', await answersResponse.text());
        }
      } catch (err) {
        console.error('Error saving answers on step change:', err);
      }
    }
    
    setStep((prev) => prev - 1);
    if (error) {
      setError(null);
    }
  };

  const handleSaveForLater = async () => {
    if (!sessionId) {
      setError('No session found to save. Please start the assessment first.');
      return;
    }
    
    try {
      setLoading(true);
      // Force save all current answers
      const { caseType, ...answers } = formData;
      const answersResponse = await fetch(`/api/visa-checker/session/${sessionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
        }),
      });
      
      if (answersResponse.ok) {
        // Save session ID to localStorage
        localStorage.setItem('visaCheckerSessionId', sessionId);
        alert('Your progress has been saved. You can return later to continue.');
      } else {
        console.error('Failed to save answers:', await answersResponse.text());
        setError('Failed to save your progress. Please try again.');
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Error saving progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      setError('No session found. Please restart the assessment.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Submit for scoring
      const submitResponse = await fetch(`/api/visa-checker/session/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (submitResponse.ok) {
        const responseData = await submitResponse.json();
        // Remove the session from localStorage since it's now completed
        localStorage.removeItem('visaCheckerSessionId');
        
        // Navigate to results page after successful submit
        setStep(prev => prev + 1);
      } else {
        const errorData = await submitResponse.text();
        console.error('Submit response error:', errorData);
        throw new Error('Failed to submit for scoring');
      }
    } catch (err) {
      console.error('Error submitting analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    if (!questionnaireData) {
      return <div>Loading questionnaire...</div>;
    }

    if (step === 0) {
      return (
        <CaseTypeStep
          formData={formData}
          error={error}
          onCaseTypeChange={handleCaseTypeChange}
          onNext={nextStep}
          onBack={() => window.history.back()}
        />
      );
    }

    if (step > 0 && step <= questionnaireData.sections.length) {
      const sectionIndex = step - 1;
      const section = questionnaireData.sections[sectionIndex];

      return (
        <QuestionStep
          title={section.title}
          description={`Please answer the following questions for ${section.title}`}
          questions={section.questions.map((q: QuestionDefinition) => ({
            id: q.id as keyof FormData,
            label: q.label,
            type: q.type as "text" | "textarea" | "number" | "date" | "boolean" | "select",
            options: q.options || undefined,
          }))}
          formData={formData}
          error={error}
          onChange={handleInputChange}
          onNext={nextStep}
          onBack={prevStep}
          onSaveForLater={handleSaveForLater}
        />
      );
    }

    // Check if we're on the review page (after completing all questions)
    if (step === questionnaireData.sections.length + 1) {
      return (
        <ReviewStep
          formData={formData}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
          onBack={prevStep}
          onSaveForLater={handleSaveForLater}
        />
      );
    }

    // Check if we're on the results page (after submitting)
    if (step === questionnaireData.sections.length + 2) {
      if (!sessionId) {
        return (
          <div className="text-center py-8">
            <p className="text-slate-600">Loading results...</p>
          </div>
        );
      }
      return <ResultPage sessionId={sessionId} onRestart={() => setStep(0)} />;
    }

    return (
      <ReviewStep
        formData={formData}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onBack={prevStep}
      />
    );
  };

  const renderProgressSections = () => {
    if (!questionnaireData || step === 0) return null;

    const sections = questionnaireData.sections;
    const currentSectionIndex = step - 1;

    return (
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <div className="flex w-full">
            {sections.map((section: { title: string; questions: QuestionDefinition[] }, index: number) => {
              const isActive = index === currentSectionIndex;

              return (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <span
                    className={`text-xs font-medium mb-1 ${
                      isActive ? "text-teal-600" : "text-slate-500"
                    }`}
                  >
                    {section.title.substring(0, 3).toUpperCase()}
                  </span>

                  <div
                    className={`h-2 rounded-full w-full ${
                      isActive ? "bg-teal-600" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Visa Case Strength Checker
        </h1>
        <p className="text-slate-600">
          Assess your IR-1/CR-1 visa case strength with our guided questionnaire
        </p>
      </div>

      {renderProgressSections()}

      <Card className="p-6 shadow-lg">{renderStep()}</Card>
    </div>
  );
}
