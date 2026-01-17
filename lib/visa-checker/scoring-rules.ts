import { RiskSeverity, FlagCode } from "./types";
import {
  MAX_TOTAL_SCORE,
  MIN_TOTAL_SCORE,
  COMPONENT_WEIGHTS,
  RISK_POINTS_DEDUCTION,
  INCOME_THRESHOLDS,
  RELATIONSHIP_THRESHOLDS,
} from "./scoring-config";

interface RiskFlag {
  flagCode: FlagCode;
  severity: RiskSeverity;
  explanation: string;
  improvement: string;
}

interface ScoringResult {
  score: number;
  risks: RiskFlag[];
}

export class ScoringRules {
  static calculateIncomeScore(
    income: number,
    householdSize: number
  ): ScoringResult {
    const risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.INCOME_AND_FINANCIAL;

    // Calculate poverty guideline threshold using configurable values
    const povertyThreshold =
      INCOME_THRESHOLDS.POVERTY_GUIDELINE_BASE +
      INCOME_THRESHOLDS.ADDITIONAL_PER_PERSON * Math.max(0, householdSize - 1);
    const incomeRatio = income / povertyThreshold;

    if (incomeRatio < INCOME_THRESHOLDS.CRITICAL_RATIO) {
      risks.push({
        flagCode: "SPONSOR_INCOME_BELOW_GUIDELINE",
        severity: "HIGH",
        explanation: `Income ($${income.toLocaleString()}) is below ${
          INCOME_THRESHOLDS.CRITICAL_RATIO * 100
        }% of poverty guideline ($${povertyThreshold.toLocaleString()})`,
        improvement:
          "Consider getting a joint sponsor or increasing income documentation",
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    } else if (incomeRatio < INCOME_THRESHOLDS.WARNING_RATIO) {
      risks.push({
        flagCode: "SPONSOR_INCOME_BELOW_GUIDELINE",
        severity: "MEDIUM",
        explanation: `Income ($${income.toLocaleString()}) is below ${
          INCOME_THRESHOLDS.WARNING_RATIO * 100
        }% of poverty guideline ($${povertyThreshold.toLocaleString()})`,
        improvement:
          "Income is acceptable but could be stronger with additional documentation",
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }

    const MIN_RELATIONSHIP_SCORE =
      COMPONENT_WEIGHTS.RELATIONSHIP_STRENGTH * 0.2;

    score = Math.max(score, MIN_RELATIONSHIP_SCORE);

    return { score, risks };
  }

  static calculateRelationshipScore(
    answers: Record<string, unknown>
  ): ScoringResult {
    const risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.RELATIONSHIP_STRENGTH;

    // Check for short marriage duration
    const marriageDate = answers.marriage_date
      ? new Date(String(answers.marriage_date))
      : null;

    if (marriageDate) {
      const marriageDt = new Date(marriageDate);
      const currentDate = new Date();
      const durationMonths =
        (currentDate.getTime() - marriageDt.getTime()) /
        (1000 * 60 * 60 * 24 * 30);

      if (durationMonths < RELATIONSHIP_THRESHOLDS.SHORT_DURATION_MONTHS) {
        risks.push({
          flagCode: "SHORT_RELATIONSHIP_DURATION",
          severity: "HIGH",
          explanation: `Marriage duration is very short (${Math.round(
            durationMonths
          )} months < ${RELATIONSHIP_THRESHOLDS.SHORT_DURATION_MONTHS} months)`,
          improvement:
            "Longer marriage duration strengthens the case for genuine relationship",
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }

    // Check for in-person meetings
    const inPersonVisits = Number(answers.number_of_in_person_visits) || 0;
    if (inPersonVisits <= RELATIONSHIP_THRESHOLDS.CRITICAL_IN_PERSON_VISITS) {
      risks.push({
        flagCode: "NO_IN_PERSON_MEETINGS",
        severity: "HIGH",
        explanation: `No in-person meetings reported (${inPersonVisits} visits)`,
        improvement:
          "Meeting in person strengthens the case for genuine relationship",
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    } else if (inPersonVisits < RELATIONSHIP_THRESHOLDS.MIN_IN_PERSON_VISITS) {
      risks.push({
        flagCode: "NO_IN_PERSON_MEETINGS",
        severity: "MEDIUM",
        explanation: `Limited in-person meetings (${inPersonVisits} visits < ${RELATIONSHIP_THRESHOLDS.MIN_IN_PERSON_VISITS})`,
        improvement:
          "More in-person meetings strengthen the case for genuine relationship",
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }

    // Check for cohabitation evidence
    const cohabitationProof = Boolean(answers.cohabitation_proof);
    if (!cohabitationProof) {
      risks.push({
        flagCode: "NO_COHABITATION_EVIDENCE",
        severity: "MEDIUM",
        explanation: "No cohabitation evidence provided",
        improvement:
          "Evidence of living together strengthens the case for genuine relationship",
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }

    // Check for shared financials
    const sharedFinancials =
      Boolean(answers.shared_financial_accounts) ||
      Boolean(answers.money_transfer_receipts_available) ||
      false;
    if (!sharedFinancials) {
      risks.push({
        flagCode: "NO_SHARED_FINANCIALS",
        severity: "MEDIUM",
        explanation: "No shared financial evidence",
        improvement:
          "Joint accounts or financial transfers show commitment to shared life",
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }

    // Check for wedding photos
    const weddingPhotos = Boolean(answers.wedding_photos_available);
    if (!weddingPhotos) {
      risks.push({
        flagCode: "NO_WEDDING_PHOTOS",
        severity: "LOW",
        explanation: "No wedding photos available",
        improvement: "Wedding photos provide evidence of relationship",
      });
      score -= RISK_POINTS_DEDUCTION.LOW;
    }

    // Check for communication history
    const commLogs = Boolean(answers.communication_logs);
    if (!commLogs) {
      risks.push({
        flagCode: "NO_COMMUNICATION_HISTORY",
        severity: "LOW",
        explanation: "No communication history provided",
        improvement: "Chat logs, call records show ongoing relationship",
      });
      score -= RISK_POINTS_DEDUCTION.LOW;
    }

    // Check for age gap between sponsor and beneficiary
    const sponsorDob = answers.sponsor_dob
      ? new Date(String(answers.sponsor_dob))
      : null;
    const beneficiaryDob = answers.beneficiary_dob
      ? new Date(String(answers.beneficiary_dob))
      : null;

    if (sponsorDob && beneficiaryDob) {
      const sponsorAge = this.calculateAge(new Date(sponsorDob));
      const beneficiaryAge = this.calculateAge(new Date(beneficiaryDob));
      const ageGap = Math.abs(sponsorAge - beneficiaryAge);

      // If age gap is too large (> 15 years), it may raise questions about the relationship
      if (ageGap > 15) {
        risks.push({
          flagCode: "AGE_GAP_HIGH",
          severity: "HIGH",
          explanation: `Large age gap (${ageGap} years) between sponsor (${sponsorAge} years) and beneficiary (${beneficiaryAge} years)`,
          improvement:
            "Large age gaps may raise questions about the legitimacy of the relationship",
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }

    const MIN_INCOME_SCORE = COMPONENT_WEIGHTS.INCOME_AND_FINANCIAL * 0.2;

    score = Math.max(score, MIN_INCOME_SCORE);

    return { score, risks };
  }

  static calculateDocumentScore(
    answers: Record<string, unknown>
  ): ScoringResult {
    const risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.DOCUMENT_COMPLETENESS;

    // Critical documents check
    const criticalDocs: [string, FlagCode, string][] = [
      [
        "urdu_marriage_certificate",
        "NO_MARRIAGE_CERTIFICATE",
        "Marriage certificate",
      ],
      [
        "english_translation_certificate",
        "NO_MARRIAGE_TRANSLATION",
        "Marriage certificate translation",
      ],
      ["birth_certificates", "NO_BIRTH_CERTIFICATES", "Birth certificates"],
      ["passports_available", "NO_VALID_PASSPORTS", "Valid passports"],
    ];

    for (const [docKey, flagCode, docName] of criticalDocs) {
      if (!answers[docKey]) {
        risks.push({
          flagCode,
          severity: "HIGH",
          explanation: `No ${docName} provided`,
          improvement: `Critical document missing: ${docName}`,
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }

    // Important documents check
    const importantDocs: [string, FlagCode | null, string][] = [
      [
        "union_council_certificate",
        "NO_UNION_COUNCIL_CERTIFICATE",
        "Union Council certificate",
      ],
      [
        "family_registration_certificate",
        "NO_FRC_AVAILABLE",
        "Family Registration Certificate",
      ],
      ["passport_copy_available", "NO_PASSPORT_COPY", "Passport copy"],
      [
        "valid_police_clearance_certificate",
        "NO_VALID_POLICE_CLEARANCE_CERTIFICATE",
        "Police certificate",
      ],
    ];

    for (const [docKey, flagCode, docName] of importantDocs) {
      if (!answers[docKey]) {
        if (flagCode) {
          risks.push({
            flagCode,
            severity: "MEDIUM",
            explanation: `No ${docName} provided`,
            improvement: `Important document missing: ${docName}`,
          });
          score -= 3;
        }
      }
    }

    // Application documents check
    const appDocs: [string, FlagCode, string][] = [
      ["ds260_confirmation", "DS260_NOT_SUBMITTED", "DS-260 confirmation"],
      ["interview_letter", "NO_INTERVIEW_LETTER", "Interview letter"],
      ["medical_report_available", "NO_MEDICAL_REPORT", "Medical report"],
      ["passport_photos_2x2", "NO_PASSPORT_PHOTOS_2X2", "Passport photos"],
    ];

    for (const [docKey, flagCode, docName] of appDocs) {
      if (!answers[docKey]) {
        risks.push({
          flagCode,
          severity: "MEDIUM",
          explanation: `No ${docName} provided`,
          improvement: `Required application document missing: ${docName}`,
        });
        score -= 3;
      }
    }

    // Vaccination documents
    const covidVaccine = answers.covid_vaccination_certificate || false;
    const polioVaccine = answers.polio_vaccination_certificate || false;

    if (!covidVaccine) {
      risks.push({
        flagCode: "NO_COVID_VACCINATION_PROOF",
        severity: "MEDIUM",
        explanation: "No COVID vaccination proof",
        improvement: "COVID vaccination is required for US entry",
      });
      score -= 2;
    }

    if (!polioVaccine) {
      risks.push({
        flagCode: "NO_POLIO_VACCINATION_PROOF",
        severity: "MEDIUM",
        explanation: "No polio vaccination proof",
        improvement: "Polio vaccination may be required for US entry",
      });
      score -= 2;
    }

    const MIN_DOCUMENT_SCORE = COMPONENT_WEIGHTS.DOCUMENT_COMPLETENESS * 0.2;

    score = Math.max(score, MIN_DOCUMENT_SCORE);

    return { score, risks };
  }

  static calculateImmigrationHistoryScore(
    answers: Record<string, unknown>
  ): ScoringResult {
    const risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.IMMIGRATION_HISTORY;

    // Check for previous visa issues
    if (answers.previous_visa_denial) {
      risks.push({
        flagCode: "PREVIOUS_US_VISA_DENIAL",
        severity: "HIGH",
        explanation: "Previous US visa denial",
        improvement: "Previous denial significantly impacts case strength",
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }

    if (answers.overstay_or_violation) {
      risks.push({
        flagCode: "PRIOR_IMMIGRATION_VIOLATION",
        severity: "HIGH",
        explanation: "Prior immigration violation",
        improvement: "Prior violations significantly impact case strength",
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }

    if (answers.criminal_record) {
      risks.push({
        flagCode: "CRIMINAL_HISTORY_PRESENT",
        severity: "HIGH",
        explanation: "Criminal record present",
        improvement: "Criminal history significantly impacts case strength",
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }

    // Check for cousin marriage risk based on intended state
    const spousalRelationshipType = answers.spousal_relationship_type;
    const intendedState = answers.intended_us_state_of_residence as string;

    if (spousalRelationshipType === "biological_cousins" && intendedState) {
      // States that prohibit or restrict cousin marriages
      const restrictedStates = [
        "Arizona",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Illinois",
        "Indiana",
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

      if (restrictedStates.includes(intendedState)) {
        risks.push({
          flagCode: "MARRIAGE_INVALID_IN_INTENDED_STATE",
          severity: "MEDIUM",
          explanation: `Cousin marriage may face legal or policy scrutiny in ${intendedState}`,
          improvement:
            "Consult an immigration attorney regarding state-specific marriage recognition",
        });
        score -= RISK_POINTS_DEDUCTION.MEDIUM;
      }
    }

    // Check for financial documentation
    const financialDocs: [string, FlagCode, string][] = [
      ["has_tax_returns", "NO_TAX_RETURNS_AVAILABLE", "Tax returns"],
      ["has_employment_letter", "NO_EMPLOYMENT_PROOF", "Employment letter"],
      ["has_paystubs", "NO_PAYSTUBS", "Pay stubs"],
    ];

    for (const [docKey, flagCode, docName] of financialDocs) {
      if (!answers[docKey]) {
        risks.push({
          flagCode,
          severity: "MEDIUM",
          explanation: `No ${docName} provided`,
          improvement: `Financial documentation missing: ${docName}`,
        });
        score -= 5;
      }
    }

    // Check for joint sponsor
    if (
      Number(answers.sponsor_annual_income) <
        INCOME_THRESHOLDS.CRITICAL_RATIO &&
      !answers.joint_sponsor_available
    ) {
      risks.push({
        flagCode: "NO_JOINT_SPONSOR_WHEN_REQUIRED",
        severity: "HIGH",
        explanation: "No joint sponsor when income is insufficient",
        improvement: "Consider finding a joint sponsor for financial support",
      });
      score -= 15;
    }

    // Check I-864 documents
    if (!answers.i864_affidavit_submitted) {
      risks.push({
        flagCode: "NO_I864_SUBMITTED",
        severity: "HIGH",
        explanation: "Form I-864 not submitted",
        improvement: "Form I-864 Affidavit of Support is required",
      });
      score -= 10;
    }

    if (!answers.i864_supporting_financial_documents) {
      risks.push({
        flagCode: "I864_FINANCIAL_EVIDENCE_WEAK",
        severity: "MEDIUM",
        explanation: "No supporting financial documents for I-864",
        improvement: "Supporting financial documents strengthen I-864",
      });
      score -= 5;
    }

    const MIN_IMMIGRATION_SCORE = COMPONENT_WEIGHTS.IMMIGRATION_HISTORY * 0.2;

    score = Math.max(score, MIN_IMMIGRATION_SCORE);

    return { score, risks };
  }

  static calculateTotalScore(answers: Record<string, unknown>) {
    // Calculate individual component scores
    const householdSize = Math.max(
      1,
      this.safeNumber(answers.household_size, 2)
    );

    const income = this.safeNumber(answers.sponsor_annual_income, 0);

    const { score: incomeScore, risks: incomeRisks } =
      this.calculateIncomeScore(income, householdSize);

    const { score: relationshipScore, risks: relationshipRisks } =
      this.calculateRelationshipScore(answers);
    const { score: documentScore, risks: documentRisks } =
      this.calculateDocumentScore(answers);
    const { score: immigrationScore, risks: immigrationRisks } =
      this.calculateImmigrationHistoryScore(answers);

    // Calculate total score
    const rawTotalScore =
      incomeScore + relationshipScore + documentScore + immigrationScore;

    const totalScore = Number.isFinite(rawTotalScore)
      ? Math.min(MAX_TOTAL_SCORE, Math.max(MIN_TOTAL_SCORE, rawTotalScore))
      : MIN_TOTAL_SCORE;

    // Determine risk level
    let riskLevel: "STRONG" | "MODERATE" | "WEAK";
    if (totalScore >= 80) {
      riskLevel = "STRONG";
    } else if (totalScore >= 50) {
      riskLevel = "MODERATE";
    } else {
      riskLevel = "WEAK";
    }

    // Combine all risks
    const allRisks = [
      ...incomeRisks,
      ...relationshipRisks,
      ...documentRisks,
      ...immigrationRisks,
    ];

    // Generate summary reasons and suggestions
    const summaryReasons: string[] = [];
    const improvementSuggestions: string[] = [];

    if (totalScore < 50) {
      summaryReasons.push(
        "Case has significant weaknesses that need to be addressed"
      );
      improvementSuggestions.push(
        "Focus on strengthening the weakest areas of your case"
      );
    } else if (totalScore < 80) {
      summaryReasons.push(
        "Case has moderate strengths but some areas need improvement"
      );
      improvementSuggestions.push(
        "Address the identified risk factors to strengthen your case"
      );
    } else {
      summaryReasons.push(
        "Case has strong fundamentals and good chances of approval"
      );
      improvementSuggestions.push(
        "Maintain current strengths and ensure all documentation is complete"
      );
    }

    return {
      totalScore,
      allRisks,
      riskLevel,
      summaryReasons,
      improvementSuggestions,
    };
  }

  private static safeNumber(value: unknown, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  //   Calculate age from date of birth
  private static calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}
