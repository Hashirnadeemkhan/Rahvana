'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  scanned_passport_url?: string;
  k_one_letter_url?: string;
  appointment_confirmation_letter_url?: string;
}

export default function AdminPanel() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAppointments, setExpandedAppointments] = useState<Record<string, boolean>>({});

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/appointments');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch appointments');
      }

      setAppointments(result.data || []);
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching appointments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch appointments: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAppointments();
    }
  }, [user, isAdmin, fetchAppointments]);

  // Removed auto-refresh - admin can manually refresh using the Refresh button
  // useEffect(() => {
  //   if (user && isAdmin) {
  //     const interval = setInterval(() => {
  //       fetchAppointments();
  //     }, 30000);
  //     return () => clearInterval(interval);
  //   }
  // }, [user, isAdmin, fetchAppointments]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update appointment status');
      }

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
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleExpand = (id: string) => {
    setExpandedAppointments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">You do not have permission to access the admin panel.</p>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchAppointments} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage appointment bookings and track their status</p>
        </div>

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
              <Button onClick={fetchAppointments} variant="outline">Refresh</Button>
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
                  {selectedStatus === 'all' ? 'No appointments found.' : `No ${selectedStatus} appointments found.`}
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
                            e.stopPropagation();
                            toggleExpand(appointment.id);
                          }}>
                            {expandedAppointments[appointment.id] ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedAppointments[appointment.id] && (
                      <CardContent className="p-6 pt-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {/* Personal Information */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                              Personal Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-600">Full Name:</span> <span className="font-medium">{appointment.full_name}</span></p>
                              <p><span className="text-gray-600">Surname:</span> <span className="font-medium">{appointment.surname || 'N/A'}</span></p>
                              <p><span className="text-gray-600">Given Name:</span> <span className="font-medium">{appointment.given_name || 'N/A'}</span></p>
                              <p><span className="text-gray-600">Gender:</span> <span className="font-medium">{appointment.gender || 'N/A'}</span></p>
                              <p><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{formatDate(appointment.date_of_birth)}</span></p>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                              </svg>
                              Contact Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-600">Email:</span> <span className="font-medium">{appointment.email}</span></p>
                              <p><span className="text-gray-600">Phone:</span> <span className="font-medium">+92 {appointment.phone_number}</span></p>
                              {appointment.city && <p><span className="text-gray-600">City:</span> <span className="font-medium">{appointment.city}</span></p>}
                            </div>
                          </div>

                          {/* Appointment Details */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              Appointment Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-600">Location:</span> <span className="font-medium capitalize">{appointment.location}</span></p>
                              <p><span className="text-gray-600">Provider:</span> <span className="font-medium">{appointment.provider || 'N/A'}</span></p>
                              <p><span className="text-gray-600">Website:</span> <span className="font-medium">{appointment.medical_website}</span></p>
                              {appointment.appointment_type && <p><span className="text-gray-600">Type:</span> <span className="font-medium">{appointment.appointment_type}</span></p>}
                              {appointment.visa_type && <p><span className="text-gray-600">Visa Type:</span> <span className="font-medium">{appointment.visa_type}</span></p>}
                              {appointment.medical_type && <p><span className="text-gray-600">Medical Type:</span> <span className="font-medium">{appointment.medical_type}</span></p>}
                              {appointment.original_passport && <p><span className="text-gray-600">Original Passport:</span> <span className="font-medium">{appointment.original_passport}</span></p>}
                            </div>
                          </div>

                          {/* AMC Specific Fields */}
                          {appointment.location === 'islamabad' && appointment.provider === 'amc' && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">AMC</span>
                                AMC Specific Info
                              </h4>
                              <div className="space-y-2 text-sm">
                                {appointment.interview_date && <p><span className="text-gray-600">Interview Date:</span> <span className="font-medium">{formatDate(appointment.interview_date)}</span></p>}
                                {appointment.visa_category && <p><span className="text-gray-600">Visa Category:</span> <span className="font-medium">{appointment.visa_category}</span></p>}
                                {appointment.had_medical_before && <p><span className="text-gray-600">Had Medical Before:</span> <span className="font-medium">{appointment.had_medical_before}</span></p>}
                                {appointment.case_ref && <p><span className="text-gray-600">Case Ref:</span> <span className="font-medium">{appointment.case_ref}</span></p>}
                                {appointment.number_of_applicants && <p><span className="text-gray-600">No. of Applicants:</span> <span className="font-medium">{appointment.number_of_applicants}</span></p>}
                              </div>
                            </div>
                          )}

                          {/* Passport Information */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              Passport Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-600">Passport Number:</span> <span className="font-medium">{appointment.passport_number || 'N/A'}</span></p>
                              <p><span className="text-gray-600">Issue Date:</span> <span className="font-medium">{formatDate(appointment.passport_issue_date)}</span></p>
                              <p><span className="text-gray-600">Expiry Date:</span> <span className="font-medium">{formatDate(appointment.passport_expiry_date)}</span></p>
                              {appointment.case_number && <p><span className="text-gray-600">Case Number:</span> <span className="font-medium">{appointment.case_number}</span></p>}
                            </div>
                          </div>

                          {/* Documents - For Wilcare only */}
                          {(appointment.location === 'karachi' || appointment.location === 'lahore') && (
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                Uploaded Documents
                              </h4>
                              <div className="space-y-2 text-sm">
                                {appointment.scanned_passport_url ? (
                                  <p>
                                    <span className="text-gray-600">Scanned Passport:</span>{' '}
                                    <a href={appointment.scanned_passport_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                      View Document
                                    </a>
                                  </p>
                                ) : (
                                  <p><span className="text-gray-600">Scanned Passport:</span> <span className="text-red-500">Not uploaded</span></p>
                                )}

                                {appointment.k_one_letter_url ? (
                                  <p>
                                    <span className="text-gray-600">K-1 Letter:</span>{' '}
                                    <a href={appointment.k_one_letter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                      View Document
                                    </a>
                                  </p>
                                ) : (
                                  <p><span className="text-gray-600">K-1 Letter:</span> <span className="text-gray-400">Not uploaded</span></p>
                                )}

                                {appointment.appointment_confirmation_letter_url ? (
                                  <p>
                                    <span className="text-gray-600">Confirmation Letter:</span>{' '}
                                    <a href={appointment.appointment_confirmation_letter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                      View Document
                                    </a>
                                  </p>
                                ) : (
                                  <p><span className="text-gray-600">Confirmation Letter:</span> <span className="text-gray-400">Not uploaded</span></p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Scheduling */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Scheduling
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-gray-600">Preferred Date:</span> <span className="font-medium">{formatDate(appointment.preferred_date)}</span></p>
                              <p><span className="text-gray-600">Preferred Time:</span> <span className="font-medium">{appointment.preferred_time || 'N/A'}</span></p>
                              {appointment.estimated_charges && <p><span className="text-gray-600">Est. Charges:</span> <span className="font-medium">{appointment.estimated_charges}</span></p>}
                            </div>
                          </div>
                        </div>

                        {/* Status Update Section */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Update Status:</label>
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
                            <p>Created: {formatDate(appointment.created_at)} at {new Date(appointment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {appointment.updated_at !== appointment.created_at && (
                              <p>Updated: {formatDate(appointment.updated_at)} at {new Date(appointment.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            )}
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
      </div>
    </div>
  );
}