import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: NextRequest) {
  try {
    // Use service role client for admin access
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll(cookiesToSet) {
            // Do nothing for server-side operations
          },
        }
      }
    );

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        created_at,
        updated_at,
        full_name,
        email,
        phone_number,
        medical_website,
        location,
        provider,
        appointment_type,
        visa_type,
        medical_type,
        surname,
        given_name,
        gender,
        date_of_birth,
        passport_number,
        passport_issue_date,
        passport_expiry_date,
        case_number,
        preferred_date,
        preferred_time,
        estimated_charges,
        interview_date,
        visa_category,
        had_medical_before,
        city,
        case_ref,
        number_of_applicants,
        original_passport,
        status,
        scanned_passport_url,
        k_one_letter_url,
        appointment_confirmation_letter_url
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Unexpected error in fetching appointments:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use service role client for admin access
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll(cookiesToSet) {
            // Do nothing for server-side operations
          },
        }
      }
    );

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment status:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in updating appointment:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}