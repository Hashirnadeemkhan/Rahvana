"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  // ChevronLeft,
  ChevronRight,
  User,
  // Users,
  Heart,
  // Calendar,
  Flag,
  Globe,
  MapPin,
  // AlertCircle,
  RefreshCw,
  AlertTriangle,
  LucideIcon,
  X,
} from "lucide-react";
import { visaCriteria } from "./criteria-data";

type VisaSuggestion = {
  code: string;
  title: string;
  description: string;
};

type FutureAnswers = {
  // Section 1: Petitioner / Sponsor Details
  petitionerStatus?: "US_CITIZEN" | "LPR" | "NONE";
  statusOrigin?: "NATURALIZED" | "BIRTH" | "GREEN_CARD";
  petitionerAgeGroup?: "UNDER_21" | "OVER_21";

  // Section 2: Relationship
  relationship?: "SPOUSE" | "PARENT" | "CHILD" | "SIBLING" | "FIANCE" | "OTHER";
  legalStatus?: "MARRIAGE_REGISTERED" | "BIOLOGICAL" | "ADOPTIVE" | "STEP";

  // Section 3: Applicant Details
  applicantAgeGroup?: "UNDER_21" | "OVER_21";
  applicantMaritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED_WIDOWED";
  applicantLocation?: "OUTSIDE_US" | "INSIDE_US";

  // Section 4: Specific Checks
  // isBiologicalParent?: "YES" | "NO"; // Removed in favor of legalStatus
  isLegallyMarried?: "YES" | "NO";
  marriageDuration?: "LESS_THAN_2" | "MORE_THAN_2";

  // Section 5: Exclusion / Future
  violationHistory?: "YES" | "NO" | "NOT_SURE";
  intent?: "PERMANENT" | "TEMPORARY";
  sponsorBase?: "FAMILY" | "EMPLOYMENT" | "INVESTMENT" | "HUMANITARIAN";
};

