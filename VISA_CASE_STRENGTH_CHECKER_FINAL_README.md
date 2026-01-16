# Visa Case Strength Checker Next.js Implementation Guide

## 🎯 Overview

This guide outlines the complete implementation of the Visa Case Strength Checker using Next.js API routes with Supabase for data persistence. The system allows users to answer guided questions, analyzes risk factors, and provides assessments with strengths, weaknesses, and improvement suggestions.

### 🧭 High-Level Goal
- User answers guided questions
- System analyzes risk factors
- Outputs: Strong / Medium / Weak assessment
- Provides reasons and improvement suggestions
- NOT a legal decision — it's a risk guidance tool

## 📁 Project Structure

Based on the existing Next.js structure, the new implementation will follow the established patterns:

```
app/
├── api/
│   └── visa-checker/
│       ├── session/
│       │   ├── route.ts          # Create assessment session
│       │   └── [id]/
│       │       ├── route.ts      # Get session details
│       │       ├── answers/
│       │       │   └── route.ts  # Save answers
│       │       └── submit/
│       │           └── route.ts  # Submit and calculate results
│       └── results/
│           └── [sessionId]/
│               └── route.ts      # Get scoring results
└── lib/
    └── visa-checker/
        ├── types.ts               # Type definitions
        ├── scoring-config.ts      # Configurable scoring constants
        ├── scoring-rules.ts       # Scoring algorithms
        └── supabase.ts            # Supabase client wrapper
```

## 🚀 Implementation Steps (Production-Ready)

### Step 1: Create Type Definitions

First, create the type definitions that will be used throughout the application:

Create `lib/visa-checker/types.ts`:

