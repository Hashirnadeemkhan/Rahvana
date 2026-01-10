import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    // Use the service role client to bypass RLS policies
    // This requires the NEXT_SERVICE_ROLE_KEY environment variable to be set
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key
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

    // Get form data from request
    const formData = await req.json();

    // Extract the full name from given name and surname
    const fullName = `${formData.givenName} ${formData.surname}`;

    // Prepare appointment data for database insertion
    const appointmentData: any = {
      full_name: fullName,
      email: formData.email,
      phone_number: formData.primaryContact,
      medical_website: formData.location === 'islamabad' ?
        (formData.islamabadProvider === 'amc' ? 'AMC' : 'IOM') :
        `${formData.location.charAt(0).toUpperCase() + formData.location.slice(1)} - Wilcare Medical`,
      location: formData.location,
      provider: formData.islamabadProvider || null,
      appointment_type: formData.appointmentType,
      visa_type: formData.visaType,
      medical_type: formData.medicalType,
      surname: formData.surname,
      given_name: formData.givenName,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      passport_number: formData.passportNumber,
      passport_issue_date: formData.passportIssueDate ? new Date(formData.passportIssueDate).toISOString() : null,
      passport_expiry_date: formData.passportExpiryDate ? new Date(formData.passportExpiryDate).toISOString() : null,
      preferred_date: formData.preferredAppointmentDate ? new Date(formData.preferredAppointmentDate).toISOString() : null,
      preferred_time: formData.preferredTime,
      estimated_charges: formData.estimatedCharges,
      interview_date: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : null,
      visa_category: formData.visaCategory,
      had_medical_before: formData.hadMedicalBefore,
      city: formData.city,
      case_ref: formData.caseRef,
      number_of_applicants: formData.numberOfApplicants ? parseInt(formData.numberOfApplicants) : null,
      original_passport: formData.originalPassport,
      status: 'pending' // Default status
    };

    // Only add case_number if it exists in the form data
    if (formData.caseNumber && formData.caseNumber.trim() !== '') {
      appointmentData.case_number = formData.caseNumber;
    }

    // Insert appointment into database
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Error saving appointment:', error);
      return Response.json({ error: 'Failed to save appointment' }, { status: 500 });
    }

    // TODO: Send notification email
    // await sendAppointmentNotification({
    //   email: formData.email,
    //   fullName: fullName,
    //   medicalWebsite: 'Wilcare Medical Centre', // or appropriate provider
    //   appointmentType: formData.appointmentType,
    //   status: 'in_progress'
    // });

    return Response.json({
      success: true,
      id: data.id,
      message: 'Appointment request submitted successfully'
    });

  } catch (error) {
    console.error('Unexpected error in appointment submission:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}