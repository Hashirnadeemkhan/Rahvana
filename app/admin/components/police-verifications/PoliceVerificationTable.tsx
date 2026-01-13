"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button as UIButton } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Phone,
  CreditCard,
  Calendar,
  User,
  Upload,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface PoliceVerificationRequest {
  id: string;
  request_id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  father_name: string;
  email: string;
  phone_number: string;
  dob?: string;
  gender?: string;
  cnic: string;
  cnic_issue_date?: string;
  cnic_expiry_date?: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_expiry_date?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  province: string;
  district: string;
  purpose: string;
  delivery_type: string;
  current_address?: string;
  stay_from?: string;
  stay_to?: string;
  residing_in?: string;
  residing_country?: string;
  target_country?: string;
  was_arrested: boolean;
  fir_no?: string;
  fir_year?: string;
  police_station?: string;
  arrest_status?: string;
  witness1_name?: string;
  witness1_father?: string;
  witness1_cnic?: string;
  witness1_contact?: string;
  witness1_address?: string;
  witness2_name?: string;
  witness2_father?: string;
  witness2_cnic?: string;
  witness2_contact?: string;
  witness2_address?: string;
  photograph_url?: string;
  passport_copy_url?: string;
  utility_bill_url?: string;
  police_letter_url?: string;
  judgment_copy_url?: string;
}

type VerificationStatus = "pending" | "in_progress" | "completed" | "cancelled";

