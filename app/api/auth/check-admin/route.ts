// app/api/auth/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Specific admin emails - ONLY these emails have admin access
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'hammadnooralam@gmail.com').split(',').map(email => email.trim());

export async function POST(request: NextRequest) {
  try {
    // Check if body is readable
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { userId } = await request.json().catch(() => ({ userId: null }));

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables for admin check');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Use service role to bypass RLS and get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile for admin check:', profileError);
      return NextResponse.json(
        { isAdmin: false },
        { status: 200 } // Not an error, just not an admin or profile not found
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