import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { factorId, code } = await request.json();

    // Validate input
    if (!factorId || !code) {
      return NextResponse.json(
        { error: "Missing factorId or code" },
        { status: 400 },
      );
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create challenge
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId,
      });

    if (challengeError) {
      console.error("MFA challenge error:", challengeError);
      return NextResponse.json(
        { error: challengeError.message },
        { status: 400 },
      );
    }

    // Verify the code
    const { data: verifyData, error: verifyError } =
      await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

    if (verifyError) {
      console.error("MFA verify error:", verifyError);
      return NextResponse.json({ error: verifyError.message }, { status: 400 });
    }

    // After successful verification, the factor should now be active
    // Let's verify it's properly enrolled by checking the factors
    const { data: updatedFactors, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) {
      console.error("Error listing factors after verification:", listError);
      return NextResponse.json({ error: "Failed to verify factor enrollment" }, { status: 500 });
    }
    
    console.log("Factors after verification:", updatedFactors);
    
    // Verify that we have at least one verified factor
    const verifiedFactor = updatedFactors?.totp?.find(factor => factor.status === "verified");
    if (!verifiedFactor) {
      console.error("No verified factor found after verification");
      return NextResponse.json({ error: "Factor verification failed - no verified factor found" }, { status: 500 });
    }

    // Update user profile to mark MFA as enabled
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        mfa_enabled: true,
        mfa_enrolled_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile with MFA status:", updateError);
      // Don't fail the operation if profile update fails
    }

    return NextResponse.json({
      success: true,
      message: "MFA enabled successfully",
    });
  } catch (error) {
    console.error("MFA verify enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to verify MFA setup" },
      { status: 500 },
    );
  }
}
