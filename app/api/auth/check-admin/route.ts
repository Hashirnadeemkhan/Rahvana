// app/api/auth/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Specific admin emails - ONLY these emails have admin access
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'hammadnooralam@gmail.com').split(',').map(email => email.trim());

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
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { isAdmin: false },
        { status: 200 }
      );
    }

    // Check if email is in admin emails list AND role is admin
    const isAdmin = ADMIN_EMAILS.includes(profile.email) && profile.role === 'admin';

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