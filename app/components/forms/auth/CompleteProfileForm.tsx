"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ProfileData {
  // Basic Personal Info
  fullLegalName: string
  placeOfBirth: string
  phoneNumber: string
  cnic: string
  passportNumber: string
  passportExpiry: string

  // Contact Information
  physicalAddress: string
  contactInfo: string

  // Family Details
  fatherName: string
  fatherDOB: string
  motherName: string
  motherDOB: string
  spouseName: string
  spouseDOB: string
  siblingsCount: string
  childrenCount: string

  // Immigration Info
  visaStatus: string
  petitionerName: string
  caseNumber: string
  travelHistory: string

  // Education
  educationLevel: string
  schoolsAttended: string

  // Employment
  currentEmployer: string
  employerAddress: string
  position: string
  startDate: string
  previousEmployers: string
  employmentGaps: string

  // Financial
  annualIncome: string
  sponsorDetails: string
  bankStatement: string

  // Travel & Residence
  residenceHistory: string
  countriesVisited: string
  longTermStays: string
}

export default function CompleteProfileForm() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<ProfileData>({
    fullLegalName: "",
    placeOfBirth: "",
    phoneNumber: "",
    cnic: "",
    passportNumber: "",
    passportExpiry: "",
    physicalAddress: "",
    contactInfo: "",
    fatherName: "",
    fatherDOB: "",
    motherName: "",
    motherDOB: "",
    spouseName: "",
    spouseDOB: "",
    siblingsCount: "",
    childrenCount: "",
    visaStatus: "",
    petitionerName: "",
    caseNumber: "",
    travelHistory: "",
    educationLevel: "",
    schoolsAttended: "",
    currentEmployer: "",
    employerAddress: "",
    position: "",
    startDate: "",
    previousEmployers: "",
    employmentGaps: "",
    annualIncome: "",
    sponsorDetails: "",
    bankStatement: "",
    residenceHistory: "",
    countriesVisited: "",
    longTermStays: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const sections = [
    {
      title: "Basic Personal Information",
      fields: [
        { name: "fullLegalName", label: "Full Legal Name", type: "text" },
        { name: "placeOfBirth", label: "Place of Birth", type: "text" },
        { name: "phoneNumber", label: "Phone Number", type: "tel" },
        { name: "cnic", label: "CNIC #", type: "text" },
        { name: "passportNumber", label: "Passport Number", type: "text" },
        { name: "passportExpiry", label: "Passport Expiry Date", type: "date" },
      ],
    },
    {
      title: "Contact & Family Information",
      fields: [
        { name: "physicalAddress", label: "Physical Address", type: "textarea" },
        { name: "contactInfo", label: "Contact Information", type: "text" },
        { name: "fatherName", label: "Father's Full Name", type: "text" },
        { name: "fatherDOB", label: "Father's Date of Birth", type: "date" },
        { name: "motherName", label: "Mother's Full Name", type: "text" },
        { name: "motherDOB", label: "Mother's Date of Birth", type: "date" },
        { name: "spouseName", label: "Spouse's Full Name (if applicable)", type: "text" },
        { name: "spouseDOB", label: "Spouse's Date of Birth", type: "date" },
        { name: "siblingsCount", label: "Number of Siblings", type: "number" },
        { name: "childrenCount", label: "Number of Children", type: "number" },
      ],
    },
    {
      title: "Immigration, Education & Employment",
      fields: [
        { name: "visaStatus", label: "Current Visa/Immigration Status", type: "text" },
        { name: "petitionerName", label: "U.S. Petitioner's Name (if any)", type: "text" },
        { name: "caseNumber", label: "Case Number (if any)", type: "text" },
        { name: "travelHistory", label: "Prior U.S. Travel History", type: "textarea" },
        { name: "educationLevel", label: "Highest Level of Education", type: "text" },
        { name: "schoolsAttended", label: "Schools Attended", type: "textarea" },
        { name: "currentEmployer", label: "Current Employer Name", type: "text" },
        { name: "employerAddress", label: "Employer Address", type: "textarea" },
        { name: "position", label: "Position/Job Title", type: "text" },
        { name: "startDate", label: "Employment Start Date", type: "date" },
        { name: "previousEmployers", label: "Previous Employers (last 5-10 years)", type: "textarea" },
        { name: "employmentGaps", label: "Employment Gaps (if any)", type: "textarea" },
        { name: "annualIncome", label: "Annual Income", type: "text" },
        { name: "sponsorDetails", label: "Sponsor Details (if applicable)", type: "textarea" },
        { name: "bankStatement", label: "Bank Statement/Assets Summary", type: "textarea" },
        { name: "residenceHistory", label: "All Addresses (past 5-10 years)", type: "textarea" },
        { name: "countriesVisited", label: "Countries Visited (last 5 years)", type: "textarea" },
        { name: "longTermStays", label: "Long-term Stays Abroad", type: "textarea" },
      ],
    },
  ]

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      setError("")
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Save complete profile
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    const updatedProfile = {
      ...existingProfile,
      completeProfile: formData,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    setLoading(false)
    router.push("/dashboard")
  }

  const currentSectionData = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <Card className="p-8 bg-white shadow-lg border-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentSectionData.title}</h2>
        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Section {currentSection + 1} of {sections.length}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSectionData.fields.map((field) => (
            <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name as keyof ProfileData]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof ProfileData]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Previous
          </Button>
          {currentSection === sections.length - 1 ? (
            <Button type="submit" disabled={loading} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
              {loading ? "Completing..." : "Complete Profile"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
              Next Section
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
