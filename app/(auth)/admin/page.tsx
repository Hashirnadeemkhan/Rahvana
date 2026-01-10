'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define types
type AppointmentStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  medical_website: string;
  location: string;
  provider: string;
  appointment_type: string;
  visa_type?: string;
  medical_type?: string;
  surname?: string;
  given_name?: string;
  gender?: string;
  date_of_birth?: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_expiry_date?: string;
  case_number?: string;
  preferred_date?: string;
  preferred_time?: string;
  estimated_charges?: string;
  interview_date?: string;
  visa_category?: string;
  had_medical_before?: string;
  city?: string;
  case_ref?: string;
  number_of_applicants?: number;
  original_passport?: string;
  status: AppointmentStatus;
  // Document URLs (these might not exist in your current schema)
  scanned_passport_url?: string;
  k_one_letter_url?: string;
  appointment_confirmation_letter_url?: string;
}

export default function AdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/appointments');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch appointments');
      }

      setAppointments(result.data || []);
      // The useEffect hook will handle updating filteredAppointments
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching appointments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch appointments: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Refresh appointments every 30 seconds to catch new submissions
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchAppointments]);

  // Filter appointments based on selected status
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(app => app.status === selectedStatus)
      );
    }
  }, [appointments, selectedStatus]);

  const updateAppointmentStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update appointment status');
      }

      // Refresh the appointments list to get the latest data
      fetchAppointments();

      console.log(`Appointment ${id} status updated to ${newStatus}`);
    } catch (err: unknown) {
      console.error('Error updating appointment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to update appointment status: ${errorMessage}`);
    }
  };

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'default'; // Changed from 'success' to 'default' to match allowed variants
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  // State to track expanded appointments
  const [expandedAppointments, setExpandedAppointments] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedAppointments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchAppointments} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage appointment bookings and track their status</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointment Management</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total: {appointments.length} appointments
              </div>
              <Select value={selectedStatus} onValueChange={(value: AppointmentStatus | 'all') => setSelectedStatus(value)}>
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchAppointments} variant="outline">
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedStatus === 'all'
                    ? 'No appointments found.'
                    : `No ${selectedStatus} appointments found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="shadow-sm">
                    <CardHeader
                      className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                      onClick={() => toggleExpand(appointment.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="font-medium">
                            <span className="font-bold">{appointment.full_name}</span>
                            <span className="text-gray-500 ml-2 text-sm">({appointment.email})</span>
                          </div>
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(appointment.created_at)} • {appointment.medical_website}
                          </div>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion when clicking refresh
                            fetchAppointments();
                          }}>
                            Refresh
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion when clicking expand/collapse
                            toggleExpand(appointment.id);
                          }}>
                            {expandedAppointments[appointment.id] ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedAppointments[appointment.id] && (
                      <CardContent className="p-4 pt-0 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-700">Personal Information</h4>
                            <p><span className="text-gray-500">Name:</span> {appointment.full_name}</p>
                            <p><span className="text-gray-500">Surname:</span> {appointment.surname || 'N/A'}</p>
                            <p><span className="text-gray-500">Given Name:</span> {appointment.given_name || 'N/A'}</p>
                            <p><span className="text-gray-500">Gender:</span> {appointment.gender || 'N/A'}</p>
                            <p><span className="text-gray-500">Date of Birth:</span> {formatDate(appointment.date_of_birth)}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">Contact Information</h4>
                            <p><span className="text-gray-500">Email:</span> {appointment.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {appointment.phone_number}</p>
                            <p><span className="text-gray-500">City:</span> {appointment.city || 'N/A'}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">Appointment Details</h4>
                            <p><span className="text-gray-500">Location:</span> {appointment.location}</p>
                            <p><span className="text-gray-500">Provider:</span> {appointment.provider || 'N/A'}</p>
                            <p><span className="text-gray-500">Website:</span> {appointment.medical_website}</p>
                            <p><span className="text-gray-500">Type:</span> {appointment.appointment_type}</p>
                            <p><span className="text-gray-500">Visa Type:</span> {appointment.visa_type || 'N/A'}</p>

                            {/* Show AMC-specific fields if this is an AMC appointment */}
                            {appointment.location === 'islamabad' && appointment.provider === 'amc' && (
                              <>
                                <p><span className="text-gray-500">Interview Date:</span> {formatDate(appointment.interview_date)}</p>
                                <p><span className="text-gray-500">Visa Category:</span> {appointment.visa_category || 'N/A'}</p>
                                <p><span className="text-gray-500">Had Medical Before:</span> {appointment.had_medical_before || 'N/A'}</p>
                                <p><span className="text-gray-500">City:</span> {appointment.city || 'N/A'}</p>
                                <p><span className="text-gray-500">Case Ref:</span> {appointment.case_ref || 'N/A'}</p>
                                <p><span className="text-gray-500">No. of Applicants:</span> {appointment.number_of_applicants || 'N/A'}</p>
                              </>
                            )}

                            {/* Show Wilcare-specific fields if this is a Wilcare appointment */}
                            {(appointment.location === 'karachi' || appointment.location === 'lahore') && (
                              <>
                                <p><span className="text-gray-500">Appointment Type:</span> {appointment.appointment_type || 'N/A'}</p>
                                <p><span className="text-gray-500">Visa Type:</span> {appointment.visa_type || 'N/A'}</p>
                                <p><span className="text-gray-500">Original Passport:</span> {appointment.original_passport || 'N/A'}</p>
                                <p><span className="text-gray-500">Medical Type:</span> {appointment.medical_type || 'N/A'}</p>
                                <p><span className="text-gray-500">Case Number:</span> {appointment.case_number || 'N/A'}</p>
                              </>
                            )}

                            {/* Show IOM-specific fields if this is an IOM appointment */}
                            {appointment.location === 'islamabad' && appointment.provider === 'iom' && (
                              <>
                                <p><span className="text-gray-500">Original Passport:</span> {appointment.original_passport || 'N/A'}</p>
                                <p><span className="text-gray-500">Medical Type:</span> {appointment.medical_type || 'N/A'}</p>
                                <p><span className="text-gray-500">Case Number:</span> {appointment.case_number || 'N/A'}</p>
                              </>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">Passport Information</h4>
                            <p><span className="text-gray-500">Passport Number:</span> {appointment.passport_number || 'N/A'}</p>
                            <p><span className="text-gray-500">Issue Date:</span> {formatDate(appointment.passport_issue_date)}</p>
                            <p><span className="text-gray-500">Expiry Date:</span> {formatDate(appointment.passport_expiry_date)}</p>
                            <p><span className="text-gray-500">Original Passport:</span> {appointment.original_passport || 'N/A'}</p>
                          </div>

                          {/* Show documents section for Wilcare appointments */}
                          {(appointment.location === 'karachi' || appointment.location === 'lahore') && (
                            <div>
                              <h4 className="font-semibold text-gray-700">Uploaded Documents</h4>
                              {appointment.scanned_passport_url ? (
                                <p>
                                  <span className="text-gray-500">Scanned Passport:</span>{' '}
                                  <a
                                    href={appointment.scanned_passport_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Download
                                  </a>
                                </p>
                              ) : (
                                <p><span className="text-gray-500">Scanned Passport:</span> Not uploaded</p>
                              )}

                              {appointment.k_one_letter_url ? (
                                <p>
                                  <span className="text-gray-500">K-1 Letter:</span>{' '}
                                  <a
                                    href={appointment.k_one_letter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Download
                                  </a>
                                </p>
                              ) : (
                                <p><span className="text-gray-500">K-1 Letter:</span> Not uploaded</p>
                              )}

                              {appointment.appointment_confirmation_letter_url ? (
                                <p>
                                  <span className="text-gray-500">Appointment Confirmation:</span>{' '}
                                  <a
                                    href={appointment.appointment_confirmation_letter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Download
                                  </a>
                                </p>
                              ) : (
                                <p><span className="text-gray-500">Appointment Confirmation:</span> Not uploaded</p>
                              )}
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold text-gray-700">Medical Details</h4>
                            <p><span className="text-gray-500">Medical Type:</span> {appointment.medical_type || 'N/A'}</p>
                            <p><span className="text-gray-500">Had Medical Before:</span> {appointment.had_medical_before || 'N/A'}</p>
                            <p><span className="text-gray-500">Interview Date:</span> {formatDate(appointment.interview_date)}</p>
                            <p><span className="text-gray-500">Visa Category:</span> {appointment.visa_category || 'N/A'}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">Scheduling</h4>
                            <p><span className="text-gray-500">Preferred Date:</span> {formatDate(appointment.preferred_date)}</p>
                            <p><span className="text-gray-500">Preferred Time:</span> {formatTime(appointment.preferred_time)}</p>
                            <p><span className="text-gray-500">Est. Charges:</span> {appointment.estimated_charges || 'N/A'}</p>
                            <p><span className="text-gray-500">No. of Applicants:</span> {appointment.number_of_applicants || 'N/A'}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">Case Information</h4>
                            <p><span className="text-gray-500">Case Number:</span> {appointment.case_number || 'N/A'}</p>
                            <p><span className="text-gray-500">Case Ref:</span> {appointment.case_ref || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex space-x-2">
                            <Select
                              value={appointment.status}
                              onValueChange={(value: AppointmentStatus) =>
                                updateAppointmentStatus(appointment.id, value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="text-sm text-gray-500">
                            Created: {formatDate(appointment.created_at)} at {new Date(appointment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}