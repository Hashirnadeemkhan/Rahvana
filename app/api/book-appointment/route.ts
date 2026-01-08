import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get form data from request
    const formData = await req.json();
    
    // Extract the full name from given name and surname
    const fullName = `${formData.givenName} ${formData.surname}`;
    
    // Prepare appointment data for database insertion
    const appointmentData = {
      full_name: fullName,
      email: formData.email,
      phone: formData.primaryContact,
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
      case_number: formData.caseNumber,
      preferred_date: formData.preferredAppointmentDate ? new Date(formData.preferredAppointmentDate).toISOString() : null,
      preferred_time: formData.preferredTime,
      estimated_charges: formData.estimatedCharges,
      interview_date: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : null,
      visa_category: formData.visaCategory,
      had_medical_before: formData.hadMedicalBefore,
      city: formData.city,
      case_ref: formData.caseRef,
      number_of_applicants: formData.numberOfApplicants ? parseInt(formData.numberOfApplicants) : null,
      status: 'pending' // Default status
    };

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