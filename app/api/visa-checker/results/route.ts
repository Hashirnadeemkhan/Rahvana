import { NextRequest } from "next/server";
import { VisaCheckerSupabaseService } from "@/lib/visa-checker/supabase";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await VisaCheckerSupabaseService.getUserRequests(email);

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return Response.json(
      { error: "Failed to fetch user requests" },
      { status: 500 },
    );
  }
}
