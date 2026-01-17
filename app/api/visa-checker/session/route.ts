import { NextRequest } from "next/server";
import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";
import { CreateSessionRequest } from "@/lib/visa-checker/types";

export async function POST(request: NextRequest) {
  try {
    const reqBody: CreateSessionRequest = await request.json();

    const response = await VisaCheckerSupabaseService.createSession(reqBody);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message || "Failed to create session" }),
      { status: 500 }
    );
  }
}
