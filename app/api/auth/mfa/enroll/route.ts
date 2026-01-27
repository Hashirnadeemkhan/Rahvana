import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For users with existing unverified factors, we need to try to unenroll them first
    try {
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (!factorsError && factorsData?.totp) {
        console.log(`Found ${factorsData.totp.length} existing TOTP factors`);
        
        // Try to unenroll any existing unverified factors
        for (const factor of factorsData.totp) {
          console.log(`Attempting to unenroll factor: ${factor.id}, status: ${factor.status}`);
          
          // Try to unenroll the factor (regardless of status)
          const { error: unenrollError } = await supabase.auth.mfa.unenroll({
            factorId: factor.id
          });
          
          if (unenrollError) {
            console.error(`Error unenrolling factor ${factor.id}:`, unenrollError);
          } else {
            console.log(`Successfully unenrolled factor: ${factor.id}`);
          }
        }
      }
    } catch (listError) {
      console.error('Error listing factors (might require AAL2):', listError);
    }

    // Enroll MFA factor with a friendly name
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator App",
    });

    if (error) {
      console.error("MFA enroll error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      },
    });
  } catch (error) {
    console.error("MFA enroll error:", error);
    return NextResponse.json(
      { error: "Failed to initiate MFA setup" },
      { status: 500 },
    );
  }
}
