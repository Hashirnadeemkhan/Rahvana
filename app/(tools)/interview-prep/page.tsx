"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { ResultPage } from "./result/ResultPage";
import { InterviewPrepOutput } from "../../../lib/interview-prep/types";
import { OptionCard } from "@/app/components/interview-prep/OptionCard";
import { ToggleSwitch } from "@/app/components/interview-prep/ToggleSwitch";
import { useAuth } from "@/app/context/AuthContext";
import { createBrowserClient } from "@supabase/ssr";
import { mapProfileToGenericForm } from "@/lib/autoFill/mapper";
import { MasterProfile } from "@/types/profile";

type CaseType = "Spouse";

interface FormData {
  caseType: CaseType | "";
  visaCategory?: string;
  // Basic Case Information
  beneficiary_country?: string;
  age_range?: string;
  highest_education?: string;
  marriage_date?: string;
  months_since_marriage?: number;
  marriage_location?: string;
  previous_marriages?: string;
  // Relationship Origin
  relationship_origin_type?: string;
  total_time_spent_together?: string;
  number_of_in_person_visits?: number;
  proposal_details?: string;
  courtship_duration?: string;
  // Married Life & Daily Interaction
  current_living_arrangement?: string;
  spouse_address?: string;
  communication_frequency?: string;
  daily_communication?: string;
  shared_activities?: string;
  important_dates_knowledge?: boolean;
  // Family & Social Knowledge
  met_spouse_family?: boolean;
  family_reaction_to_marriage?: string;
  wedding_attendees?: string;
  marriage_type?: string;
  mutual_friends?: boolean;
  // Petitioner Information
  petitioner_status?: string;
  petitioner_income_level?: string;
  household_size?: string;
  // Background & Future Plans
  beneficiary_employment?: string;
  sponsor_employment?: string;
  military_or_defense_background?: boolean;
  previous_us_visits?: boolean;
  previous_visa_refusal?: boolean;
  visa_overstay_history?: boolean;
  criminal_history?: boolean;
  english_proficiency?: string;
  intended_us_state?: string;
  living_arrangements_in_us?: string;
  future_plans?: string;
  // Finances & Household Management
  joint_finances?: boolean;
  financial_arrangement_description?: string;
}

interface CaseTypeStepProps {
  formData: FormData;
  error: string | null;
  onCaseTypeChange: (caseType: CaseType) => void;
  onNext: () => void;
  onBack: () => void;
}

const mapAnswersToFormData = (
  answers: Array<{ question_key: string; answer_value: unknown }>,
): Partial<FormData> => {
  const mapped: Partial<FormData> = {};
  answers.forEach((a) => {
    mapped[a.question_key as keyof FormData] = a.answer_value as never;
  });
  return mapped;
};