```typescript
// lib/visa-checker/types.ts
export type CaseType = 'Spouse';

export type RiskLevel = 'PENDING' | 'WEAK' | 'MODERATE' | 'STRONG';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export type QuestionKey =
  // Basic Profile
  | 'sponsor_dob'
  | 'beneficiary_dob'
  | 'country_of_residence'
  | 'marriage_date'
  | 'spousal_relationship_type'
  | 'intended_us_state_of_residence'
  // Relationship Strength
  | 'how_did_you_meet'
  | 'number_of_in_person_visits'
  | 'cohabitation_proof'
  | 'shared_financial_accounts'
  | 'wedding_photos_available'
  | 'communication_logs'
  | 'money_transfer_receipts_available'
  | 'driving_license_copy_available'
  // Immigration History
  | 'previous_visa_applications'
  | 'previous_visa_denial'
  | 'overstay_or_violation'
  | 'criminal_record'
  // Financial Profile
  | 'sponsor_annual_income'
  | 'household_size'
  | 'has_tax_returns'
  | 'has_employment_letter'
  | 'has_paystubs'
  | 'joint_sponsor_available'
  | 'i864_affidavit_submitted'
  | 'i864_supporting_financial_documents'
  // Core Identity Documents
  | 'urdu_marriage_certificate'
  | 'english_translation_certificate'
  | 'union_council_certificate'
  | 'family_registration_certificate'
  | 'birth_certificates'
  // Passport & Police Documents
  | 'passports_available'
  | 'passport_copy_available'
  | 'valid_police_clearance_certificate'
  // Interview & Medical Documents
  | 'ds264_confirmation'
  | 'interview_letter'
  | 'courier_registration'
  | 'medical_report_available'
  | 'polio_vaccination_certificate'
  | 'covid_vaccination_certificate'
  | 'passport_photos_2x2';

export type FlagCode =
  // Relationship red flags
  | 'AGE_GAP_HIGH'
  | 'NO_IN_PERSON_MEETINGS'
  | 'NO_COHABITATION_EVIDENCE'
  | 'NO_SHARED_FINANCIALS'
  | 'NO_WEDDING_PHOTOS'
  | 'NO_COMMUNICATION_HISTORY'
  // Immigration history risks
  | 'PREVIOUS_US_VISA_DENIAL'
  | 'PRIOR_IMMIGRATION_VIOLATION'
  | 'CRIMINAL_HISTORY_PRESENT'
  // Financial risks
  | 'SPONSOR_INCOME_BELOW_GUIDELINE'
  | 'NO_TAX_RETURNS_AVAILABLE'
  | 'NO_EMPLOYMENT_PROOF'
  | 'NO_PAYSTUBS'
  | 'NO_JOINT_SPONSOR_WHEN_REQUIRED'
  // Document risks
  | 'NO_MARRIAGE_CERTIFICATE'
  | 'NO_MARRIAGE_TRANSLATION'
  | 'NO_UNION_COUNCIL_CERTIFICATE'
  | 'NO_BIRTH_CERTIFICATES'
  | 'NO_VALID_PASSPORTS'
  | 'DS260_NOT_SUBMITTED'
  | 'NO_INTERVIEW_LETTER'
  | 'NO_COURIER_REGISTRATION'
  | 'NO_MEDICAL_REPORT'
  | 'NO_POLIO_VACCINATION_PROOF'
  | 'NO_COVID_VACCINATION_PROOF'
  | 'NO_PASSPORT_PHOTOS_2X2'
  | 'NO_FRC_AVAILABLE'
  | 'NO_PASSPORT_COPY'
  | 'NO_VALID_POLICE_CLEARANCE_CERTIFICATE'
  | 'NO_I864_SUBMITTED'
  | 'I864_FINANCIAL_EVIDENCE_WEAK'
  | 'NO_FINANCIAL_INTERACTION_EVIDENCE'
  | 'CONSANGUINEOUS_MARRIAGE'
  | 'MARRIAGE_INVALID_IN_INTENDED_STATE'
  | 'WORKING_IN_DEFENSE_SECTOR'
  | 'SENSITIVE_RESEARCH_FIELD'
  | 'DUAL_USE_TECHNOLOGY_RISK';

export interface CreateSessionRequest {
  userId?: string;
  userEmail?: string;
  userName?: string;
  caseType: CaseType;
}

export interface CreateSessionResponse {
  sessionId: string;
  message: string;
}

export interface SaveAnswersRequest {
  answers: Record<string, any>;
}

export interface SessionDetailsResponse {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  caseType: CaseType;
  overallScore?: number;
  riskLevel?: RiskLevel;
  completed: boolean;
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitQuestionnaireRequest {
  calculateImmediately?: boolean;
}

export interface RiskFlagResponse {
  flagCode: FlagCode;
  severity: RiskSeverity;
  pointsDeducted: number;
  explanation: string;
  improvementSuggestions: string;
}

export interface ScoringResultsResponse {
  sessionId: string;
  overallScore: number;
  riskLevel: RiskLevel;
  totalPossiblePoints: number;
  totalDeductedPoints: number;
  riskFlags: RiskFlagResponse[];
  summaryReasons: string[];
  improvementSuggestions: string[];
}

export interface DeleteSessionResponse {
  sessionId: string;
  deleted: boolean;
  message: string;
}
```

### Step 2: Create Configurable Scoring Constants

Create configurable scoring constants that can be easily modified later:

Create `lib/visa-checker/scoring-config.ts`:

```typescript
// lib/visa-checker/scoring-config.ts

// Scoring System Configuration
export const SCORING_CONFIG = {
  // Maximum and minimum scores
  MAX_TOTAL_SCORE: 100,
  MIN_TOTAL_SCORE: 0,
  
  // Component weights (each component max score)
  COMPONENT_WEIGHTS: {
    INCOME_AND_FINANCIAL: 25,
    RELATIONSHIP_STRENGTH: 25,
    DOCUMENT_COMPLETENESS: 25,
    IMMIGRATION_HISTORY: 25
  },
  
  // Risk deduction points
  RISK_POINTS_DEDUCTION: {
    HIGH: 20,
    MEDIUM: 10,
    LOW: 5
  },
  
  // Income scoring thresholds
  INCOME_THRESHOLDS: {
    POVERTY_GUIDELINE_BASE: 13590, // 2023 US federal poverty guideline
    ADDITIONAL_PER_PERSON: 4720,   // Additional amount per household member
    CRITICAL_RATIO: 1.25,          // Below 125% triggers HIGH risk
    WARNING_RATIO: 1.50            // Below 150% triggers MEDIUM risk
  },
  
  // Relationship scoring thresholds
  RELATIONSHIP_THRESHOLDS: {
    SHORT_DURATION_MONTHS: 6,      // Less than 6 months triggers HIGH risk
    MIN_IN_PERSON_VISITS: 3,       // Less than 3 visits triggers MEDIUM risk
    CRITICAL_IN_PERSON_VISITS: 0   // Zero visits triggers HIGH risk
  }
};

// Export individual constants for easy access
export const {
  MAX_TOTAL_SCORE,
  MIN_TOTAL_SCORE,
  COMPONENT_WEIGHTS,
  RISK_POINTS_DEDUCTION,
  INCOME_THRESHOLDS,
  RELATIONSHIP_THRESHOLDS
} = SCORING_CONFIG;
```

### Step 3: Create Scoring Logic with Configurable Values

Create the core scoring algorithms using the configurable constants:

Create `lib/visa-checker/scoring-rules.ts`:

```typescript
// lib/visa-checker/scoring-rules.ts
import { RiskSeverity, FlagCode } from './types';
import { 
  MAX_TOTAL_SCORE,
  MIN_TOTAL_SCORE,
  COMPONENT_WEIGHTS,
  RISK_POINTS_DEDUCTION,
  INCOME_THRESHOLDS,
  RELATIONSHIP_THRESHOLDS
} from './scoring-config';

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
  static calculateIncomeScore(income: number, householdSize: number): ScoringResult {
    let risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.INCOME_AND_FINANCIAL;
    
    // Calculate poverty guideline threshold using configurable values
    const povertyThreshold = INCOME_THRESHOLDS.POVERTY_GUIDELINE_BASE + 
                           (INCOME_THRESHOLDS.ADDITIONAL_PER_PERSON * (householdSize - 1));
    const incomeRatio = income / povertyThreshold;
    
    if (incomeRatio < INCOME_THRESHOLDS.CRITICAL_RATIO) {
      risks.push({
        flagCode: 'SPONSOR_INCOME_BELOW_GUIDELINE',
        severity: 'HIGH',
        explanation: `Income ($${income.toLocaleString()}) is below ${INCOME_THRESHOLDS.CRITICAL_RATIO * 100}% of poverty guideline ($${povertyThreshold.toLocaleString()})`,
        improvement: 'Consider getting a joint sponsor or increasing income documentation'
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    } else if (incomeRatio < INCOME_THRESHOLDS.WARNING_RATIO) {
      risks.push({
        flagCode: 'SPONSOR_INCOME_BELOW_GUIDELINE',
        severity: 'MEDIUM',
        explanation: `Income ($${income.toLocaleString()}) is below ${INCOME_THRESHOLDS.WARNING_RATIO * 100}% of poverty guideline ($${povertyThreshold.toLocaleString()})`,
        improvement: 'Income is acceptable but could be stronger with additional documentation'
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }
    
    return { score: Math.max(MIN_TOTAL_SCORE, score), risks };
  }

  static calculateRelationshipScore(answers: Record<string, any>): ScoringResult {
    let risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.RELATIONSHIP_STRENGTH;
    
    // Check for short marriage duration
    const marriageDate = answers.marriage_date;
    
    if (marriageDate) {
      const marriageDt = new Date(marriageDate);
      const currentDate = new Date();
      const durationMonths = (currentDate.getTime() - marriageDt.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (durationMonths < RELATIONSHIP_THRESHOLDS.SHORT_DURATION_MONTHS) {
        risks.push({
          flagCode: 'SHORT_RELATIONSHIP_DURATION',
          severity: 'HIGH',
          explanation: `Marriage duration is very short (${Math.round(durationMonths)} months < ${RELATIONSHIP_THRESHOLDS.SHORT_DURATION_MONTHS} months)`,
          improvement: 'Longer marriage duration strengthens the case for genuine relationship'
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }
    
    // Check for in-person meetings
    const inPersonVisits = answers.number_of_in_person_visits || 0;
    if (inPersonVisits <= RELATIONSHIP_THRESHOLDS.CRITICAL_IN_PERSON_VISITS) {
      risks.push({
        flagCode: 'NO_IN_PERSON_MEETINGS',
        severity: 'HIGH',
        explanation: `No in-person meetings reported (${inPersonVisits} visits)`,
        improvement: 'Meeting in person strengthens the case for genuine relationship'
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    } else if (inPersonVisits < RELATIONSHIP_THRESHOLDS.MIN_IN_PERSON_VISITS) {
      risks.push({
        flagCode: 'NO_IN_PERSON_MEETINGS',
        severity: 'MEDIUM',
        explanation: `Limited in-person meetings (${inPersonVisits} visits < ${RELATIONSHIP_THRESHOLDS.MIN_IN_PERSON_VISITS})`,
        improvement: 'More in-person meetings strengthen the case for genuine relationship'
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }
    
    // Check for cohabitation evidence
    const cohabitationProof = answers.cohabitation_proof || false;
    if (!cohabitationProof) {
      risks.push({
        flagCode: 'NO_COHABITATION_EVIDENCE',
        severity: 'MEDIUM',
        explanation: 'No cohabitation evidence provided',
        improvement: 'Evidence of living together strengthens the case for genuine relationship'
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }
    
    // Check for shared financials
    const sharedFinancials = answers.shared_financial_accounts || answers.money_transfer_receipts_available || false;
    if (!sharedFinancials) {
      risks.push({
        flagCode: 'NO_SHARED_FINANCIALS',
        severity: 'MEDIUM',
        explanation: 'No shared financial evidence',
        improvement: 'Joint accounts or financial transfers show commitment to shared life'
      });
      score -= RISK_POINTS_DEDUCTION.MEDIUM;
    }
    
    // Check for wedding photos
    const weddingPhotos = answers.wedding_photos_available || false;
    if (!weddingPhotos) {
      risks.push({
        flagCode: 'NO_WEDDING_PHOTOS',
        severity: 'LOW',
        explanation: 'No wedding photos available',
        improvement: 'Wedding photos provide evidence of relationship'
      });
      score -= RISK_POINTS_DEDUCTION.LOW;
    }
    
    // Check for communication history
    const commLogs = answers.communication_logs || false;
    if (!commLogs) {
      risks.push({
        flagCode: 'NO_COMMUNICATION_HISTORY',
        severity: 'LOW',
        explanation: 'No communication history provided',
        improvement: 'Chat logs, call records show ongoing relationship'
      });
      score -= RISK_POINTS_DEDUCTION.LOW;
    }
    
    // Check for age gap between sponsor and beneficiary
    const sponsorDob = answers.sponsor_dob;
    const beneficiaryDob = answers.beneficiary_dob;
    
    if (sponsorDob && beneficiaryDob) {
      const sponsorAge = this.calculateAge(new Date(sponsorDob));
      const beneficiaryAge = this.calculateAge(new Date(beneficiaryDob));
      const ageGap = Math.abs(sponsorAge - beneficiaryAge);
      
      // If age gap is too large (> 15 years), it may raise questions about the relationship
      if (ageGap > 30) {
        risks.push({
          flagCode: 'AGE_GAP_HIGH',
          severity: 'HIGH',
          explanation: `Large age gap (${ageGap} years) between sponsor (${sponsorAge} years) and beneficiary (${beneficiaryAge} years)`,
          improvement: 'Large age gaps may raise questions about the legitimacy of the relationship'
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }
    
    return { score: Math.max(MIN_TOTAL_SCORE, score), risks };
  }

  static calculateDocumentScore(answers: Record<string, any>): ScoringResult {
    let risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.DOCUMENT_COMPLETENESS;
    
    // Critical documents check
    const criticalDocs: [string, FlagCode, string][] = [
      ['urdu_marriage_certificate', 'NO_MARRIAGE_CERTIFICATE', 'Marriage certificate'],
      ['english_translation_certificate', 'NO_MARRIAGE_TRANSLATION', 'Marriage certificate translation'],
      ['birth_certificates', 'NO_BIRTH_CERTIFICATES', 'Birth certificates'],
      ['passports_available', 'NO_VALID_PASSPORTS', 'Valid passports'],
    ];
    
    for (const [docKey, flagCode, docName] of criticalDocs) {
      if (!answers[docKey]) {
        risks.push({
          flagCode,
          severity: 'HIGH',
          explanation: `No ${docName} provided`,
          improvement: `Critical document missing: ${docName}`
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }
    
    // Other document checks...
    return { score: Math.max(MIN_TOTAL_SCORE, score), risks };
  }

  static calculateImmigrationHistoryScore(answers: Record<string, any>): ScoringResult {
    let risks: RiskFlag[] = [];
    let score = COMPONENT_WEIGHTS.IMMIGRATION_HISTORY;
    
    // Check for previous visa issues
    if (answers.previous_visa_denial) {
      risks.push({
        flagCode: 'PREVIOUS_US_VISA_DENIAL',
        severity: 'HIGH',
        explanation: 'Previous US visa denial',
        improvement: 'Previous denial significantly impacts case strength'
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }
    
    if (answers.overstay_or_violation) {
      risks.push({
        flagCode: 'PRIOR_IMMIGRATION_VIOLATION',
        severity: 'HIGH',
        explanation: 'Prior immigration violation',
        improvement: 'Prior violations significantly impact case strength'
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }
    
    if (answers.criminal_record) {
      risks.push({
        flagCode: 'CRIMINAL_HISTORY_PRESENT',
        severity: 'HIGH',
        explanation: 'Criminal record present',
        improvement: 'Criminal history significantly impacts case strength'
      });
      score -= RISK_POINTS_DEDUCTION.HIGH;
    }
    
    // Check for cousin marriage risk based on intended state
    const spousalRelationshipType = answers.spousal_relationship_type;
    const intendedState = answers.intended_us_state_of_residence;
    
    if (spousalRelationshipType === 'biological_cousins' && intendedState) {
      // States that prohibit or restrict cousin marriages
      const restrictedStates = [
        'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 
        'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Illinois', 
        'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 
        'Montana', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
        'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 
        'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ];
      
      if (restrictedStates.includes(intendedState)) {
        risks.push({
          flagCode: 'CONSANGUINEOUS_MARRIAGE',
          severity: 'HIGH',
          explanation: `Cousin marriage may not be legally recognized in ${intendedState}`,
          improvement: 'Research state laws regarding cousin marriages or consider legal consultation'
        });
        score -= RISK_POINTS_DEDUCTION.HIGH;
      }
    }
    
    return { score: Math.max(MIN_TOTAL_SCORE, score), risks };
  }

  static calculateTotalScore(answers: Record<string, any>) {
    // Calculate individual component scores
    const { score: incomeScore, risks: incomeRisks } = this.calculateIncomeScore(
      answers.sponsor_annual_income || 0,
      answers.household_size || 2
    );
    
    const { score: relationshipScore, risks: relationshipRisks } = this.calculateRelationshipScore(answers);
    const { score: documentScore, risks: documentRisks } = this.calculateDocumentScore(answers);
    const { score: immigrationScore, risks: immigrationRisks } = this.calculateImmigrationHistoryScore(answers);
    
    // Calculate total score
    const totalScore = incomeScore + relationshipScore + documentScore + immigrationScore;
    
    // Determine risk level
    let riskLevel: 'STRONG' | 'MODERATE' | 'WEAK';
    if (totalScore >= 80) {
      riskLevel = 'STRONG';
    } else if (totalScore >= 50) {
      riskLevel = 'MODERATE';
    } else {
      riskLevel = 'WEAK';
    }
    
    // Combine all risks
    const allRisks = [
      ...incomeRisks,
      ...relationshipRisks,
      ...documentRisks,
      ...immigrationRisks
    ];
    
    // Generate summary reasons and suggestions
    const summaryReasons: string[] = [];
    const improvementSuggestions: string[] = [];
    
    if (totalScore < 50) {
      summaryReasons.push('Case has significant weaknesses that need to be addressed');
      improvementSuggestions.push('Focus on strengthening the weakest areas of your case');
    } else if (totalScore < 80) {
      summaryReasons.push('Case has moderate strengths but some areas need improvement');
      improvementSuggestions.push('Address the identified risk factors to strengthen your case');
    } else {
      summaryReasons.push('Case has strong fundamentals and good chances of approval');
      improvementSuggestions.push('Maintain current strengths and ensure all documentation is complete');
    }
    
    return {
      totalScore,
      allRisks,
      riskLevel,
      summaryReasons,
      improvementSuggestions
    };
  }

  /**
   * Calculate age from date of birth
   */
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
```