export default function PoliceVerificationTable() {
  const [policeVerifications, setPoliceVerifications] = useState<
    PoliceVerificationRequest[]
  >([]);
  const [filteredPoliceVerifications, setFilteredPoliceVerifications] =
    useState<PoliceVerificationRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    VerificationStatus | "all"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequests, setExpandedRequests] = useState<
    Record<string, boolean>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPoliceVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/police-verifications");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch police verifications");
      }

      setPoliceVerifications(result.data || []);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching police verifications:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to fetch police verifications: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoliceVerifications();
  }, [fetchPoliceVerifications]);

  useEffect(() => {
    let filtered = [...policeVerifications];

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((pv) => pv.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pv) =>
          pv.request_id.toLowerCase().includes(term) ||
          pv.full_name.toLowerCase().includes(term) ||
          pv.email.toLowerCase().includes(term) ||
          pv.phone_number.toLowerCase().includes(term) ||
          pv.cnic.toLowerCase().includes(term)
      );
    }

    setFilteredPoliceVerifications(filtered);
  }, [policeVerifications, selectedStatus, searchTerm]);

  const updateStatus = async (id: string, newStatus: VerificationStatus) => {
    try {
      const response = await fetch("/api/admin/police-verifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update status");
      }

      fetchPoliceVerifications();
    } catch (err: unknown) {
      console.error("Error updating status:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to update status: ${errorMessage}`);
    }
  };

  const getStatusBadgeVariant = (status: VerificationStatus) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const toggleExpand = (id: string) => {
    setExpandedRequests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (error) {
    return (
      <Card className="max-w-7xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <UIButton onClick={fetchPoliceVerifications} className="mt-4">
            Retry
          </UIButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policeVerifications.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {policeVerifications.filter((a) => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                policeVerifications.filter((a) => a.status === "in_progress")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                policeVerifications.filter((a) => a.status === "completed")
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Police Verification Requests</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ID, name, email, CNIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <div className="text-sm text-gray-500">
              Total: {policeVerifications.length}
            </div>
            <Select
              value={selectedStatus}
              onValueChange={(value: VerificationStatus | "all") =>
                setSelectedStatus(value)
              }
            >
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
            <UIButton onClick={fetchPoliceVerifications} variant="outline">
              Refresh
            </UIButton>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading requests...</p>
            </div>
          ) : filteredPoliceVerifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {selectedStatus === "all"
                  ? "No records found."
                  : `No ${selectedStatus} records found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPoliceVerifications.map((pv) => (
                <Card key={pv.id} className="shadow-sm">
                  <CardHeader
                    className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    onClick={() => toggleExpand(pv.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">
                          <span className="font-bold">{pv.request_id}</span>
                          <span className="text-gray-500 ml-2 text-sm">
                            - {pv.full_name}
                          </span>
                        </div>
                        <Badge variant={getStatusBadgeVariant(pv.status)}>
                          {pv.status.charAt(0).toUpperCase() +
                            pv.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          {pv.province} • {formatDate(pv.created_at)}
                        </div>
                        <UIButton
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(pv.id);
                          }}
                        >
                          {expandedRequests[pv.id] ? "Collapse" : "Expand"}
                        </UIButton>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedRequests[pv.id] && (
                    <CardContent className="p-6 pt-4 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Applicant Details */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-teal-600" />
                            Applicant Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-600">Name:</span>{" "}
                              <span className="font-medium">
                                {pv.full_name}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">
                                Father Name:
                              </span>{" "}
                              <span className="font-medium">
                                {pv.father_name}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Gender:</span>{" "}
                              <span className="font-medium">
                                {pv.gender || "N/A"}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">DOB:</span>{" "}
                              <span className="font-medium">
                                {formatDate(pv.dob)}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">CNIC:</span>{" "}
                              <span className="font-medium">{pv.cnic}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">CNIC Issue:</span>{" "}
                              <span className="font-medium">
                                {formatDate(pv.cnic_issue_date)}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">
                                CNIC Expiry:
                              </span>{" "}
                              <span className="font-medium">
                                {formatDate(pv.cnic_expiry_date)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Contact & Request Info */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-teal-600" />
                            Contact & Request Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-600">Contact:</span>{" "}
                              <span className="font-medium">
                                {pv.phone_number}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Email:</span>{" "}
                              <span className="font-medium">{pv.email}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">Province:</span>{" "}
                              <span className="font-medium">{pv.province}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">District:</span>{" "}
                              <span className="font-medium">{pv.district}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">Purpose:</span>{" "}
                              <span className="font-medium">{pv.purpose}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">Delivery:</span>{" "}
                              <span className="font-medium">
                                {pv.delivery_type}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Stay & Passport */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-teal-600" />
                            Stay & Passport
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-600">Passport:</span>{" "}
                              <span className="font-medium">
                                {pv.passport_number || "N/A"}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Stay From:</span>{" "}
                              <span className="font-medium">
                                {formatDate(pv.stay_from)}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Stay To:</span>{" "}
                              <span className="font-medium">
                                {formatDate(pv.stay_to)}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Residing:</span>{" "}
                              <span className="font-medium">
                                {pv.residing_in}
                              </span>
                            </p>
                            {pv.residing_country && (
                              <p>
                                <span className="text-gray-600">
                                  Residing Country:
                                </span>{" "}
                                <span className="font-medium">
                                  {pv.residing_country}
                                </span>
                              </p>
                            )}
                            <p>
                              <span className="text-gray-600">Target:</span>{" "}
                              <span className="font-medium">
                                {pv.target_country}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Current Address */}
                        <div className="bg-slate-50 p-4 rounded-lg col-span-1 md:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Current Address
                          </h4>
                          <p className="text-sm">{pv.current_address}</p>
                        </div>

                        {/* Arrest History */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-600" />
                            Arrest History
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-600">Arrested:</span>{" "}
                              <span className="font-medium text-red-600">
                                {pv.was_arrested ? "YES" : "No"}
                              </span>
                            </p>
                            {pv.was_arrested && (
                              <>
                                <p>
                                  <span className="text-gray-600">FIR No:</span>{" "}
                                  <span className="font-medium">
                                    {pv.fir_no}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-gray-600">Year:</span>{" "}
                                  <span className="font-medium">
                                    {pv.fir_year}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Station:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {pv.police_station}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-gray-600">Status:</span>{" "}
                                  <span className="font-medium">
                                    {pv.arrest_status}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Witness Details */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 col-span-1 md:col-span-3">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Witness Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-green-200 rounded p-3 bg-white">
                              <h5 className="font-medium mb-2 border-b pb-1">
                                Witness 1
                              </h5>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="text-gray-600">Name:</span>{" "}
                                  {pv.witness1_name}
                                </p>
                                <p>
                                  <span className="text-gray-600">Father:</span>{" "}
                                  {pv.witness1_father}
                                </p>
                                <p>
                                  <span className="text-gray-600">CNIC:</span>{" "}
                                  {pv.witness1_cnic}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Contact:
                                  </span>{" "}
                                  {pv.witness1_contact}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Address:
                                  </span>{" "}
                                  {pv.witness1_address}
                                </p>
                              </div>
                            </div>
                            <div className="border border-green-200 rounded p-3 bg-white">
                              <h5 className="font-medium mb-2 border-b pb-1">
                                Witness 2
                              </h5>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="text-gray-600">Name:</span>{" "}
                                  {pv.witness2_name}
                                </p>
                                <p>
                                  <span className="text-gray-600">Father:</span>{" "}
                                  {pv.witness2_father}
                                </p>
                                <p>
                                  <span className="text-gray-600">CNIC:</span>{" "}
                                  {pv.witness2_cnic}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Contact:
                                  </span>{" "}
                                  {pv.witness2_contact}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Address:
                                  </span>{" "}
                                  {pv.witness2_address}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Uploaded Documents */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-purple-600" />
                            Uploaded Documents
                          </h4>
                          <div className="space-y-2 text-sm">
                            {pv.photograph_url && (
                              <a
                                href={pv.photograph_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline font-medium"
                              >
                                Photograph
                              </a>
                            )}
                            {pv.passport_copy_url && (
                              <a
                                href={pv.passport_copy_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline font-medium"
                              >
                                Passport Copy
                              </a>
                            )}
                            {pv.utility_bill_url && (
                              <a
                                href={pv.utility_bill_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline font-medium"
                              >
                                Utility Bill
                              </a>
                            )}
                            {pv.police_letter_url && (
                              <a
                                href={pv.police_letter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline font-medium"
                              >
                                Police Letter
                              </a>
                            )}
                            {pv.judgment_copy_url && (
                              <a
                                href={pv.judgment_copy_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline font-medium"
                              >
                                Judgment Copy
                              </a>
                            )}
                            {!pv.photograph_url &&
                              !pv.passport_copy_url &&
                              !pv.utility_bill_url &&
                              !pv.police_letter_url &&
                              !pv.judgment_copy_url && (
                                <p className="text-gray-400">
                                  No documents uploaded
                                </p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Status Update Footer */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <label className="text-sm font-medium text-gray-700">
                            Update Status:
                          </label>
                          <Select
                            value={pv.status}
                            onValueChange={(value: VerificationStatus) =>
                              updateStatus(pv.id, value)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>Created: {formatDate(pv.created_at)}</p>
                          {pv.updated_at !== pv.created_at && (
                            <p>Updated: {formatDate(pv.updated_at)}</p>
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
  );
}
