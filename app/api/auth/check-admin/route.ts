// app/api/auth/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Specific admin email - ONLY this email has admin access
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'khashir657@gmail.com';

// Create admin client with service role
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
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use service role to bypass RLS and get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { isAdmin: false },
        { status: 200 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { isAdmin: false },
        { status: 200 }
      );
    }

    // Check if email matches admin email AND role is admin
    const isAdmin = profile.email === ADMIN_EMAIL && profile.role === 'admin';

    return NextResponse.json({
      isAdmin,
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}