export default function FutureQuestions() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<FutureAnswers>({});
  const [selectedVisaCode, setSelectedVisaCode] = useState<string | null>(null);

  const totalSteps = 5; // 4 Sections + 1 Result
  const progress = (step / totalSteps) * 100;

  const next = () => setStep(Math.min(step + 1, totalSteps));
  const back = () => setStep(Math.max(step - 1, 1));

  const setAnswer = <K extends keyof FutureAnswers>(
    key: K,
    value: FutureAnswers[K]
  ) => {
    setAnswers({ ...answers, [key]: value });
  };

  const fadeIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  };

  // Helper component for option buttons
  const OptionButton = ({
    label,
    onClick,
    isSelected,
    icon: Icon,
  }: {
    label: string;
    onClick: () => void;
    isSelected: boolean;
    icon?: LucideIcon;
  }) => (
    <button
      onClick={onClick}
      className="group flex items-center p-4 border-2 border-transparent bg-gray-50 hover:bg-primary/10 hover:border-primary/50 rounded-xl transition-all duration-200 text-left w-full mb-3"
    >
      <div
        className={`p-3 rounded-full mr-4 transition-colors ${
          isSelected
            ? "bg-primary text-white"
            : "bg-white text-gray-400 group-hover:bg-primary/50 group-hover:text-primary/70"
        }`}
      >
        {Icon ? (
          <Icon
            size={20}
            className={isSelected ? "opacity-100" : "opacity-70"}
          />
        ) : (
          <CheckCircle
            size={20}
            className={
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }
          />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{label}</h3>
      </div>
    </button>
  );

  const getVisaSuggestions = (): VisaSuggestion[] => {
    const v: VisaSuggestion[] = [];

    const {
      petitionerStatus,
      petitionerAgeGroup,
      relationship,
      isLegallyMarried,
      marriageDuration,
      applicantAgeGroup,
      applicantMaritalStatus,
      sponsorBase,
      intent,
    } = answers;

    /* =========================
     IMMEDIATE RELATIVE VISAS
     ========================= */

    // IR-1 / CR-1 (Spouse of US Citizen)
    if (
      petitionerStatus === "US_CITIZEN" &&
      relationship === "SPOUSE" &&
      isLegallyMarried === "YES"
    ) {
      if (marriageDuration === "MORE_THAN_2") {
        v.push({
          code: "IR-1",
          title: "Immediate Relative – Spouse of US Citizen",
          description:
            "For spouses of US citizens married for 2 years or more.",
        });
      } else if (marriageDuration === "LESS_THAN_2") {
        v.push({
          code: "CR-1",
          title: "Conditional Resident – Spouse of US Citizen",
          description:
            "For spouses of US citizens married for less than 2 years.",
        });
      }
    }

    // IR-5 (Parent of US Citizen)
    if (
      petitionerStatus === "US_CITIZEN" &&
      petitionerAgeGroup === "OVER_21" &&
      relationship === "PARENT" &&
      relationship === "PARENT" &&
      (answers.legalStatus === "BIOLOGICAL" ||
        answers.legalStatus === "ADOPTIVE") // ask about the step relationship // Check legalStatus instead of isBiologicalParent
    ) {
      v.push({
        code: "IR-5",
        title: "Immediate Relative – Parent of US Citizen",
        description: "For parents of US citizens who are 21 years or older.",
      });
    }

    /* =========================
     FAMILY PREFERENCE VISAS
     ========================= */

    if (petitionerStatus === "US_CITIZEN" || petitionerStatus === "LPR") {
      if (relationship === "CHILD") {
        if (
          applicantAgeGroup === "UNDER_21" &&
          applicantMaritalStatus === "SINGLE"
        ) {
          v.push({
            code: petitionerStatus === "US_CITIZEN" ? "IR-2" : "F2A",
            title: "Child of Sponsor",
            description:
              "For unmarried children under 21 of US citizens or Green Card holders.",
          });
        } else {
          v.push({
            code: petitionerStatus === "US_CITIZEN" ? "F1" : "F2B",
            title: "Adult Unmarried Child of Sponsor",
            description: "For unmarried sons and daughters aged 21 or older.",
          });
        }
      }

      if (relationship === "SIBLING" && petitionerStatus === "US_CITIZEN") {
        v.push({
          code: "F4",
          title: "Sibling of US Citizen",
          description:
            "For brothers and sisters of US citizens aged 21 or older.",
        });
      }
    }

    /* =========================
     K VISAS
     ========================= */

    if (
      petitionerStatus === "US_CITIZEN" &&
      relationship === "FIANCE" &&
      intent === "PERMANENT"
    ) {
      v.push({
        code: "K-1",
        title: "Fiancé(e) Visa",
        description:
          "For fiancé(e)s of US citizens intending to marry in the US.",
      });
    }

    /* =========================
     EMPLOYMENT VISAS
     ========================= */

    if (sponsorBase === "EMPLOYMENT") {
      v.push(
        {
          code: "EB-1",
          title: "Employment-Based First Preference",
          description:
            "For individuals with extraordinary ability or multinational executives.",
        },
        {
          code: "EB-2",
          title: "Employment-Based Second Preference",
          description:
            "For professionals with advanced degrees or exceptional ability.",
        },
        {
          code: "EB-3",
          title: "Employment-Based Third Preference",
          description: "For skilled workers, professionals, and other workers.",
        }
      );
    }

    /* =========================
     INVESTMENT
     ========================= */

    if (sponsorBase === "INVESTMENT") {
      v.push({
        code: "EB-5",
        title: "Immigrant Investor Visa",
        description:
          "For investors who invest in US businesses and create jobs.",
      });
    }

    /* =========================
     HUMANITARIAN
     ========================= */

    if (sponsorBase === "HUMANITARIAN") {
      v.push({
        code: "Humanitarian",
        title: "Humanitarian-Based Immigration",
        description:
          "Includes asylum, refugee, VAWA, and special immigrant categories.",
      });
    }

    /* =========================
     NON-IMMIGRANT
     ========================= */

    if (intent === "TEMPORARY") {
      v.push(
        {
          code: "B1/B2",
          title: "Visitor Visa",
          description: "For temporary business or tourism visits.",
        },
        {
          code: "F-1",
          title: "Student Visa",
          description: "For academic study in the United States.",
        },
        {
          code: "M-1",
          title: "Student Visa",
          description: "For vocational studies in the United States.",
        },
        {
          code: "H-1B",
          title: "Specialty Occupation Work Visa",
          description: "For professionals in specialty occupations.",
        }
      );
    }

    /* =========================
     OTHERS
     ========================= */
    if (intent === "TEMPORARY" && sponsorBase === "HUMANITARIAN") {
      v.push({
        code: "J-1",
        title: "Exchange Visitor Visa",
        description:
          "For participants in approved cultural or educational exchange programs.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "EMPLOYMENT") {
      v.push({
        code: "L-1",
        title: "Intra-Company Transfer Visa",
        description:
          "For employees transferring to a US branch of the same company.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "EMPLOYMENT") {
      v.push({
        code: "O-1",
        title: "Extraordinary Ability Visa",
        description:
          "For individuals with extraordinary ability in science, arts, education, business, or athletics.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "HUMANITARIAN") {
      v.push({
        code: "R-1",
        title: "Religious Worker Visa",
        description:
          "For individuals working in a religious capacity for a US religious organization.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "EMPLOYMENT") {
      v.push({
        code: "P",
        title: "Athlete or Artist Visa",
        description:
          "For internationally recognized athletes or entertainment groups.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "HUMANITARIAN") {
      v.push({
        code: "Q",
        title: "Cultural Exchange Visa",
        description:
          "For participants in international cultural exchange programs.",
      });
    }

    if (intent === "TEMPORARY" && sponsorBase === "INVESTMENT") {
      v.push({
        code: "E-1 / E-2",
        title: "Treaty Trader / Investor Visa",
        description:
          "For nationals of treaty countries engaged in substantial trade or investment with the US.",
      });
    }

    /* =========================
     DV LOTTERY
     ========================= */

    // v.push({
    //   code: "DV",
    //   title: "Diversity Visa Lottery",
    //   description: "A lottery-based immigrant visa for eligible countries.",
    // });

    return v;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Header / Progress */}
        <div className="p-8 pb-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold bg-clip-text text-black">
              Immigration Questionnaire
            </h1>
            <span className="text-sm font-semibold text-gray-400">
              Section {step} of {totalSteps}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* SECTION 1: Petitioner Details */}
            {step === 1 && (
              <motion.div key="step1" {...fadeIn} className="space-y-8">
                <div className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Flag size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Petitioner Details
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Tell us about your status in the U.S.
                  </p>
                </div>

                {/* Q1: Status */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. Are you currently a:
                  </p>
                  {[
                    { val: "US_CITIZEN", label: "US Citizen" },
                    {
                      val: "LPR",
                      label: "US Permanent Resident (Green Card holder)",
                    },
                    { val: "NONE", label: "None of the above" },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.val}
                      label={opt.label}
                      isSelected={answers.petitionerStatus === opt.val}
                      onClick={() =>
                        setAnswer(
                          "petitionerStatus",
                          opt.val as FutureAnswers["petitionerStatus"]
                        )
                      }
                    />
                  ))}
                </div>

                {/* Q2: Status Origin (Only if not NONE) */}
                {answers.petitionerStatus &&
                  answers.petitionerStatus !== "NONE" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <p className="font-semibold text-gray-700">
                        Q. How did you get your US status?
                      </p>
                      {[
                        { val: "NATURALIZED", label: "Naturalized citizen" },
                        { val: "BIRTH", label: "By birth" },
                        {
                          val: "GREEN_CARD",
                          label: "Green Card (family / employment / asylum)",
                        },
                      ].map((opt) => (
                        <OptionButton
                          key={opt.val}
                          label={opt.label}
                          isSelected={answers.statusOrigin === opt.val}
                          onClick={() =>
                            setAnswer(
                              "statusOrigin",
                              opt.val as FutureAnswers["statusOrigin"]
                            )
                          }
                        />
                      ))}
                    </motion.div>
                  )}

                {/* Q3: Age */}
                {answers.statusOrigin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className="font-semibold text-gray-700">
                      Q. What is your current age?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setAnswer("petitionerAgeGroup", "UNDER_21")
                        }
                        className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                          answers.petitionerAgeGroup === "UNDER_21"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Under 21
                      </button>
                      <button
                        onClick={() =>
                          setAnswer("petitionerAgeGroup", "OVER_21")
                        }
                        className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                          answers.petitionerAgeGroup === "OVER_21"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        21 or older
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={next}
                    disabled={
                      !answers.petitionerAgeGroup ||
                      answers.petitionerAgeGroup === "UNDER_21"
                    }
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Next Section <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 2: Relationship */}
            {step === 2 && (
              <motion.div key="step2" {...fadeIn} className="space-y-8">
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                    <Heart size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Relationship
                  </h2>
                  <p className="text-gray-500 mt-2">Who are you sponsoring?</p>
                </div>

                {/* Q4 */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. What is your relationship with the person you want to
                    sponsor? (attempt if applicable)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "SPOUSE",
                      "PARENT",
                      "CHILD",
                      "SIBLING",
                      "FIANCE",
                      "OTHER",
                    ].map((rel) => (
                      <button
                        key={rel}
                        onClick={() =>
                          setAnswer(
                            "relationship",
                            rel as FutureAnswers["relationship"]
                          )
                        }
                        className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                          answers.relationship === rel
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {rel.charAt(0) +
                          rel.slice(1).toLowerCase().replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q5 */}
                {["PARENT", "CHILD", "SIBLING"].includes(
                  answers.relationship || ""
                ) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className="font-semibold text-gray-700">
                      Q. What is the nature of this relationship?
                    </p>
                    {[
                      { val: "BIOLOGICAL", label: "Biological" },
                      { val: "ADOPTIVE", label: "Adoptive" },
                      { val: "STEP", label: "Stepflow" },
                    ].map((opt) => (
                      <OptionButton
                        key={opt.val}
                        label={opt.label}
                        isSelected={answers.legalStatus === opt.val}
                        onClick={() =>
                          setAnswer(
                            "legalStatus",
                            opt.val as FutureAnswers["legalStatus"]
                          )
                        }
                      />
                    ))}
                  </motion.div>
                )}

                {answers.relationship === "SPOUSE" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <p className="font-semibold text-gray-700">
                        Q. Is the applicant your legally married spouse?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setAnswer("isLegallyMarried", "YES")}
                          className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                            answers.isLegallyMarried === "YES"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-100 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setAnswer("isLegallyMarried", "NO")}
                          className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                            answers.isLegallyMarried === "NO"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-100 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-semibold text-gray-700">
                        Q. How long have you been married?
                      </p>
                      <div className="space-y-2">
                        <OptionButton
                          label="Less than 2 years"
                          isSelected={
                            answers.marriageDuration === "LESS_THAN_2"
                          }
                          onClick={() =>
                            setAnswer("marriageDuration", "LESS_THAN_2")
                          }
                        />
                        <OptionButton
                          label="2 years or more"
                          isSelected={
                            answers.marriageDuration === "MORE_THAN_2"
                          }
                          onClick={() =>
                            setAnswer("marriageDuration", "MORE_THAN_2")
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={back}
                    className="text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    disabled={
                      (!answers.legalStatus &&
                        answers.relationship === "SPOUSE" &&
                        (!answers.isLegallyMarried ||
                          !answers.marriageDuration)) ||
                      (!answers.legalStatus &&
                        (answers.relationship === "PARENT" ||
                          answers.relationship === "SIBLING" ||
                          answers.relationship === "CHILD") &&
                        !answers.legalStatus)
                    }
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Next Section <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 3: Applicant Details */}
            {step === 3 && (
              <motion.div key="step3" {...fadeIn} className="space-y-8">
                <div className="text-center">
                  <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-600">
                    <User size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Applicant Details
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Information about the beneficiary.
                  </p>
                </div>

                {/* Q6 Age */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. What is the applicant’s age?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAnswer("applicantAgeGroup", "UNDER_21")}
                      className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                        answers.applicantAgeGroup === "UNDER_21"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-100 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Under 21
                    </button>
                    <button
                      onClick={() => setAnswer("applicantAgeGroup", "OVER_21")}
                      className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                        answers.applicantAgeGroup === "OVER_21"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-100 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      21 or older
                    </button>
                  </div>
                </div>

                {/* Q7 Marital Status */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. What is the applicant’s marital status?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {["SINGLE", "MARRIED", "DIVORCED_WIDOWED"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setAnswer(
                            "applicantMaritalStatus",
                            status as FutureAnswers["applicantMaritalStatus"]
                          )
                        }
                        className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                          answers.applicantMaritalStatus === status
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {status.charAt(0) +
                          status.slice(1).toLowerCase().replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q8 Location */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. Where is the applicant currently located?
                  </p>
                  <div className="space-y-2">
                    <OptionButton
                      label="Outside the US"
                      isSelected={answers.applicantLocation === "OUTSIDE_US"}
                      onClick={() =>
                        setAnswer("applicantLocation", "OUTSIDE_US")
                      }
                      icon={Globe}
                    />
                    <OptionButton
                      label="Inside the US"
                      isSelected={answers.applicantLocation === "INSIDE_US"}
                      onClick={() =>
                        setAnswer("applicantLocation", "INSIDE_US")
                      }
                      icon={MapPin}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={back}
                    className="text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!answers.applicantLocation} // Last Q answered
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Next Section <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 4: Exclusion/Future */}
            {step === 4 && (
              <motion.div key="step4" {...fadeIn} className="space-y-8">
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
                    <AlertTriangle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Additional Information
                  </h2>
                  <p className="text-gray-500 mt-2">Final details.</p>
                </div>

                {/* Q12 Violation */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. Has the applicant ever violated US immigration laws?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {["YES", "NO", "NOT_SURE"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setAnswer(
                            "violationHistory",
                            opt as FutureAnswers["violationHistory"]
                          )
                        }
                        className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                          answers.violationHistory === opt
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q13 Intent */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. Is the applicant seeking permanent residence or temporary
                    stay?
                  </p>
                  <div className="space-y-2">
                    <OptionButton
                      label="Permanent (Green Card)"
                      isSelected={answers.intent === "PERMANENT"}
                      onClick={() => setAnswer("intent", "PERMANENT")}
                    />
                    <OptionButton
                      label="Temporary (Visit / Study / Work)"
                      isSelected={answers.intent === "TEMPORARY"}
                      onClick={() => setAnswer("intent", "TEMPORARY")}
                    />
                  </div>
                </div>

                {/* Q14 Sponsor Base */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">
                    Q. Are you planning to sponsor based on:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["FAMILY", "EMPLOYMENT", "INVESTMENT", "HUMANITARIAN"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            setAnswer(
                              "sponsorBase",
                              opt as FutureAnswers["sponsorBase"]
                            )
                          }
                          className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                            answers.sponsorBase === opt
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-100 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {opt.charAt(0) + opt.slice(1).toLowerCase()}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={back}
                    className="text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    // disabled={!answers.sponsorBase}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Finish <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: RESULT */}
            {step === 5 && (
              <motion.div key="step5" {...fadeIn} className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getVisaSuggestions().length > 0
                      ? "Visa Categories You May Be Eligible For"
                      : "You are not eligible for any visa category"}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Based on the information you provided
                  </p>
                </div>

                <div className="space-y-4">
                  {getVisaSuggestions().map((visa) => (
                    <div
                      key={visa.code}
                      onClick={() => setSelectedVisaCode(visa.code)}
                      className="p-5 border rounded-xl bg-gray-50 hover:border-primary transition cursor-pointer hover:shadow-md"
                    >
                      <h3 className="font-semibold text-primary">
                        {visa.code} – {visa.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {visa.description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 text-center">
                  ⚠️ This tool provides guidance only and does not guarantee
                  visa approval.
                </p>

                <div className="pt-4 border-t text-center">
                  <button
                    onClick={() => {
                      setStep(1);
                      setAnswers({});
                    }}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium"
                  >
                    <RefreshCw size={16} /> Start Over
                  </button>
                </div>
              </motion.div>
            )}

            {/* {step === 6 && (
              <motion.div
                key="step6"
                {...fadeIn}
                className="space-y-8 text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={48} />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Form Completed
                  </h2>
                  <p className="text-gray-500">
                    Thank you for providing the details.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl text-left text-sm text-gray-600 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">
                    {JSON.stringify(answers, null, 2)}
                  </pre>
                </div>

                <div className="pt-8 border-t">
                  <button
                    onClick={() => {
                      setStep(1);
                      setAnswers({});
                    }}
                    className="flex items-center gap-2 mx-auto text-gray-500 hover:text-indigo-600 font-medium transition"
                  >
                    <RefreshCw size={18} /> Start Over
                  </button>
                </div>
              </motion.div>
            )} */}
          </AnimatePresence>
        </div>
      </div>

      {/* Criteria Modal */}
      <AnimatePresence>
        {selectedVisaCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVisaCode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {visaCriteria[selectedVisaCode]?.title ||
                      selectedVisaCode + " Criteria"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Eligibility Requirements
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVisaCode(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {visaCriteria[selectedVisaCode] ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {visaCriteria[selectedVisaCode].description}
                    </p>
                    <ul className="space-y-3">
                      {visaCriteria[selectedVisaCode].criteria.map(
                        (item, idx) => (
                          <li key={idx} className="flex gap-3 text-sm">
                            <CheckCircle
                              size={18}
                              className="text-green-500 shrink-0 mt-0.5"
                            />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p>
                      No specific criteria details available for this visa
                      category yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50/50">
                <button
                  onClick={() => setSelectedVisaCode(null)}
                  className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Immigrant
// IR-1, CR-1, IR-2, IR-5
// F1, F2A, F2B, F4
// EB-1 → EB-5
// DV Lottery

// Non-Immigrant
// B-1 / B-2
// F-1
// H-1B
// L-1
// O-1
// R-1
// J-1
// P
// Q
// E-1 / E-2
// K-1