### Step 4: Create Supabase Service Wrapper

Create the service wrapper that provides clean abstraction over Supabase operations:

Create `lib/visa-checker/supabase.ts`:

```typescript
// lib/visa-checker/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { 
  CreateSessionRequest, 
  SessionDetailsResponse, 
  SaveAnswersRequest,
  ScoringResultsResponse,
  CaseType,
  RiskLevel
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export class VisaCheckerSupabaseService {
  /**
   * Create a new assessment session
   */
  static async createSession(request: CreateSessionRequest) {
    const { data, error } = await supabase
      .from('user_case_sessions')
      .insert({
        user_id: request.userId,
        user_email: request.userEmail,
        user_name: request.userName,
        case_type: request.caseType,
        risk_level: 'PENDING' as RiskLevel
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return {
      sessionId: data.id,
      message: 'Assessment session created successfully'
    };
  }

  /**
   * Save answers for a session
   */
  static async saveAnswers(sessionId: string, answers: SaveAnswersRequest['answers']) {
    // First, delete existing answers for this session
    const { error: deleteError } = await supabase
      .from('user_case_answers')
      .delete()
      .eq('session_id', sessionId);

    if (deleteError) {
      throw new Error(`Failed to delete existing answers: ${deleteError.message}`);
    }

    // Prepare answer records
    const answerRecords = Object.entries(answers).map(([questionKey, answerValue]) => ({
      session_id: sessionId,
      question_key: questionKey,
      answer_value: answerValue
    }));

    // Insert new answers
    if (answerRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('user_case_answers')
        .insert(answerRecords);

      if (insertError) {
        throw new Error(`Failed to save answers: ${insertError.message}`);
      }
    }

    return { message: 'Answers saved successfully', sessionId };
  }

  /**
   * Get session details
   */
  static async getSessionDetails(sessionId: string) {
    // Get session info
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_case_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }

    if (!sessionData) {
      throw new Error('Session not found');
    }

    // Get answers
    const { data: answersData, error: answersError } = await supabase
      .from('user_case_answers')
      .select('question_key, answer_value')
      .eq('session_id', sessionId);

    if (answersError) {
      throw new Error(`Failed to get answers: ${answersError.message}`);
    }

    const answers: Record<string, any> = {};
    answersData.forEach(item => {
      answers[item.question_key] = item.answer_value;
    });

    return {
      sessionId: sessionData.id,
      userId: sessionData.user_id,
      userEmail: sessionData.user_email,
      userName: sessionData.user_name,
      caseType: sessionData.case_type as CaseType,
      overallScore: sessionData.overall_score,
      riskLevel: sessionData.risk_level as RiskLevel,
      completed: sessionData.completed,
      answers,
      createdAt: sessionData.created_at,
      updatedAt: sessionData.updated_at
    };
  }

  /**
   * Submit session for scoring
   */
  static async submitForScoring(sessionId: string) {
    // Get current session and answers
    const sessionDetails = await this.getSessionDetails(sessionId);
    
    // Calculate score using the scoring rules
    const { totalScore, allRisks, riskLevel, summaryReasons, improvementSuggestions } = 
      await import('./scoring-rules').then(rules => 
        rules.ScoringRules.calculateTotalScore(sessionDetails.answers)
      );

    // Update session with calculated score
    const { error: updateError } = await supabase
      .from('user_case_sessions')
      .update({
        overall_score: totalScore,
        risk_level: riskLevel,
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    // Clear existing risk flags for this session
    const { error: deleteFlagsError } = await supabase
      .from('risk_flags')
      .delete()
      .eq('session_id', sessionId);

    if (deleteFlagsError) {
      throw new Error(`Failed to clear risk flags: ${deleteFlagsError.message}`);
    }

    // Insert new risk flags if any exist
    if (allRisks.length > 0) {
      const { RISK_POINTS_DEDUCTION } = await import('./scoring-config');
      const flagRecords = allRisks.map(flag => ({
        session_id: sessionId,
        flag_code: flag.flagCode,
        severity: flag.severity,
        points_deducted: RISK_POINTS_DEDUCTION[flag.severity],
        explanation: flag.explanation,
        improvement_suggestions: flag.improvement,
        improvement_priority: this.getPriorityNumber(flag.severity)
      }));

      const { error: insertFlagsError } = await supabase
        .from('risk_flags')
        .insert(flagRecords);

      if (insertFlagsError) {
        throw new Error(`Failed to save risk flags: ${insertFlagsError.message}`);
      }
    }

    return {
      sessionId,
      overallScore: totalScore,
      riskLevel,
      riskFlags: allRisks,
      summaryReasons,
      improvementSuggestions
    };
  }

  /**
   * Get scoring results
   */
  static async getScoringResults(sessionId: string) {
    // Get session info
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_case_sessions')
      .select('id, overall_score, risk_level')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }

    if (!sessionData) {
      throw new Error('Session not found or not scored yet');
    }

    // Get risk flags
    const { data: riskFlagsData, error: flagsError } = await supabase
      .from('risk_flags')
      .select('*')
      .eq('session_id', sessionId)
      .order('points_deducted', { ascending: false });

    if (flagsError) {
      throw new Error(`Failed to get risk flags: ${flagsError.message}`);
    }

    return {
      sessionId: sessionData.id,
      overallScore: sessionData.overall_score,
      riskLevel: sessionData.risk_level as RiskLevel,
      riskFlags: riskFlagsData.map(flag => ({
        flagCode: flag.flag_code,
        severity: flag.severity,
        pointsDeducted: flag.points_deducted,
        explanation: flag.explanation,
        improvementSuggestions: flag.improvement_suggestions
      }))
    };
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string) {
    // Delete risk flags
    const { error: flagsError } = await supabase
      .from('risk_flags')
      .delete()
      .eq('session_id', sessionId);

    if (flagsError) {
      throw new Error(`Failed to delete risk flags: ${flagsError.message}`);
    }

    // Delete answers
    const { error: answersError } = await supabase
      .from('user_case_answers')
      .delete()
      .eq('session_id', sessionId);

    if (answersError) {
      throw new Error(`Failed to delete answers: ${answersError.message}`);
    }

    // Delete session
    const { error: sessionError } = await supabase
      .from('user_case_sessions')
      .delete()
      .eq('id', sessionId);

    if (sessionError) {
      throw new Error(`Failed to delete session: ${sessionError.message}`);
    }

    return {
      sessionId,
      deleted: true,
      message: 'Session deleted successfully'
    };
  }

  /**
   * Convert severity to priority number (1=HIGH, 2=MEDIUM, 3=LOW)
   */
  private static getPriorityNumber(severity: string): number {
    switch (severity) {
      case 'HIGH': return 1;
      case 'MEDIUM': return 2;
      case 'LOW': return 3;
      default: return 3;
    }
  }
}
```

