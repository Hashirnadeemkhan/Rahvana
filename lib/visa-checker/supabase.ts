import { supabase } from "../supabaseClient";
import {
  CreateSessionRequest,
  SaveAnswersRequest,
  CaseType,
  RiskLevel,
} from "./types";

export class VisaCheckerSupabaseService {
  // Create a new assessment session
  static async createSession(request: CreateSessionRequest) {
    const { data, error } = await supabase
      .from("user_case_sessions")
      .insert({
        user_id: request.userId,
        user_email: request.userEmail,
        user_name: request.userName,
        case_type: request.caseType,
        risk_level: "PENDING" as RiskLevel,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return {
      sessionId: data.id,
      message: "Assessment session created successfully",
    };
  }

  // Save answers for a session
  static async saveAnswers(
    sessionId: string,
    answers: SaveAnswersRequest["answers"]
  ) {
    // First, delete existing answers for this session
    const { error: deleteError } = await supabase
      .from("user_case_answers")
      .delete()
      .eq("session_id", sessionId);

    if (deleteError) {
      throw new Error(
        `Failed to delete existing answers: ${deleteError.message}`
      );
    }

    // Prepare answer records
    const answerRecords = Object.entries(answers).map(
      ([questionKey, answerValue]) => ({
        session_id: sessionId,
        question_key: questionKey,
        answer_value: answerValue,
      })
    );

    // Insert new answers
    if (answerRecords.length > 0) {
      const { error: insertError } = await supabase
        .from("user_case_answers")
        .insert(answerRecords);

      if (insertError) {
        throw new Error(`Failed to save answers: ${insertError.message}`);
      }
    }

    return { message: "Answers saved successfully", sessionId };
  }

  // Get session details
  static async getSessionDetails(sessionId: string) {
    // Get session info
    const { data: sessionData, error: sessionError } = await supabase
      .from("user_case_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }

    if (!sessionData) {
      throw new Error("Session not found");
    }

    // Get answers
    const { data: answersData, error: answersError } = await supabase
      .from("user_case_answers")
      .select("question_key, answer_value")
      .eq("session_id", sessionId);

    if (answersError) {
      throw new Error(`Failed to get answers: ${answersError.message}`);
    }

    const answers: Record<string, unknown> = {};
    answersData.forEach((item) => {
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
      updatedAt: sessionData.updated_at,
    };
  }

  // Submit session for scoring
  static async submitForScoring(sessionId: string) {
    // Get current session and answers
    const sessionDetails = await this.getSessionDetails(sessionId);

    // Calculate score using the scoring rules
    const {
      totalScore,
      allRisks,
      riskLevel,
      summaryReasons,
      improvementSuggestions,
    } = await import("./scoring-rules").then((rules) => {
      return rules.ScoringRules.calculateTotalScore(sessionDetails.answers);
    });

    // Update session with calculated score
    const { error: updateError } = await supabase
      .from("user_case_sessions")
      .update({
        overall_score: totalScore,
        risk_level: riskLevel,
        summary_reasons: summaryReasons,
        improvement_suggestions: improvementSuggestions,
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    // Clear existing risk flags for this session
    const { error: deleteFlagsError } = await supabase
      .from("risk_flags")
      .delete()
      .eq("session_id", sessionId);

    if (deleteFlagsError) {
      throw new Error(
        `Failed to clear risk flags: ${deleteFlagsError.message}`
      );
    }

    // Insert new risk flags if any exist
    if (allRisks.length > 0) {
      const { RISK_POINTS_DEDUCTION } = await import("./scoring-config");
      const flagRecords = allRisks.map((flag) => ({
        session_id: sessionId,
        flag_code: flag.flagCode,
        severity: flag.severity,
        points_deducted: RISK_POINTS_DEDUCTION[flag.severity],
        explanation: flag.explanation,
        improvement_suggestions: flag.improvement,
        improvement_priority: this.getPriorityNumber(flag.severity),
      }));

      const { error: insertFlagsError } = await supabase
        .from("risk_flags")
        .insert(flagRecords);

      if (insertFlagsError) {
        throw new Error(
          `Failed to save risk flags: ${insertFlagsError.message}`
        );
      }
    }

    return {
      sessionId,
      overallScore: totalScore,
      riskLevel,
      riskFlags: allRisks,
      summaryReasons,
      improvementSuggestions,
    };
  }

  // Get scoring results
  static async getScoringResults(sessionId: string) {
    // Get session info
    const { data: sessionData, error: sessionError } = await supabase
      .from("user_case_sessions")
      .select("id, overall_score, risk_level, summary_reasons, improvement_suggestions, updated_at")
      .eq("id", sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }

    if (!sessionData) {
      throw new Error("Session not found or not scored yet");
    }

    // Get risk flags
    const { data: riskFlagsData, error: flagsError } = await supabase
      .from("risk_flags")
      .select("*")
      .eq("session_id", sessionId)
      .order("points_deducted", { ascending: false });

    if (flagsError) {
      throw new Error(`Failed to get risk flags: ${flagsError.message}`);
    }

    return {
      sessionId: sessionData.id,
      overallScore: sessionData.overall_score,
      riskLevel: sessionData.risk_level as RiskLevel,
      completedAt: sessionData.updated_at,
      riskFlags: riskFlagsData.map((flag) => ({
        flagCode: flag.flag_code,
        severity: flag.severity,
        pointsDeducted: flag.points_deducted,
        explanation: flag.explanation,
        improvementSuggestions: flag.improvement_suggestions,
      })),
      summaryReasons: sessionData.summary_reasons || [],
      improvementSuggestions: sessionData.improvement_suggestions || [],
    };
  }

  // Delete a session
  static async deleteSession(sessionId: string) {
    // Delete risk flags
    const { error: flagsError } = await supabase
      .from("risk_flags")
      .delete()
      .eq("session_id", sessionId);

    if (flagsError) {
      throw new Error(`Failed to delete risk flags: ${flagsError.message}`);
    }

    // Delete answers
    const { error: answersError } = await supabase
      .from("user_case_answers")
      .delete()
      .eq("session_id", sessionId);

    if (answersError) {
      throw new Error(`Failed to delete answers: ${answersError.message}`);
    }

    // Delete session
    const { error: sessionError } = await supabase
      .from("user_case_sessions")
      .delete()
      .eq("id", sessionId);

    if (sessionError) {
      throw new Error(`Failed to delete session: ${sessionError.message}`);
    }

    return {
      sessionId,
      deleted: true,
      message: "Session deleted successfully",
    };
  }

  /**
   * Convert severity to priority number (1=HIGH, 2=MEDIUM, 3=LOW)
   */
  private static getPriorityNumber(severity: string): number {
    switch (severity) {
      case "HIGH":
        return 1;
      case "MEDIUM":
        return 2;
      case "LOW":
        return 3;
      default:
        return 3;
    }
  }
}
