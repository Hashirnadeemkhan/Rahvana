import { createClient } from "../supabase/server";
import {
  InterviewSession,
  InterviewAnswer,
  InterviewResult,
  InterviewSessionInput,
} from "./types";

// Creates a new interview prep session
export async function createInterviewSessionDB(
  sessionData: InterviewSessionInput,
): Promise<InterviewSession> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_sessions")
    .insert([
      {
        user_id: sessionData.user_id,
        user_email: sessionData.user_email,
        user_name: sessionData.user_name,
        case_type: sessionData.case_type,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create interview session: ${error.message}`);
  }

  return data as InterviewSession;
}

// Retrieves an interview prep session by ID
export async function getInterviewSessionDB(
  sessionId: string,
): Promise<InterviewSession | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    throw new Error(`Failed to fetch interview session: ${error.message}`);
  }

  return data as InterviewSession;
}

// Updates an interview prep session
export async function updateInterviewSessionDB(
  sessionId: string,
  updateData: Partial<InterviewSession>,
): Promise<InterviewSession> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_sessions")
    .update(updateData)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview session: ${error.message}`);
  }

  return data as InterviewSession;
}

// Saves multiple interview answers for a session
export async function saveInterviewAnswersDB(
  sessionId: string,
  answers: Array<{ question_key: string; answer_value: unknown }>,
): Promise<void> {
  const supabase = await createClient();

  // Prepare answers for bulk insert/update
  const answersToInsert = answers.map((answer) => ({
    session_id: sessionId,
    question_key: answer.question_key,
    answer_value: answer.answer_value,
  }));

  // Use upsert to handle both new and existing answers
  const { error } = await supabase
    .from("interview_prep_answers")
    .upsert(answersToInsert, {
      onConflict: "session_id, question_key",
    });

  if (error) {
    throw new Error(`Failed to save interview answers: ${error.message}`);
  }
}

// Retrieves all answers for a specific session
export async function getSessionAnswersDB(
  sessionId: string,
): Promise<InterviewAnswer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_answers")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Failed to fetch session answers: ${error.message}`);
  }

  return data as InterviewAnswer[];
}

// Saves the generated interview prep results
export async function saveInterviewResultsDB(
  sessionId: string,
  generatedQuestions: unknown[],
): Promise<InterviewResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_results")
    .upsert(
      {
        session_id: sessionId,
        generated_questions: generatedQuestions,
      },
      {
        onConflict: "session_id",
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save interview results: ${error.message}`);
  }

  return data as InterviewResult;
}

// Retrieves the generated interview prep results for a session
export async function getInterviewResultsDB(
  sessionId: string,
): Promise<InterviewResult | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interview_prep_results")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    throw new Error(`Failed to fetch interview results: ${error.message}`);
  }

  return data as InterviewResult;
}