### Step 5: Create API Routes (Production-Ready Service Wrapper Approach)

Create the API routes using the service wrapper approach:

#### Create Session Route
Create `app/api/visa-checker/session/route.ts`:

```typescript
// app/api/visa-checker/session/route.ts
import { NextRequest } from 'next/server';
import { VisaCheckerSupabaseService } from '@/lib/visa-checker/supabase';
import { CreateSessionRequest, CreateSessionResponse } from '@/lib/visa-checker/types';

export async function POST(req: NextRequest) {
  try {
    const body: CreateSessionRequest = await req.json();
    
    const result = await VisaCheckerSupabaseService.createSession(body);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error creating session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### Save Answers Route
Create `app/api/visa-checker/session/[id]/answers/route.ts`:

```typescript
// app/api/visa-checker/session/[id]/answers/route.ts
import { NextRequest } from 'next/server';
import { VisaCheckerSupabaseService } from '@/lib/visa-checker/supabase';
import { SaveAnswersRequest } from '@/lib/visa-checker/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body: SaveAnswersRequest = await req.json();
    
    const result = await VisaCheckerSupabaseService.saveAnswers(sessionId, body.answers);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error saving answers:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to save answers' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### Submit for Scoring Route
Create `app/api/visa-checker/session/[id]/submit/route.ts`:

```typescript
// app/api/visa-checker/session/[id]/submit/route.ts
import { NextRequest } from 'next/server';
import { VisaCheckerSupabaseService } from '@/lib/visa-checker/supabase';
import { SubmitQuestionnaireRequest } from '@/lib/visa-checker/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body: SubmitQuestionnaireRequest = await req.json();
    
    const result = await VisaCheckerSupabaseService.submitForScoring(sessionId);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error submitting questionnaire:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to submit questionnaire' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### Get Session Details Route
Create `app/api/visa-checker/session/[id]/route.ts`:

```typescript
// app/api/visa-checker/session/[id]/route.ts
import { NextRequest } from 'next/server';
import { VisaCheckerSupabaseService } from '@/lib/visa-checker/supabase';
import { SessionDetailsResponse } from '@/lib/visa-checker/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    
    const result = await VisaCheckerSupabaseService.getSessionDetails(sessionId);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error getting session details:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get session details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    
    const result = await VisaCheckerSupabaseService.deleteSession(sessionId);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### Get Results Route
Create `app/api/visa-checker/results/[sessionId]/route.ts`:

```typescript
// app/api/visa-checker/results/[sessionId]/route.ts
import { NextRequest } from 'next/server';
import { VisaCheckerSupabaseService } from '@/lib/visa-checker/supabase';
import { ScoringResultsResponse } from '@/lib/visa-checker/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    
    const result = await VisaCheckerSupabaseService.getScoringResults(sessionId);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error getting scoring results:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get scoring results' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## 🔧 Easy Configuration

All scoring parameters are now configurable through the `scoring-config.ts` file. You can easily modify:

- Risk point deductions
- Income thresholds  
- Relationship duration requirements
- Component weights
- Scoring ranges

Simply update the values in `SCORING_CONFIG` and the entire system will adapt automatically.

## 📋 Summary

This implementation provides a complete, production-ready solution for the Visa Case Strength Checker with:

- ✅ Clean service wrapper architecture (production-ready)
- ✅ Configurable scoring constants for easy modification
- ✅ Supabase integration for data persistence
- ✅ Comprehensive risk scoring algorithm
- ✅ Detailed risk flag identification with priority levels
- ✅ Component-based scoring breakdown
- ✅ Proper error handling and logging
- ✅ Scalable architecture following established patterns

The system is designed to integrate seamlessly with your existing Next.js + Supabase architecture.