const CaseTypeStep = ({
  formData,
  error,
  onCaseTypeChange,
  onNext,
  onBack,
}: CaseTypeStepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Case Type</h2>

    <p className="text-slate-600 mb-8">
      Please select the type of visa case you want to prepare for interview.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ACTIVE: SPOUSE */}
      <button
        type="button"
        className={`p-6 rounded-xl text-center transition-all cursor-pointer ${
          formData.caseType === "Spouse"
            ? "border-teal-600 bg-teal-50 border-4"
            : "border-gray-200 hover:border-teal-400 border-2"
        }`}
        onClick={() => onCaseTypeChange("Spouse")}
      >
        <h3 className="font-semibold text-lg mb-2">Spouse Visa</h3>
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
        <p className="text-sm text-slate-500">IR-5 – Parent of U.S. Citizen</p>
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

      {/* COMING SOON: K1 */}
      <button
        type="button"
        disabled
        className="p-6 border-2 rounded-xl text-center bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          K1 Visa
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Coming Soon
          </span>
        </h3>
        <p className="text-sm text-slate-500">K1 – Fiance(e) of US Citizen</p>
      </button>

      {/* COMING SOON: B1/B2 */}
      <button
        type="button"
        disabled
        className="p-6 border-2 rounded-xl text-center bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          B1/B2 Visa
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Coming Soon
          </span>
        </h3>
        <p className="text-sm text-slate-500">B1 / B2 – Visitor Visa</p>
      </button>
    </div>

    {error && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm max-w-2xl">
        {error}
      </div>
    )}

    <div className="flex justify-between pt-6 max-w-2xl mx-auto">
      <Button
        onClick={onBack}
        variant="outline"
        className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
      >
        Back
      </Button>

      <Button
        onClick={onNext}
        className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
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
    key: keyof FormData;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
    options?: string | string[];
    required?: boolean;
  }>;
  formData: FormData;
  error: string | null;
  onChange: (id: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
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
}: QuestionStepProps) => {
  const renderInput = (question: {
    key: keyof FormData;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
    options?: string | string[];
    required?: boolean;
  }) => {
    const value = formData[question.key] as
      | string
      | number
      | boolean
      | undefined;

    // Check if the question should be rendered with option cards
    const useOptionCards = [
      'age_range',
      'highest_education',
      'total_time_spent_together',
      'current_living_arrangement',
      'communication_frequency',
      'daily_communication',
      'marriage_type',
      'petitioner_status',
      'petitioner_income_level',
      'household_size',
      'english_proficiency',
      'previous_marriages',
      'relationship_origin_type',
    ].includes(question.key);

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
                question.key,
                question.type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
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
            onChange={(e) => onChange(question.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Enter details for ${question.label.toLowerCase()}`}
            rows={3}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center justify-between p-4 rounded-lg bg-teal-50 border">
            <span className="text-slate-700">{question.label}</span>
            <ToggleSwitch
              checked={!!value}
              onChange={(checked) => onChange(question.key, checked)}
            />
          </div>
        );
      case "select":
        if (Array.isArray(question.options)) {
          if (useOptionCards) {
            // Render options as cards
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {question.options.map((option: string) => (
                  <OptionCard
                    key={option}
                    value={option}
                    label={option}
                    isSelected={value === option}
                    onSelect={() => onChange(question.key, option)}
                  />
                ))}
              </div>
            );
          } else {
            // Render as traditional select
            return (
              <select
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(question.key, e.target.value)}
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
          return (
            <div key={question.key} className="space-y-2">
              {question.type !== "boolean" && (
                <label className="block text-sm font-medium text-slate-700">
                  {question.label}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}
              {renderInput(question)}
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
}

const ReviewStep = ({
  formData,
  error,
  loading,
  onSubmit,
  onBack,
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

        {/* Basic Case Information Section */}
        {(formData["beneficiary_country"] ||
          formData["age_range"] ||
          formData["highest_education"] ||
          formData["marriage_date"] ||
          formData["months_since_marriage"] ||
          formData["marriage_location"] ||
          formData["previous_marriages"]) && (
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
              Basic Case Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["beneficiary_country"] && (
                <div>
                  <p className="text-sm text-slate-600">Beneficiary Country</p>
                  <p className="font-medium">
                    {formData["beneficiary_country"]}
                  </p>
                </div>
              )}
              {formData["age_range"] && (
                <div>
                  <p className="text-sm text-slate-600">Age Range</p>
                  <p className="font-medium">{formData["age_range"]}</p>
                </div>
              )}
              {formData["highest_education"] && (
                <div>
                  <p className="text-sm text-slate-600">Highest Education</p>
                  <p className="font-medium">{formData["highest_education"]}</p>
                </div>
              )}
              {formData["marriage_date"] && (
                <div>
                  <p className="text-sm text-slate-600">Marriage Date</p>
                  <p className="font-medium">
                    {formatDate(formData["marriage_date"])}
                  </p>
                </div>
              )}
              {formData["months_since_marriage"] && (
                <div>
                  <p className="text-sm text-slate-600">Months Since Marriage</p>
                  <p className="font-medium">{formData["months_since_marriage"]}</p>
                </div>
              )}
              {formData["marriage_location"] && (
                <div>
                  <p className="text-sm text-slate-600">Marriage Location</p>
                  <p className="font-medium">{formData["marriage_location"]}</p>
                </div>
              )}
              {formData["previous_marriages"] && (
                <div>
                  <p className="text-sm text-slate-600">Previous Marriages</p>
                  <p className="font-medium">
                    {formData["previous_marriages"]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Relationship Origin Section */}
        {(formData["relationship_origin_type"] ||
          formData["total_time_spent_together"] ||
          formData["number_of_in_person_visits"] !== undefined ||
          formData["proposal_details"] ||
          formData["courtship_duration"]) && (
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
              Relationship Origin
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["relationship_origin_type"] && (
                <div>
                  <p className="text-sm text-slate-600">How Did You Meet</p>
                  <p className="font-medium">{formData["relationship_origin_type"]}</p>
                </div>
              )}
              {formData["total_time_spent_together"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Total Time Spent Together
                  </p>
                  <p className="font-medium">
                    {formData["total_time_spent_together"]}
                  </p>
                </div>
              )}
              {formData["number_of_in_person_visits"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Number of In-Person Visits
                  </p>
                  <p className="font-medium">
                    {formData["number_of_in_person_visits"]}
                  </p>
                </div>
              )}
              {formData["proposal_details"] && (
                <div>
                  <p className="text-sm text-slate-600">Proposal Details</p>
                  <p className="font-medium">{formData["proposal_details"]}</p>
                </div>
              )}
              {formData["courtship_duration"] && (
                <div>
                  <p className="text-sm text-slate-600">Courtship Duration</p>
                  <p className="font-medium">
                    {formData["courtship_duration"]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Married Life & Daily Interaction Section */}
        {(formData["current_living_arrangement"] ||
          formData["spouse_address"] ||
          formData["communication_frequency"] ||
          formData["daily_communication"] ||
          formData["shared_activities"] ||
          formData["important_dates_knowledge"] !== undefined) && (
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
              </svg>
              Married Life & Daily Interaction
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["current_living_arrangement"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Current Living Arrangement
                  </p>
                  <p className="font-medium">
                    {formData["current_living_arrangement"]}
                  </p>
                </div>
              )}
              {formData["spouse_address"] && (
                <div>
                  <p className="text-sm text-slate-600">Spouse Address</p>
                  <p className="font-medium">{formData["spouse_address"]}</p>
                </div>
              )}
              {formData["communication_frequency"] && (
                <div>
                  <p className="text-sm text-slate-600">Communication Frequency</p>
                  <p className="font-medium">{formData["communication_frequency"]}</p>
                </div>
              )}
              {formData["daily_communication"] && (
                <div>
                  <p className="text-sm text-slate-600">Daily Communication</p>
                  <p className="font-medium">
                    {formData["daily_communication"]}
                  </p>
                </div>
              )}
              {formData["shared_activities"] && (
                <div>
                  <p className="text-sm text-slate-600">Shared Activities</p>
                  <p className="font-medium">{formData["shared_activities"]}</p>
                </div>
              )}
              {formData["important_dates_knowledge"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Important Dates Knowledge
                  </p>
                  <p className="font-medium">
                    {formatBoolean(formData["important_dates_knowledge"])}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Family & Social Knowledge Section */}
        {(formData["met_spouse_family"] !== undefined ||
          formData["family_reaction_to_marriage"] ||
          formData["wedding_attendees"] ||
          formData["marriage_type"] ||
          formData["mutual_friends"] !== undefined) && (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              Family & Social Knowledge
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["met_spouse_family"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Met Spouse Family</p>
                  <p className="font-medium">
                    {formatBoolean(formData["met_spouse_family"])}
                  </p>
                </div>
              )}
              {formData["family_reaction_to_marriage"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Family Reaction to Marriage
                  </p>
                  <p className="font-medium">
                    {formData["family_reaction_to_marriage"]}
                  </p>
                </div>
              )}
              {formData["wedding_attendees"] && (
                <div>
                  <p className="text-sm text-slate-600">Wedding Attendees</p>
                  <p className="font-medium">{formData["wedding_attendees"]}</p>
                </div>
              )}
              {formData["marriage_type"] && (
                <div>
                  <p className="text-sm text-slate-600">Marriage Type</p>
                  <p className="font-medium">{formData["marriage_type"]}</p>
                </div>
              )}
              {formData["mutual_friends"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Mutual Friends</p>
                  <p className="font-medium">
                    {formatBoolean(formData["mutual_friends"])}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Travel & Background History Section */}
        {(formData["military_or_defense_background"] !== undefined ||
          formData["previous_us_visits"] !== undefined ||
          formData["previous_visa_refusal"] !== undefined ||
          formData["visa_overstay_history"] !== undefined ||
          formData["criminal_history"] !== undefined) && (
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
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                ></path>
              </svg>
              Travel & Background History
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["military_or_defense_background"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Military/Defense Background
                  </p>
                  <p className="font-medium">
                    {formatBoolean(formData["military_or_defense_background"])}
                  </p>
                </div>
              )}
              {formData["previous_us_visits"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Previous US Visits</p>
                  <p className="font-medium">
                    {formatBoolean(formData["previous_us_visits"])}
                  </p>
                </div>
              )}
              {formData["previous_visa_refusal"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Previous Visa Refusal
                  </p>
                  <p className="font-medium">
                    {formatBoolean(formData["previous_visa_refusal"])}
                  </p>
                </div>
              )}
              {formData["visa_overstay_history"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Visa Overstay History
                  </p>
                  <p className="font-medium">
                    {formatBoolean(formData["visa_overstay_history"])}
                  </p>
                </div>
              )}
              {formData["criminal_history"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">
                    Criminal History
                  </p>
                  <p className="font-medium">
                    {formatBoolean(formData["criminal_history"])}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Background & Future Plans Section */}
        {(formData["beneficiary_employment"] ||
          formData["sponsor_employment"] ||
          formData["english_proficiency"] ||
          formData["intended_us_state"] ||
          formData["living_arrangements_in_us"] ||
          formData["future_plans"]) && (
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
              Background & Future Plans
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["beneficiary_employment"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Beneficiary Employment
                  </p>
                  <p className="font-medium">
                    {formData["beneficiary_employment"]}
                  </p>
                </div>
              )}
              {formData["sponsor_employment"] && (
                <div>
                  <p className="text-sm text-slate-600">Sponsor Employment</p>
                  <p className="font-medium">
                    {formData["sponsor_employment"]}
                  </p>
                </div>
              )}
              {formData["english_proficiency"] && (
                <div>
                  <p className="text-sm text-slate-600">English Proficiency</p>
                  <p className="font-medium">
                    {formData["english_proficiency"]}
                  </p>
                </div>
              )}
              {formData["intended_us_state"] && (
                <div>
                  <p className="text-sm text-slate-600">Intended US State</p>
                  <p className="font-medium">{formData["intended_us_state"]}</p>
                </div>
              )}
              {formData["living_arrangements_in_us"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Living Arrangements in US
                  </p>
                  <p className="font-medium">
                    {formData["living_arrangements_in_us"]}
                  </p>
                </div>
              )}
              {formData["future_plans"] && (
                <div>
                  <p className="text-sm text-slate-600">Future Plans</p>
                  <p className="font-medium">{formData["future_plans"]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Petitioner Information Section */}
        {(formData["petitioner_status"] ||
          formData["petitioner_income_level"] ||
          formData["household_size"]) && (
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
              Petitioner Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["petitioner_status"] && (
                <div>
                  <p className="text-sm text-slate-600">Petitioner Status</p>
                  <p className="font-medium">{formData["petitioner_status"]}</p>
                </div>
              )}
              {formData["petitioner_income_level"] && (
                <div>
                  <p className="text-sm text-slate-600">Petitioner Income Level</p>
                  <p className="font-medium">{formData["petitioner_income_level"]}</p>
                </div>
              )}
              {formData["household_size"] && (
                <div>
                  <p className="text-sm text-slate-600">Household Size</p>
                  <p className="font-medium">{formData["household_size"]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Finances & Household Management Section */}
        {(formData["joint_finances"] !== undefined ||
          formData["financial_arrangement_description"]) && (
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
              Finances & Household Management
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData["joint_finances"] !== undefined && (
                <div>
                  <p className="text-sm text-slate-600">Joint Finances</p>
                  <p className="font-medium">
                    {formatBoolean(formData["joint_finances"])}
                  </p>
                </div>
              )}
              {formData["financial_arrangement_description"] && (
                <div>
                  <p className="text-sm text-slate-600">
                    Financial Arrangement Description
                  </p>
                  <p className="font-medium">
                    {formData["financial_arrangement_description"]}
                  </p>
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
              onClick={onSubmit}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? "Submitting..." : "Generate Interview Prep"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InterviewPreparation() {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    caseType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedResults, setGeneratedResults] =
    useState<InterviewPrepOutput | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { user } = useAuth();
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
            caseType: formData.caseType,
            beneficiary_country: formData.beneficiary_country,
            age_range: formData.age_range,
            highest_education: formData.highest_education,
            marriage_date: formData.marriage_date,
            marriage_location: formData.marriage_location,
            previous_marriages: formData.previous_marriages,
            relationship_origin_type: formData.relationship_origin_type,
            current_living_arrangement: formData.current_living_arrangement,
            spouse_address: formData.spouse_address,
            communication_frequency: formData.communication_frequency,
            daily_communication: formData.daily_communication,
            shared_activities: formData.shared_activities,
            important_dates_knowledge: formData.important_dates_knowledge,
            met_spouse_family: formData.met_spouse_family,
            family_reaction_to_marriage: formData.family_reaction_to_marriage,
            wedding_attendees: formData.wedding_attendees,
            marriage_type: formData.marriage_type,
            mutual_friends: formData.mutual_friends,
            petitioner_status: formData.petitioner_status,
            petitioner_income_level: formData.petitioner_income_level,
            household_size: formData.household_size,
            beneficiary_employment: formData.beneficiary_employment,
            sponsor_employment: formData.sponsor_employment,
            military_or_defense_background: formData.military_or_defense_background,
            previous_us_visits: formData.previous_us_visits,
            previous_visa_refusal: formData.previous_visa_refusal,
            visa_overstay_history: formData.visa_overstay_history,
            criminal_history: formData.criminal_history,
            english_proficiency: formData.english_proficiency,
            intended_us_state: formData.intended_us_state,
            living_arrangements_in_us: formData.living_arrangements_in_us,
            future_plans: formData.future_plans,
            joint_finances: formData.joint_finances,
            financial_arrangement_description: formData.financial_arrangement_description,
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

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const savedSessionId = localStorage.getItem("interviewPrepSessionId");

      if (savedSessionId) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/interview-prep/sessions/${savedSessionId}`,
          );
          const sessionData = await response.json();

          if (
            response.ok &&
            sessionData.session &&
            sessionData.session.completed === false
          ) {
            // Found an incomplete session, restore it
            setSessionId(savedSessionId);
            setFormData((prev) => ({
              ...prev,
              caseType: sessionData.session.case_type,
              ...sessionData.session.answers,
            }));

            setStep(0);
          } else {
            // Session doesn't exist or is already completed, remove from localStorage
            localStorage.removeItem("interviewPrepSessionId");
          }
        } catch (err) {
          console.error("Error restoring session:", err);
          localStorage.removeItem("interviewPrepSessionId");
        } finally {
          setLoading(false);
        }
      }
    };

    checkExistingSession();
  }, []);

  // Load questions from the JSON file
  interface QuestionDefinition {
    key: string;
    label: string;
    type: string;
    options?: string | string[];
    required?: boolean;
  }

  interface QuestionnaireData {
    sections: Array<{
      id: string;
      title: string;
      description: string;
      questions: QuestionDefinition[];
    }>;
  }

  const [questionnaireData, setQuestionnaireData] =
    useState<QuestionnaireData | null>(null);

  useEffect(() => {
    if (!questionnaireData) {
      import("../../../data/interview-intake-questionnaire.json")
        .then((data) =>
          setQuestionnaireData(data.default || (data as QuestionnaireData)),
        )
        .catch((err) =>
          console.error("Error loading questionnaire data:", err),
        );
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
          const updatedFormData = { ...formData };
          (updatedFormData as Record<string, unknown>)[id as string] = value;
          // Filter out non-question fields before saving
          const { caseType, visaCategory, ...answers } = updatedFormData;
          const answersResponse = await fetch(
            `/api/interview-prep/sessions/${sessionId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                action: "update-answers",
                answers,
              }),
            },
          );

          if (!answersResponse.ok) {
            console.error(
              "Failed to save answer:",
              await answersResponse.text(),
            );
          }
        } catch (err) {
          console.error("Error saving answer:", err);
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

    // If we're on the first step (case type selection), check for existing session first
    if (step === 0 && formData.caseType) {
      try {
        setLoading(true);
        const storedSessionId = localStorage.getItem("interviewPrepSessionId");

        // 🔹 CHECK FOR EXISTING SESSION FIRST
        if (storedSessionId) {
          const existingRes = await fetch(
            `/api/interview-prep/sessions/${storedSessionId}`,
          );
          const existingData = await existingRes.json();

          if (
            existingRes.ok &&
            existingData.session &&
            existingData.session.completed === false &&
            existingData.session.case_type === formData.caseType
          ) {
            // ✅ Resume existing session
            setSessionId(existingData.session.id);

            // Restore answers to form data
            const restoredAnswers = mapAnswersToFormData(
              existingData.session.answers || [],
            );

            setFormData((prev) => ({
              ...prev,
              caseType: existingData.session.case_type,
              ...restoredAnswers,
            }));

            // Force re-render to populate form fields
            setTimeout(() => {
              setFormData((prev) => ({ ...prev }));
            }, 0);

            setStep(1);
            setLoading(false);
            return;
          }

          // Completed or case type mismatch → clear localStorage
          localStorage.removeItem("interviewPrepSessionId");
        }
        const sessionResponse = await fetch("/api/interview-prep", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            case_type: formData.caseType,
            user_email:
              typeof window !== "undefined"
                ? localStorage.getItem("userEmail") || "test@example.com"
                : "test@example.com",
            user_name:
              typeof window !== "undefined"
                ? localStorage.getItem("userName") || "John Doe"
                : "John Doe",
          }),
        });

        const sessionResult = await sessionResponse.json();

        if (sessionResponse.ok) {
          setSessionId(sessionResult.session.id);
          // Save session ID to localStorage for resume later functionality
          localStorage.setItem(
            "interviewPrepSessionId",
            sessionResult.session.id,
          );

          // Save initial answers, excluding non-question fields
          const { caseType, visaCategory, ...answers } = formData;
          const answersResponse = await fetch(
            `/api/interview-prep/sessions/${sessionResult.session.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                action: "update-answers",
                answers,
              }),
            },
          );

          if (!answersResponse.ok) {
            console.error(
              "Failed to save initial answers:",
              await answersResponse.text(),
            );
          }
        } else {
          throw new Error(sessionResult.error || "Failed to create session");
        }
      } catch (err) {
        console.error("Error creating/resuming session:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create/resume session. Please try again.",
        );
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
          key: keyof FormData;
          label: string;
          type: "text" | "textarea" | "number" | "date" | "boolean" | "select";
          options?: string[];
          required?: boolean;
        }>) {
          const fieldValue = formData[question.key];

          // Skip validation for optional questions
          if (!question.required) {
            continue;
          }

          if (question.type === "boolean") {
            // Skip validation for boolean questions since false/unselected is a valid state
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
            setError(
              `Please enter a valid positive number for ${question.label}`,
            );
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
            if (question.key.includes("date") && dateValue >= today) {
              setError(`Date must be in the past for ${question.label}`);
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
        const { caseType, visaCategory, ...answers } = formData;
        const answersResponse = await fetch(
          `/api/interview-prep/sessions/${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "update-answers",
              answers,
            }),
          },
        );

        if (!answersResponse.ok) {
          console.error(
            "Failed to save answers on step change:",
            await answersResponse.text(),
          );
        }
      } catch (err) {
        console.error("Error saving answers on step change:", err);
      }
    }

    setStep((prev) => prev - 1);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      setError("No session found. Please restart the assessment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit for generating interview prep
      const submitResponse = await fetch(
        `/api/interview-prep/sessions/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "generate",
          }),
        },
      );

      if (submitResponse.ok) {
        const responseData = await submitResponse.json();

        // Longer delay to ensure loading state is visible
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Store the generated results locally instead of navigating
        setGeneratedResults(responseData.output);

        // Mark the session as completed
        const completeResponse = await fetch(
          `/api/interview-prep/sessions/${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "complete",
            }),
          },
        );

        if (!completeResponse.ok) {
          console.error("Failed to mark session as completed");
        }

        // Remove the session from localStorage since it's now completed
        localStorage.removeItem("interviewPrepSessionId");

        // Increment step to show results on the same page
        setStep((prev) => prev + 1);
      } else {
        const errorData = await submitResponse.text();
        console.error("Submit response error:", errorData);
        throw new Error("Failed to generate interview prep materials");
      }
    } catch (err) {
      console.error("Error submitting for interview prep:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate interview prep materials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    if (!questionnaireData) {
      return <div>Loading questionnaire...</div>;
    }

    const renderWithNotification = (content: React.ReactNode) => (
      <div>{content}</div>
    );

    if (step === 0) {
      return (
        <CaseTypeStep
          formData={formData}
          error={error}
          onCaseTypeChange={handleCaseTypeChange}
          onNext={nextStep}
          onBack={() => router.back()}
        />
      );
    }

    if (step > 0 && step <= questionnaireData.sections.length) {
      const sectionIndex = step - 1;
      const section = questionnaireData.sections[sectionIndex];

      return renderWithNotification(
        <QuestionStep
          title={section.title}
          description={section.description}
          questions={section.questions.map((q: QuestionDefinition) => ({
            key: q.key as keyof FormData,
            label: q.label,
            type: q.type as
              | "text"
              | "textarea"
              | "number"
              | "date"
              | "boolean"
              | "select",
            options: q.options || undefined,
            required: q.required,
          }))}
          formData={formData}
          error={error}
          onChange={handleInputChange}
          onNext={nextStep}
          onBack={prevStep}
        />,
      );
    }

    // Check if we're on the review page (after completing all questions)
    if (step === questionnaireData.sections.length + 1) {
      return renderWithNotification(
        <ReviewStep
          formData={formData}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
          onBack={prevStep}
        />,
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
      return (
        <ResultPage
          sessionId={sessionId}
          results={generatedResults}
          onRestart={() => setStep(0)}
        />
      );
    }

    return renderWithNotification(
      <ReviewStep
        formData={formData}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onBack={prevStep}
      />,
    );
  };

  const renderProgressSections = () => {
    if (
      !questionnaireData ||
      step === 0 ||
      step === questionnaireData.sections.length + 2
    )
      return null;

    const sections = questionnaireData.sections;
    const currentSectionIndex = step - 1;

    return (
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <div className="flex w-full">
            {sections.map(
              (
                section: { title: string; questions: QuestionDefinition[] },
                index: number,
              ) => {
                const isActive = index === currentSectionIndex;

                return (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
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
              },
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Interview Preparation Tool
        </h1>
        <p className="text-slate-600">
          Prepare for your IR-1/CR-1 visa interview with personalized questions
          and answers
        </p>
      </div>

      {renderProgressSections()}

      <Card className="p-6 shadow-lg">{renderStep()}</Card>
    </div>
  );
}
