import { NextRequest } from "next/server";
import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const response =
      await VisaCheckerSupabaseService.getScoringResults(sessionId);

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching scoring results:", error);
    return Response.json(
      { error: "Failed to fetch scoring results" },
      { status: 500 }
    );
  }
}
