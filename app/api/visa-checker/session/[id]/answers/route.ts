import { NextRequest } from "next/server";
import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";
import { SaveAnswersRequest } from "@/lib/visa-checker/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const reqBody: SaveAnswersRequest = await request.json();

    const response = await VisaCheckerSupabaseService.saveAnswers(
      sessionId,
      reqBody.answers
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to save answers" }),
      { status: 500 }
    );
  }
}
