// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, getEmailConfirmationHtml } from "@/lib/email/resend";
import crypto from "crypto";

// Create admin client for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Generate email confirmation token
    const confirmToken = crypto.randomBytes(32).toString("hex");
    const confirmTokenHash = crypto
      .createHash("sha256")
      .update(confirmToken)
      .digest("hex");
    const confirmTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with Supabase Admin (email not confirmed yet)
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: {
          confirm_token_hash: confirmTokenHash,
          confirm_token_expiry: confirmTokenExpiry.toISOString(),
        },
      });

    if (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: createError.message || "Failed to create account" },
        { status: 500 }
      );
    }

    // Wait a moment for the database trigger to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if profile exists (created by trigger), if not create it
    if (newUser?.user?.id) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', newUser.user.id)
        .single();

      if (!existingProfile) {
        // Only create profile if trigger didn't create it
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert([{
            id: newUser.user.id,
            email: email,
            full_name: email.split('@')[0],
            role: 'user'
          }], {
            onConflict: 'id'
          });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // Continue anyway - profile can be created later
        }
      }
    }

    // Build confirmation URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";
    const confirmLink = `${baseUrl}/api/auth/confirm-email?token=${confirmToken}&email=${encodeURIComponent(email)}`;

    // Send confirmation email via Resend
    const emailHtml = getEmailConfirmationHtml(confirmLink);
    const { success, error: emailError } = await sendEmail({
      to: email,
      subject: "Confirm Your Email - Rahvana",
      html: emailHtml,
    });

    if (!success) {
      console.error("Email send failed:", emailError);
      // Delete the user if email fails to send
      if (newUser?.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      }
      return NextResponse.json(
        { error: "Failed to send confirmation email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Please check your email to confirm your account",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}