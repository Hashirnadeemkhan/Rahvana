"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader,CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Users,
  DollarSign,
  Shield,
  Flag,
  Heart,
  HelpCircle,
  FileText,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ============================================================================
// POVERTY GUIDELINES DATA (2025 HHS Poverty Guidelines)
// ============================================================================

const POVERTY_GUIDELINES: Record<number, { level100: number; level125: number }> = {
  1: { level100: 16510, level125: 20638 },
  2: { level100: 21150, level125: 26437 },
  3: { level100: 26650, level125: 33312 },
  4: { level100: 32150, level125: 40187 },
  5: { level100: 37650, level125: 47062 },
  6: { level100: 43150, level125: 53937 },
  7: { level100: 48650, level125: 60812 },
  8: { level100: 54150, level125: 67687 },
};

const ADDITIONAL_MEMBER_COST = {
  level100: 5500,
  level125: 6875,
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type SponsorStatus = "citizen" | "greenCard";

interface FormData {
  sponsorStatus: SponsorStatus | null;
  isMilitary: boolean | null;
  isMarried: boolean | null;
  numberOfChildren: number;
  taxDependents: number;
  hasPreviousSponsorship: boolean | null;
  previousSponsoredCount: number;
  currentSponsoredApplicant: boolean;
  currentSponsoredSpouse: boolean;
  currentSponsoredChildren: number;
  annualIncome: number;
  // Household member questions
  hasHouseholdMember: boolean | null;
  householdMemberIncome: number;
  householdMemberRelationship: string;
  // Joint sponsor questions
  hasJointSponsor: boolean | null;
  jointSponsorIncome: number;
}

interface CalculatorResult {
  householdSize: number;
  requiredIncome: number;
  povertyLevel: number;
  ruleApplied: string;
  isEligible: boolean;
  shortfall: number;
}

interface CaseScenario {
  caseNumber: number;
  title: string;
  description: string;
  forms: string[];
  formsDescription: string;
  eligible: boolean;
}

// ============================================================================
// EXCEL ACCOUNTING-STYLE CURRENCY INPUT
// ============================================================================

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

function formatCurrencyWithCommas(value: number): string {
  const parts = value.toFixed(2).split(".");
  const integerPart = parseInt(parts[0]).toLocaleString();
  return `${integerPart}.${parts[1]}`;
}

function CurrencyInput({ value, onChange, placeholder = "0.00", className = "" }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatCurrencyWithCommas(value));
    } else {
      setDisplayValue(value === 0 ? "" : value.toString());
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/[^0-9.]/g, "");

    if (cleanValue === "" || cleanValue === ".") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      const integerPart = parts.slice(0, -1).join("");
      const decimalPart = parts[parts.length - 1];
      const validValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
      setDisplayValue(validValue);
      onChange(parseFloat(validValue) || 0);
      return;
    }

    if (parts.length === 2 && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }

    const validValue = parts.join(".");
    const numericValue = parseFloat(validValue);

    setDisplayValue(validValue);
    onChange(!isNaN(numericValue) ? numericValue : 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(formatCurrencyWithCommas(value));
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value === 0 ? "" : value.toString());
  };

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-2xl pointer-events-none">
        $
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-left placeholder:text-slate-400"
      />
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function AffidavitSupportCalculator() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sponsorStatus: null,
    isMilitary: null,
    isMarried: null,
    numberOfChildren: 0,
    taxDependents: 0,
    hasPreviousSponsorship: null,
    previousSponsoredCount: 0,
    currentSponsoredApplicant: true,
    currentSponsoredSpouse: false,
    currentSponsoredChildren: 0,
    annualIncome: 0,
    hasHouseholdMember: null,
    householdMemberIncome: 0,
    householdMemberRelationship: "",
    hasJointSponsor: null,
    jointSponsorIncome: 0,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [caseScenario, setCaseScenario] = useState<CaseScenario | null>(null);
  const [showHouseholdQuestions, setShowHouseholdQuestions] = useState(false);
  const [showJointSponsorQuestions, setShowJointSponsorQuestions] = useState(false);

  const totalSteps = 8; // Will dynamically adjust

  // Reset result when form data changes
  useEffect(() => {
    setResult(null);
    setCaseScenario(null);
  }, [formData]);

  // ============================================================================
  // CALCULATION FUNCTIONS
  // ============================================================================

  const calculateHouseholdSize = (): number => {
    return (
      1 +
      (formData.isMarried ? 1 : 0) +
      formData.numberOfChildren +
      formData.taxDependents +
      formData.previousSponsoredCount +
      (formData.currentSponsoredApplicant ? 1 : 0) +
      (formData.currentSponsoredSpouse ? 1 : 0) +
      formData.currentSponsoredChildren
    );
  };

  const calculateRequiredIncome = (householdSize: number): number => {
    const isMilitarySpouseOrChild =
      formData.isMilitary && (formData.currentSponsoredApplicant || formData.currentSponsoredSpouse);
    const povertyLevel = isMilitarySpouseOrChild ? 100 : 125;

    let baseIncome = POVERTY_GUIDELINES[8]?.[`level${povertyLevel}`] || 0;
    const additionalCost = ADDITIONAL_MEMBER_COST[`level${povertyLevel}`];

    if (householdSize <= 8 && POVERTY_GUIDELINES[householdSize]) {
      baseIncome = POVERTY_GUIDELINES[householdSize][`level${povertyLevel}`];
      return baseIncome;
    }

    const extraMembers = householdSize - 8;
    return baseIncome + extraMembers * additionalCost;
  };

  const calculateResult = (): CalculatorResult => {
    const householdSize = calculateHouseholdSize();
    const requiredIncome = calculateRequiredIncome(householdSize);

    const isMilitarySpouseOrChild =
      formData.isMilitary && (formData.currentSponsoredApplicant || formData.currentSponsoredSpouse);
    const povertyLevel = isMilitarySpouseOrChild ? 100 : 125;

    const isEligible = formData.annualIncome >= requiredIncome;
    const shortfall = Math.max(0, requiredIncome - formData.annualIncome);

    return {
      householdSize,
      requiredIncome,
      povertyLevel,
      ruleApplied: isMilitarySpouseOrChild
        ? "100% HHS Poverty Guidelines (Military Exception)"
        : "125% HHS Poverty Guidelines",
      isEligible,
      shortfall,
    };
  };

  // ============================================================================
  // CASE DETERMINATION LOGIC
  // ============================================================================

  const determineCaseScenario = (): CaseScenario => {
    const calculationResult = calculateResult();
    const requiredIncome = calculationResult.requiredIncome;
    const sponsorIncome = formData.annualIncome;

    // Calculate combined incomes
    const householdIncome = formData.hasHouseholdMember ? formData.householdMemberIncome : 0;
    const jointSponsorIncome = formData.hasJointSponsor ? formData.jointSponsorIncome : 0;
    const combinedWithHousehold = sponsorIncome + householdIncome;
    const totalCombined = combinedWithHousehold + jointSponsorIncome;

    // Case 1: Primary Sponsor is Eligible Alone
    if (sponsorIncome >= requiredIncome) {
      return {
        caseNumber: 1,
        title: "Case 1: Primary Sponsor is Eligible Alone",
        description: "Your income meets the 125% poverty guideline requirement. You can sponsor without any additional support.",
        forms: ["I-864"],
        formsDescription: "Primary Sponsor: I-864 (Affidavit of Support)",
        eligible: true,
      };
    }

    // Case 2: Primary Sponsor + Household Member
    if (formData.hasHouseholdMember === true && combinedWithHousehold >= requiredIncome) {
      const relationshipText = {
        spouse: "your spouse",
        adult_child: "your adult child",
        dependent: "your dependent relative",
        other: "your household member",
      }[formData.householdMemberRelationship] || "your household member";

      return {
        caseNumber: 2,
        title: "Case 2: Primary Sponsor + Household Member",
        description: `Your combined income ($${sponsorIncome.toLocaleString()} + $${householdIncome.toLocaleString()}) meets the requirement. ${relationshipText} can help you meet the income requirement.`,
        forms: ["I-864", "I-864A"],
        formsDescription: "Primary Sponsor: I-864 | Household Member: I-864A (Contract Between Sponsor and Household Member)",
        eligible: true,
      };
    }

    // Case 3: Primary Sponsor + Joint Sponsor (No household member)
    if (formData.hasHouseholdMember === false && formData.hasJointSponsor === true && jointSponsorIncome >= requiredIncome) {
      return {
        caseNumber: 3,
        title: "Case 3: Primary Sponsor + Joint Sponsor",
        description: `Your income is insufficient, but your joint sponsor independently meets the 125% poverty guideline ($${jointSponsorIncome.toLocaleString()}). Note: You must still file I-864 even with zero income.`,
        forms: ["I-864", "I-864"],
        formsDescription: "Primary Sponsor: I-864 (must file even with zero income) | Joint Sponsor: I-864",
        eligible: true,
      };
    }

    // Case 4: Primary Sponsor + Household Member + Joint Sponsor (All three)
    if (formData.hasHouseholdMember === true && formData.hasJointSponsor === true && totalCombined >= requiredIncome) {
      return {
        caseNumber: 4,
        title: "Case 4: Primary Sponsor + Household Member + Joint Sponsor",
        description: `Your combined income with household member and joint sponsor meets the requirement. This is common when multiple sources of income are needed.`,
        forms: ["I-864", "I-864A", "I-864"],
        formsDescription: "Primary Sponsor: I-864 | Household Member: I-864A | Joint Sponsor: I-864",
        eligible: true,
      };
    }

    // Case 5: Non-Working Sponsor with Working Spouse
    if (formData.hasHouseholdMember === true && formData.householdMemberRelationship === "spouse" && combinedWithHousehold >= requiredIncome) {
      return {
        caseNumber: 5,
        title: "Case 5: Non-Working Sponsor + Working Spouse (Household Member)",
        description: `Your spouse's income ($${householdIncome.toLocaleString()}) combined with yours ($${sponsorIncome.toLocaleString()}) meets the requirement. Your spouse must sign I-864A as a household member.`,
        forms: ["I-864", "I-864A"],
        formsDescription: "Sponsor (non-working): I-864 | Spouse: I-864A (Contract Between Sponsor and Household Member)",
        eligible: true,
      };
    }

    // Case 6: Joint Sponsor + Their Household Member
    if (formData.hasJointSponsor === true && jointSponsorIncome + householdIncome >= requiredIncome) {
      return {
        caseNumber: 6,
        title: "Case 6: Joint Sponsor + Their Household Member",
        description: `Your joint sponsor's income combined with their household member's income meets the requirement.`,
        forms: ["I-864", "I-864", "I-864A"],
        formsDescription: "Primary Sponsor: I-864 | Joint Sponsor: I-864 | Joint Sponsor's Household Member: I-864A",
        eligible: true,
      };
    }

    // Not eligible with current information
    const currentTotal = totalCombined;
    return {
      caseNumber: -1,
      title: "Additional Income or Assets Needed",
      description: `Based on your current inputs, your combined income ($${currentTotal.toLocaleString()}) is below the required amount ($${requiredIncome.toLocaleString()}). You need an additional $${(requiredIncome - currentTotal).toLocaleString()}. Consider: 1) Adding a household member's income, 2) Finding a joint sponsor, or 3) Using assets.`,
      forms: ["I-864", "I-864A", "I-864"],
      formsDescription: "Depending on your situation, you may need: Primary Sponsor I-864, Household Member I-864A, and/or Joint Sponsor I-864",
      eligible: false,
    };
  };

  const handleCalculate = () => {
    const calculationResult = calculateResult();
    setResult(calculationResult);

    // If income is insufficient, show household member question
    if (!calculationResult.isEligible) {
      setCurrentStep(8); // Move to household member question
    } else {
      // Income is sufficient - show case 1 result
      const scenario = determineCaseScenario();
      setCaseScenario(scenario);
      setCurrentStep(11); // Show final results
    }
  };

  const handleHouseholdMemberAnswer = (hasMember: boolean) => {
    setFormData({ ...formData, hasHouseholdMember: hasMember });

    if (hasMember) {
      setCurrentStep(9); // Ask for household member details
    } else {
      // No household member, check if joint sponsor might help
      setCurrentStep(10); // Ask about joint sponsor
    }
  };

  const handleHouseholdMemberSubmit = () => {
    const calculationResult = calculateResult();
    const combinedIncome = formData.annualIncome + formData.householdMemberIncome;

    if (combinedIncome >= calculationResult.requiredIncome) {
      // Household member's income is sufficient
      const scenario = determineCaseScenario();
      setCaseScenario(scenario);
      setCurrentStep(11); // Show results
    } else {
      // Still need more, ask about joint sponsor
      setCurrentStep(10);
    }
  };

  const handleJointSponsorAnswer = (hasSponsor: boolean) => {
    setFormData({ ...formData, hasJointSponsor: hasSponsor });

    if (hasSponsor) {
      setCurrentStep(12); // Ask for joint sponsor income
    } else {
      // No joint sponsor available - show final result
      const scenario = determineCaseScenario();
      setCaseScenario(scenario);
      setCurrentStep(11); // Show results
    }
  };

  const handleJointSponsorSubmit = () => {
    const scenario = determineCaseScenario();
    setCaseScenario(scenario);
    setCurrentStep(11); // Show results
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.sponsorStatus !== null && formData.isMilitary !== null;
      case 2:
        return formData.isMarried !== null;
      case 3:
        return formData.numberOfChildren >= 0;
      case 4:
        return formData.taxDependents >= 0;
      case 5:
        if (formData.hasPreviousSponsorship === false) return true;
        return Boolean(formData.hasPreviousSponsorship) && formData.previousSponsoredCount > 0;
      case 6:
        return true;
      case 7:
        return formData.annualIncome > 0;
      case 8:
        return formData.hasHouseholdMember !== null;
      case 9:
        return formData.householdMemberIncome > 0 && formData.householdMemberRelationship !== "";
      case 10:
        return formData.hasJointSponsor !== null;
      case 11:
        return true;
      case 12:
        return formData.jointSponsorIncome > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep === 7) {
        handleCalculate();
      } else if (currentStep === 9) {
        handleHouseholdMemberSubmit();
      } else if (currentStep === 12) {
        handleJointSponsorSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      sponsorStatus: null,
      isMilitary: null,
      isMarried: null,
      numberOfChildren: 0,
      taxDependents: 0,
      hasPreviousSponsorship: null,
      previousSponsoredCount: 0,
      currentSponsoredApplicant: true,
      currentSponsoredSpouse: false,
      currentSponsoredChildren: 0,
      annualIncome: 0,
      hasHouseholdMember: null,
      householdMemberIncome: 0,
      householdMemberRelationship: "",
      hasJointSponsor: null,
      jointSponsorIncome: 0,
    });
    setResult(null);
    setCaseScenario(null);
  };

  const getProgressValue = (): number => {
    const stepConfig: Record<number, number> = {
      1: 12.5, 2: 25, 3: 37.5, 4: 50, 5: 62.5, 6: 75, 7: 87.5, 8: 90, 9: 93, 10: 95, 11: 100, 12: 98
    };
    return stepConfig[currentStep] || (currentStep / 11) * 100;
  };

  // ============================================================================
  // STEP RENDERERS
  // ============================================================================

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Sponsor Information</h3>
        <p className="text-slate-600 mt-2">Tell us about your status in the US</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Are you a US Citizen or Green Card Holder?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, sponsorStatus: "citizen" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.sponsorStatus === "citizen"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold text-slate-900">US Citizen</p>
              </div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, sponsorStatus: "greenCard" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.sponsorStatus === "greenCard"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold text-slate-900">Green Card Holder</p>
              </div>
            </button>
          </div>
        </div>

        {formData.sponsorStatus && (
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Are you an active-duty US Military member?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, isMilitary: true })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.isMilitary === true
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <div className="text-center">
                  <Flag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-slate-900">Yes</p>
                  <p className="text-xs text-slate-500 mt-1">Active Duty</p>
                </div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, isMilitary: false })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.isMilitary === false
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-slate-900">No</p>
                  <p className="text-xs text-slate-500 mt-1">Civilian</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Marital Status</h3>
        <p className="text-slate-600 mt-2">Are you married?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setFormData({ ...formData, isMarried: true })}
          className={`p-6 rounded-xl border-2 transition-all ${
            formData.isMarried === true
              ? "border-purple-500 bg-purple-50"
              : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
          }`}
        >
          <div className="text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <p className="font-semibold text-slate-900">Yes</p>
            <p className="text-sm text-slate-500 mt-1">I am married</p>
          </div>
        </button>
        <button
          onClick={() => setFormData({ ...formData, isMarried: false })}
          className={`p-6 rounded-xl border-2 transition-all ${
            formData.isMarried === false
              ? "border-purple-500 bg-purple-50"
              : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
          }`}
        >
          <div className="text-center">
            <User className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <p className="font-semibold text-slate-900">No</p>
            <p className="text-sm text-slate-500 mt-1">I am single</p>
          </div>
        </button>
      </div>

      {formData.isMarried && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Note:</span> Your spouse will be counted as 1 person in your household size.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your Children</h3>
        <p className="text-slate-600 mt-2">How many unmarried children do you have?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Number of children (under 21)
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData({ ...formData, numberOfChildren: Math.max(0, formData.numberOfChildren - 1) })}
              className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                min="0"
                max="50"
                value={formData.numberOfChildren}
                onChange={(e) => setFormData({ ...formData, numberOfChildren: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-24 text-center text-3xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
              />
            </div>
            <button
              onClick={() => setFormData({ ...formData, numberOfChildren: formData.numberOfChildren + 1 })}
              className="w-12 h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xl transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-3 text-center">
            {formData.numberOfChildren === 1
              ? "1 child will be added to household size"
              : `${formData.numberOfChildren} children will be added to household size`}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Tax Dependents</h3>
        <p className="text-slate-600 mt-2">How many other dependents do you claim on your tax return?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Additional tax dependents
          </label>
          <p className="text-sm text-slate-600 mb-4">
            Include parents, adult children, or other relatives you claim as dependents on your tax return
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData({ ...formData, taxDependents: Math.max(0, formData.taxDependents - 1) })}
              className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                min="0"
                max="50"
                value={formData.taxDependents}
                onChange={(e) => setFormData({ ...formData, taxDependents: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-24 text-center text-3xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
              />
            </div>
            <button
              onClick={() => setFormData({ ...formData, taxDependents: formData.taxDependents + 1 })}
              className="w-12 h-12 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xl transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Previous Sponsorships</h3>
        <p className="text-slate-600 mt-2">Have you sponsored immigrants before?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Have you previously sponsored anyone who has not yet become a U.S. citizen?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, hasPreviousSponsorship: true })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.hasPreviousSponsorship === true
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 hover:border-red-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="font-semibold text-slate-900">Yes</p>
              </div>
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, hasPreviousSponsorship: false, previousSponsoredCount: 0 });
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.hasPreviousSponsorship === false
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 hover:border-red-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="font-semibold text-slate-900">No</p>
              </div>
            </button>
          </div>
        </div>

        {formData.hasPreviousSponsorship && (
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              How many people have you previously sponsored?
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setFormData({ ...formData, previousSponsoredCount: Math.max(1, formData.previousSponsoredCount - 1) })
                }
                className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl transition-colors"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.previousSponsoredCount}
                  onChange={(e) =>
                    setFormData({ ...formData, previousSponsoredCount: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-24 text-center text-3xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
                />
              </div>
              <button
                onClick={() => setFormData({ ...formData, previousSponsoredCount: formData.previousSponsoredCount + 1 })}
                className="w-12 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Current Sponsorship</h3>
        <p className="text-slate-600 mt-2">Who are you sponsoring now?</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-semibold text-indigo-900">Main Applicant</p>
              <p className="text-sm text-indigo-600">Always included in household size</p>
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-300">
            <input
              type="checkbox"
              checked={formData.currentSponsoredSpouse}
              onChange={(e) => setFormData({ ...formData, currentSponsoredSpouse: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <p className="font-semibold text-slate-900">Sponsor applicant&apos;s spouse</p>
              <p className="text-sm text-slate-500">Add 1 person to household size</p>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            How many children of the applicant are you sponsoring?
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData({ ...formData, currentSponsoredChildren: Math.max(0, formData.currentSponsoredChildren - 1) })}
              className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                min="0"
                max="50"
                value={formData.currentSponsoredChildren}
                onChange={(e) => setFormData({ ...formData, currentSponsoredChildren: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-24 text-center text-3xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
              />
            </div>
            <button
              onClick={() => setFormData({ ...formData, currentSponsoredChildren: formData.currentSponsoredChildren + 1 })}
              className="w-12 h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your Annual Income</h3>
        <p className="text-slate-600 mt-2">Enter your total annual household income</p>
      </div>

      <CurrencyInput
        value={formData.annualIncome}
        onChange={(value) => setFormData({ ...formData, annualIncome: value })}
        placeholder="0.00"
      />
      <p className="text-sm text-slate-500 mt-3 text-center">
        Include salary, wages, bonuses, and other sources of income
      </p>
    </div>
  );

  // Step 8: Household Member Question (only shown if income is insufficient)
  const renderStep8 = () => {
    if (result && result.isEligible) {
      return renderStep11(); // Show results directly if eligible
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Household Member</h3>
          <p className="text-slate-600 mt-2">
            Your income is below the required amount. Do you have a household member who can help?
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
          <p className="text-sm text-amber-900 mb-2">
            <span className="font-semibold">Shortfall:</span> You need ${result?.shortfall.toLocaleString()} more.
          </p>
          <p className="text-sm text-amber-800">
            A household member (spouse, adult child, or dependent relative) can combine their income with yours.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
          <p className="text-sm text-blue-900 mb-2">
            <span className="font-semibold">Who can be a household member?</span>
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Spouse (if living together)</li>
            <li>• Adult children (18+, living with sponsor)</li>
            <li>• Any relative claimed as dependent on tax return</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleHouseholdMemberAnswer(true)}
            className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-all"
          >
            <div className="text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
              <p className="font-semibold text-slate-900">Yes</p>
              <p className="text-sm text-slate-500 mt-1">I have someone</p>
            </div>
          </button>
          <button
            onClick={() => handleHouseholdMemberAnswer(false)}
            className="p-6 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <div className="text-center">
              <User className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-slate-900">No</p>
              <p className="text-sm text-slate-500 mt-1">Just me</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Step 9: Household Member Details
  const renderStep9 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Household Member Details</h3>
        <p className="text-slate-600 mt-2">Tell us about your household member</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Relationship to you
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, householdMemberRelationship: "spouse" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.householdMemberRelationship === "spouse"
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-violet-600" />
                <p className="font-semibold text-slate-900">Spouse</p>
              </div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, householdMemberRelationship: "adult_child" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.householdMemberRelationship === "adult_child"
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-violet-600" />
                <p className="font-semibold text-slate-900">Adult Child</p>
              </div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, householdMemberRelationship: "dependent" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.householdMemberRelationship === "dependent"
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-violet-600" />
                <p className="font-semibold text-slate-900">Dependent</p>
              </div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, householdMemberRelationship: "other" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.householdMemberRelationship === "other"
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-violet-600" />
                <p className="font-semibold text-slate-900">Other Relative</p>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Their Annual Income
          </label>
          <CurrencyInput
            value={formData.householdMemberIncome}
            onChange={(value) => setFormData({ ...formData, householdMemberIncome: value })}
            placeholder="0.00"
          />
          <p className="text-sm text-slate-500 mt-3 text-center">
            Their individual annual income from all sources
          </p>
        </div>
      </div>
    </div>
  );

  // Step 10: Joint Sponsor Question
  const renderStep10 = () => {
    const calculationResult = calculateResult();
    const combinedIncome = formData.annualIncome + formData.householdMemberIncome;
    const remainingShortfall = Math.max(0, calculationResult.requiredIncome - combinedIncome);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Joint Sponsor</h3>
          <p className="text-slate-600 mt-2">
            Your combined income is still below the required amount. Do you have an outside joint sponsor?
          </p>
        </div>

        <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 mb-6">
          <p className="text-sm text-rose-900 mb-2">
            <span className="font-semibold">Remaining Shortfall:</span> You need ${remainingShortfall.toLocaleString()} more.
          </p>
          <p className="text-sm text-rose-800">
            A joint sponsor (outside third person) can help meet the requirement.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
          <p className="text-sm text-blue-900 mb-2">
            <span className="font-semibold">Joint Sponsor Requirements:</span>
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Must be U.S. Citizen or Green Card holder</li>
            <li>• Must independently meet 125% poverty line</li>
            <li>• Does NOT need to be related to you or the immigrant</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleJointSponsorAnswer(true)}
            className="p-6 rounded-xl border-2 border-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
          >
            <div className="text-center">
              <UserPlus className="w-10 h-10 mx-auto mb-3 text-rose-600" />
              <p className="font-semibold text-slate-900">Yes</p>
              <p className="text-sm text-slate-500 mt-1">I have one</p>
            </div>
          </button>
          <button
            onClick={() => handleJointSponsorAnswer(false)}
            className="p-6 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <div className="text-center">
              <User className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-slate-900">No</p>
              <p className="text-sm text-slate-500 mt-1">None available</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Step 11: Final Results
  const renderStep11 = () => {
    const calculationResult = result || calculateResult();
    const scenario = caseScenario || determineCaseScenario();

    // Calculate combined income
    let combinedIncome = formData.annualIncome;
    if (formData.hasHouseholdMember) {
      combinedIncome += formData.householdMemberIncome;
    }
    if (formData.hasJointSponsor) {
      combinedIncome += formData.jointSponsorIncome;
    }

    return (
      <div className="space-y-6">
        {/* Case Scenario Card */}
        <Card className={`border-2 ${
          scenario.eligible
            ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100"
            : "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              {scenario.eligible ? (
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-slate-900">{scenario.title}</h4>
                <p className="text-sm text-slate-700 mt-1">{scenario.description}</p>
              </div>
            </div>

            <div className="p-4 bg-white/60 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Forms Required:
              </p>
              <p className="text-sm text-slate-700">{scenario.formsDescription}</p>
            </div>
          </CardContent>
        </Card>

        {/* Income Summary Card */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Income Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Your Income:</span>
                <span className="font-semibold">${formData.annualIncome.toLocaleString()}</span>
              </div>
              {formData.hasHouseholdMember && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Household Member:
                  </span>
                  <span className="font-semibold">+${formData.householdMemberIncome.toLocaleString()}</span>
                </div>
              )}
              {formData.hasJointSponsor && (
                <div className="flex justify-between items-center text-rose-600">
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Joint Sponsor:
                  </span>
                  <span className="font-semibold">+${formData.jointSponsorIncome.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Combined Income:</span>
                <span className="font-bold text-xl">${combinedIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Required Income:</span>
                <span>${calculationResult.requiredIncome.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card
          className={`border-2 ${
            scenario.eligible
              ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100"
              : "border-red-500 bg-gradient-to-br from-red-50 to-red-100"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {scenario.eligible ? (
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    {scenario.eligible ? "Eligible!" : "Not Eligible"}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {scenario.eligible
                      ? "Your combined income meets the requirement"
                      : "Additional income or assets needed"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Household Size */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Household Size</p>
                  <p className="text-2xl font-bold text-slate-900">{calculationResult.householdSize} persons</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Income */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Required Income</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${calculationResult.requiredIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-900">Income Progress</p>
                <p className="text-sm text-slate-600">
                  ${combinedIncome.toLocaleString()} / ${calculationResult.requiredIncome.toLocaleString()}
                </p>
              </div>
              <Progress
                value={Math.min((combinedIncome / calculationResult.requiredIncome) * 100, 100)}
                className="h-4"
              />
            </div>
            <p className="text-sm text-slate-600">{calculationResult.ruleApplied}</p>
          </CardContent>
        </Card>

        {/* Shortfall Warning */}
        {!scenario.eligible && calculationResult.shortfall > 0 && (
          <Card className="border-2 border-amber-300 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Additional Support Needed</p>
                  <p className="text-sm text-amber-800">
                    You need an additional{" "}
                    <span className="font-bold">${calculationResult.shortfall.toLocaleString()}</span> in annual income
                    to meet the requirement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Step 12: Joint Sponsor Income
  const renderStep12 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Joint Sponsor Income</h3>
        <p className="text-slate-600 mt-2">Enter joint sponsor's annual income</p>
      </div>

      <CurrencyInput
        value={formData.jointSponsorIncome}
        onChange={(value) => setFormData({ ...formData, jointSponsorIncome: value })}
        placeholder="0.00"
      />
      <p className="text-sm text-slate-500 mt-3 text-center">
        Joint sponsor must independently meet the 125% poverty guideline
      </p>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Sponsor Information";
      case 2: return "Marital Status";
      case 3: return "Your Children";
      case 4: return "Tax Dependents";
      case 5: return "Previous Sponsorships";
      case 6: return "Current Sponsorship";
      case 7: return "Your Income";
      case 8: return "Household Member";
      case 9: return "Household Details";
      case 10: return "Joint Sponsor";
      case 11: return "Your Results";
      case 12: return "Joint Sponsor Income";
      default: return `Step ${currentStep}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl border-slate-200 hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Affidavit of Support Calculator</h1>
            <p className="text-sm text-slate-600">Step {currentStep}: {getStepTitle()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardDescription className="text-base">
              {currentStep === 11
                ? "Review your results and check your eligibility"
                : "Complete all fields to proceed to the next step"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="min-h-[400px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderStep7()}
              {currentStep === 8 && renderStep8()}
              {currentStep === 9 && renderStep9()}
              {currentStep === 10 && renderStep10()}
              {currentStep === 11 && renderStep11()}
              {currentStep === 12 && renderStep12()}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="rounded-xl border-slate-200 hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep === 11 && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="rounded-xl border-slate-200 hover:bg-slate-100"
                  >
                    Start Over
                  </Button>
                )}
              </div>

              {currentStep <= 12 && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  {currentStep === 7 ? "Check Eligibility" : currentStep === 12 ? "See Results" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Based on 2025 HHS Poverty Guidelines. For official purposes, consult USCIS Form I-864.
          </p>
        </div>
      </div>
    </div>
  );
}
