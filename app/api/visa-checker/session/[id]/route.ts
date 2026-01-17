import { NextRequest } from "next/server";
import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";
import { SessionDetailsResponse } from "@/lib/visa-checker/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const response: SessionDetailsResponse =
      await VisaCheckerSupabaseService.getSessionDetails(sessionId);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to fetch session details" }),
      { status: 500 }
    );
  }
}
