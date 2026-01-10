import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[Profile API] GET request received");
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("[Profile API] User check:", { userId: user?.id, error: userError });

    if (userError || !user) {
      console.log("[Profile API] Unauthorized - no user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Profile API] Fetching profile for user:", user.id);
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log("[Profile API] Profile query result:", {
      profile,
      error: profileError,
      errorCode: profileError?.code
    });

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("[Profile API] Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    const response = {
      profile: profile || null,
      profileCompleted: profile?.profile_completed || false,
    };

    console.log("[Profile API] Returning response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Profile API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Convert camelCase to snake_case for database
    const profileData = {
      user_id: user.id,
      full_legal_name: body.fullLegalName,
      date_of_birth: body.dateOfBirth,
      place_of_birth: body.placeOfBirth,
      nationality: body.nationality,
      phone_number: body.phoneNumber,
      cnic: body.cnic,
      passport_number: body.passportNumber,
      passport_expiry: body.passportExpiry,
      physical_address: body.physicalAddress,
      contact_info: body.contactInfo,
      father_name: body.fatherName,
      father_dob: body.fatherDOB,
      mother_name: body.motherName,
      mother_dob: body.motherDOB,
      spouse_name: body.spouseName,
      spouse_dob: body.spouseDOB,
      siblings_count: body.siblingsCount ? parseInt(body.siblingsCount) : null,
      children_count: body.childrenCount ? parseInt(body.childrenCount) : null,
      visa_status: body.visaStatus,
      petitioner_name: body.petitionerName,
      case_number: body.caseNumber,
      travel_history: body.travelHistory,
      education_level: body.educationLevel,
      schools_attended: body.schoolsAttended,
      current_employer: body.currentEmployer,
      employer_address: body.employerAddress,
      position: body.position,
      start_date: body.startDate,
      previous_employers: body.previousEmployers,
      employment_gaps: body.employmentGaps,
      annual_income: body.annualIncome,
      sponsor_details: body.sponsorDetails,
      bank_statement: body.bankStatement,
      residence_history: body.residenceHistory,
      countries_visited: body.countriesVisited,
      long_term_stays: body.longTermStays,
      profile_completed: true,
      completed_at: new Date().toISOString(),
    };

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      // Insert new profile
      result = await supabase
        .from("user_profiles")
        .insert([profileData])
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error saving profile:", result.error);
      return NextResponse.json(
        { error: "Failed to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile saved successfully",
      profile: result.data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
