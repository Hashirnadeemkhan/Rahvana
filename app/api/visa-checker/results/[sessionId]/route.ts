import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;

    const response = await VisaCheckerSupabaseService.getScoringResults(
      sessionId
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching scoring results:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to fetch scoring results" }),
      { status: 500 }
    );
  }
}
