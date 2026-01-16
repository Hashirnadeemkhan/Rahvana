import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;

    const response = await VisaCheckerSupabaseService.deleteSession(sessionId);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to delete session" }),
      { status: 500 }
    );
  }
}
