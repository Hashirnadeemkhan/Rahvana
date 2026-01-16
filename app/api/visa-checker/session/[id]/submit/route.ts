import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";

export async function POST(
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    const response = await VisaCheckerSupabaseService.submitForScoring(
      sessionId,
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to submit questionnaire" }),
      { status: 500 }
    );
  }
}
