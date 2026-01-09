"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Location = "karachi" | "lahore" | "islamabad";
type IslamabadProvider = "amc" | "iom";
type Gender = "M" | "F" | "Other";

interface FormData {
  location: Location | "";
  islamabadProvider: IslamabadProvider | "";
  primaryContact: string;
  email: string;
  appointmentType: string;
  visaType: string;
  originalPassport: string;
  medicalType: string;
  surname: string;
  givenName: string;
  gender: Gender | "";
  dateOfBirth: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  caseNumber: string;
  scannedPassport?: File | null;
  kOneLetter?: File | null;
  appointmentConfirmationLetter?: File | null;
  estimatedCharges: string;
  preferredAppointmentDate: string;
  preferredTime: string;
  interviewDate: string;
  visaCategory: string;
  hadMedicalBefore: string;
  city: string;
  caseRef: string;
  numberOfApplicants: string;
}

interface LocationStepProps {
  formData: FormData;
  error: string | null;
  onLocationChange: (location: Location) => void;
  onProviderChange: (provider: IslamabadProvider) => void;
  onNext: () => void;
}

const LocationStep = ({ formData, error, onLocationChange, onProviderChange, onNext }: LocationStepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Location</h2>
    <p className="text-slate-600 mb-8">Please select the city where you want to book your appointment:</p>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          className={`p-6 border-2 rounded-xl text-center transition-all ${
            formData.location === "karachi" ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-400"
          }`}
          onClick={() => onLocationChange("karachi")}
        >
          <h3 className="font-semibold text-lg mb-2">Karachi</h3>
          <p className="text-sm text-slate-600">Wilcare Medical Centre</p>
        </button>

        <button
          type="button"
          className={`p-6 border-2 rounded-xl text-center transition-all ${
            formData.location === "lahore" ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-400"
          }`}
          onClick={() => onLocationChange("lahore")}
        >
          <h3 className="font-semibold text-lg mb-2">Lahore</h3>
          <p className="text-sm text-slate-600">Wilcare Medical Centre</p>
        </button>

        <button
          type="button"
          className={`p-6 border-2 rounded-xl text-center transition-all ${
            formData.location === "islamabad" ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-400"
          }`}
          onClick={() => onLocationChange("islamabad")}
        >
          <h3 className="font-semibold text-lg mb-2">Islamabad</h3>
          <p className="text-sm text-slate-600">Choose Provider Below</p>
        </button>
      </div>

      {formData.location === "islamabad" && (
        <div className="space-y-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-lg text-slate-900">Select Provider in Islamabad:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                formData.islamabadProvider === "amc" ? "border-blue-600 bg-blue-100" : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => onProviderChange("amc")}
            >
              <h4 className="font-semibold mb-1">AMC</h4>
              <p className="text-xs text-slate-600">American Medical Center</p>
            </button>

            <button
              type="button"
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                formData.islamabadProvider === "iom" ? "border-blue-600 bg-blue-100" : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => onProviderChange("iom")}
            >
              <h4 className="font-semibold mb-1">IOM</h4>
              <p className="text-xs text-slate-600">International Organization for Migration</p>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white">
          Next
        </Button>
      </div>
    </div>
  </div>
);

interface IOMContactStepProps {
  onBack: () => void;
}

const IOMContactStep = ({ onBack }: IOMContactStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-blue-600 text-white px-3 py-1 rounded font-semibold">IOM</div>
      <h2 className="text-2xl font-bold text-slate-900">IOM Islamabad Contact Options</h2>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 space-y-6">
      <p className="text-lg text-slate-700">
        To book an appointment with IOM Islamabad, please use one of the following options:
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Phone</h3>
              <p className="text-slate-600 mb-2">Contact IOM Pakistan Call Center:</p>
              <a href="tel:+92511114664772" className="text-blue-600 font-semibold text-xl hover:underline">
                +92 51 111 466 472
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">2. Email</h3>
              <p className="text-slate-600 mb-2">For Immigration Medical Examination for US Immigrant Visa Applicants:</p>
              <a href="mailto:mhdislamabad@iom.int" className="text-blue-600 font-semibold text-lg hover:underline">
                mhdislamabad@iom.int
              </a>
              <p className="text-sm text-slate-500 mt-3">
                Please submit your completed application forms to this email address.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Make sure to include all required documents when submitting your application via email.
        </p>
      </div>
    </div>

    <div className="flex justify-start pt-4">
      <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
        Back to Location Selection
      </Button>
    </div>
  </div>
);

interface BasicInfoStepProps {
  formData: FormData;
  error: string | null;
  isAMC: boolean;
  isWilcare: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof FormData) => (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BasicInfoStep = ({ formData, error, isAMC, isWilcare, onChange, onSelectChange, onNext, onBack }: BasicInfoStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">
        {isAMC ? "AMC Info" : "HI"}
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
    </div>

    <div className="space-y-6">
      {isAMC && (
        <>
          <div className="space-y-2">
            <Label htmlFor="interviewDate">Interview Date *</Label>
            <Input
              id="interviewDate"
              name="interviewDate"
              type="date"
              value={formData.interviewDate}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaCategory">Visa Category *</Label>
            <Input
              id="visaCategory"
              name="visaCategory"
              value={formData.visaCategory}
              onChange={onChange}
              placeholder="Enter visa category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hadMedicalBefore">Have you had medical examination done before for USA? *</Label>
            <Select value={formData.hadMedicalBefore} onValueChange={onSelectChange("hadMedicalBefore")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="primaryContact">Mobile No. in Pakistan *</Label>
        <div className="flex gap-2">
          <div className="flex items-center justify-center w-24 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-medium">
            🇵🇰 92
          </div>
          <Input
            id="primaryContact"
            name="primaryContact"
            value={formData.primaryContact}
            onChange={onChange}
            placeholder="3001234567"
            type="tel"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="abc@gmail.com"
        />
      </div>

      {isAMC && (
        <>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseRef">Case Ref *</Label>
            <Input
              id="caseRef"
              name="caseRef"
              value={formData.caseRef}
              onChange={onChange}
              placeholder="Enter case reference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfApplicants">Number of Applicants *</Label>
            <Select value={formData.numberOfApplicants} onValueChange={onSelectChange("numberOfApplicants")}>
              <SelectTrigger>
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {isWilcare && (
        <>
          <div className="space-y-2">
            <Label htmlFor="appointmentType">Appointment Type</Label>
            <Select value={formData.appointmentType} onValueChange={onSelectChange("appointmentType")}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaType">Visa Type</Label>
            <Input
              id="visaType"
              name="visaType"
              value={formData.visaType}
              onChange={onChange}
              placeholder="Enter visa type (e.g., K-1)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPassport">Original Passport</Label>
            <Select value={formData.originalPassport} onValueChange={onSelectChange("originalPassport")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YES">YES</SelectItem>
                <SelectItem value="NO">NO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalType">Medical Type</Label>
            <Select value={formData.medicalType} onValueChange={onSelectChange("medicalType")}>
              <SelectTrigger>
                <SelectValue placeholder="Select medical type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Medical">First Medical</SelectItem>
                <SelectItem value="Re-Medical">Re-Medical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Prev
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white">
          Next
        </Button>
      </div>
    </div>
  </div>
);

interface PersonalInfoStepProps {
  formData: FormData;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof FormData) => (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalInfoStep = ({ formData, error, onChange, onSelectChange, onNext, onBack }: PersonalInfoStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">Info</div>
      <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="surname">Surname *</Label>
          <Input
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={onChange}
            placeholder="Enter surname"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="givenName">Given Name *</Label>
          <Input
            id="givenName"
            name="givenName"
            value={formData.givenName}
            onChange={onChange}
            placeholder="Enter given name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={onSelectChange("gender")}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={onChange}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Prev
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white">
          Next
        </Button>
      </div>
    </div>
  </div>
);

interface PassportDetailsStepProps {
  formData: FormData;
  error: string | null;
  isAMC: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PassportDetailsStep = ({ formData, error, isAMC, onChange, onNext, onBack }: PassportDetailsStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">More info</div>
      <h2 className="text-2xl font-bold text-slate-900">Passport Details</h2>
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number *</Label>
          <Input
            id="passportNumber"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={onChange}
            placeholder="Enter passport number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passportIssueDate">Passport Issue Date</Label>
          <Input
            id="passportIssueDate"
            name="passportIssueDate"
            type="date"
            value={formData.passportIssueDate}
            onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passportExpiryDate">Passport Exp Date</Label>
          <Input
            id="passportExpiryDate"
            name="passportExpiryDate"
            type="date"
            value={formData.passportExpiryDate}
            onChange={onChange}
          />
        </div>

        {!isAMC && (
          <div className="space-y-2">
            <Label htmlFor="caseNumber">Case No</Label>
            <Input
              id="caseNumber"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={onChange}
              placeholder="Enter case number (e.g., ISL)"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Prev
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white">
          Next
        </Button>
      </div>
    </div>
  </div>
);

interface DocumentsStepProps {
  formData: FormData;
  error: string | null;
  onFileChange: (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DocumentsStep = ({ formData, error, onFileChange, onNext, onBack }: DocumentsStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">Docs</div>
      <h2 className="text-2xl font-bold text-slate-900">Upload Documents</h2>
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Surname</Label>
          <Input value={formData.surname} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label>Given Name</Label>
          <Input value={formData.givenName} disabled className="bg-gray-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scannedPassport">Scanned Passport *</Label>
        <Input
          id="scannedPassport"
          name="scannedPassport"
          type="file"
          onChange={onFileChange("scannedPassport")}
          accept=".pdf,.jpg,.jpeg,.png"
          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
        {formData.scannedPassport && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {formData.scannedPassport.name}
          </p>
        )}
        <p className="text-xs text-slate-500">Upload a scanned copy of your passport (PDF, JPG, PNG)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kOneLetter">K-1 Letter</Label>
        <Input
          id="kOneLetter"
          name="kOneLetter"
          type="file"
          onChange={onFileChange("kOneLetter")}
          accept=".pdf,.jpg,.jpeg,.png"
          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
        {formData.kOneLetter && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {formData.kOneLetter.name}
          </p>
        )}
        <p className="text-xs text-slate-500">Upload your K-1 visa letter (PDF, JPG, PNG)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointmentConfirmationLetter">Appointment confirmation letter</Label>
        <Input
          id="appointmentConfirmationLetter"
          name="appointmentConfirmationLetter"
          type="file"
          onChange={onFileChange("appointmentConfirmationLetter")}
          accept=".pdf,.jpg,.jpeg,.png"
          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
        {formData.appointmentConfirmationLetter && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {formData.appointmentConfirmationLetter.name}
          </p>
        )}
        <p className="text-xs text-slate-500">Upload your appointment confirmation letter (PDF, JPG, PNG)</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Prev
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white">
          Next
        </Button>
      </div>
    </div>
  </div>
);

interface ScheduleStepProps {
  formData: FormData;
  error: string | null;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof FormData) => (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ScheduleStep = ({ formData, error, loading, onChange, onSelectChange, onSubmit, onBack }: ScheduleStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">When</div>
      <h2 className="text-2xl font-bold text-slate-900">Appointment Schedule</h2>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <p className="font-semibold text-lg">
        {formData.surname}, {formData.givenName}
      </p>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="estimatedCharges">Est Charges</Label>
        <Input
          id="estimatedCharges"
          name="estimatedCharges"
          value={formData.estimatedCharges}
          onChange={onChange}
          placeholder="97,458"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredAppointmentDate">Preferred Appointment Date</Label>
        <Input
          id="preferredAppointmentDate"
          name="preferredAppointmentDate"
          type="date"
          value={formData.preferredAppointmentDate}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredTime">Time</Label>
        <Select value={formData.preferredTime} onValueChange={onSelectChange("preferredTime")}>
          <SelectTrigger>
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="08:00-08:30">08:00 AM - 08:30 AM</SelectItem>
            <SelectItem value="08:30-09:00">08:30 AM - 09:00 AM</SelectItem>
            <SelectItem value="09:00-09:30">09:00 AM - 09:30 AM</SelectItem>
            <SelectItem value="09:30-10:00">09:30 AM - 10:00 AM</SelectItem>
            <SelectItem value="10:00-10:30">10:00 AM - 10:30 AM</SelectItem>
            <SelectItem value="10:30-11:00">10:30 AM - 11:00 AM</SelectItem>
            <SelectItem value="11:00-11:30">11:00 AM - 11:30 AM</SelectItem>
            <SelectItem value="11:30-12:00">11:30 AM - 12:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Prev
        </Button>
        <Button onClick={onSubmit} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
          {loading ? "Submitting..." : "Review & Submit"}
        </Button>
      </div>
    </div>
  </div>
);

interface ReviewStepProps {
  formData: FormData;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
  formatDate: (dateString: string) => string;
}

const ReviewStep = ({ formData, error, loading, onSubmit, onBack, formatDate }: ReviewStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-teal-600 text-white px-3 py-1 rounded font-semibold">Preview</div>
      <h2 className="text-2xl font-bold text-slate-900">Review Your Information</h2>
    </div>

    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Location
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Selected Centre</p>
            <p className="font-medium capitalize">
              {formData.location}
              {formData.location === "islamabad" && formData.islamabadProvider && 
                ` - ${formData.islamabadProvider.toUpperCase()}`}
              {(formData.location === "karachi" || formData.location === "lahore") && " - Wilcare Medical"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Primary Contact</p>
            <p className="font-medium">+92 {formData.primaryContact}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Email</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          {formData.interviewDate && (
            <div>
              <p className="text-sm text-slate-600">Interview Date</p>
              <p className="font-medium">{formatDate(formData.interviewDate)}</p>
            </div>
          )}
          {formData.visaCategory && (
            <div>
              <p className="text-sm text-slate-600">Visa Category</p>
              <p className="font-medium">{formData.visaCategory}</p>
            </div>
          )}
          {formData.appointmentType && (
            <div>
              <p className="text-sm text-slate-600">Appointment Type</p>
              <p className="font-medium">{formData.appointmentType}</p>
            </div>
          )}
          {formData.visaType && (
            <div>
              <p className="text-sm text-slate-600">Visa Type</p>
              <p className="font-medium">{formData.visaType}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
          </svg>
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Surname</p>
            <p className="font-medium">{formData.surname}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Given Name</p>
            <p className="font-medium">{formData.givenName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Gender</p>
            <p className="font-medium">{formData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Date of Birth</p>
            <p className="font-medium">{formData.dateOfBirth ? formatDate(formData.dateOfBirth) : "Not specified"}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Passport Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Passport Number</p>
            <p className="font-medium">{formData.passportNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Issue Date</p>
            <p className="font-medium">{formData.passportIssueDate ? formatDate(formData.passportIssueDate) : "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Expiry Date</p>
            <p className="font-medium">{formData.passportExpiryDate ? formatDate(formData.passportExpiryDate) : "Not specified"}</p>
          </div>
          {formData.caseNumber && (
            <div>
              <p className="text-sm text-slate-600">Case Number</p>
              <p className="font-medium">{formData.caseNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Uploaded Documents
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-sm text-slate-600">Scanned Passport</span>
            <span className="text-sm font-medium text-green-600">
              {formData.scannedPassport ? formData.scannedPassport.name : "Not uploaded"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-sm text-slate-600">K-1 Letter</span>
            <span className="text-sm font-medium text-green-600">
              {formData.kOneLetter ? formData.kOneLetter.name : "Not uploaded"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-sm text-slate-600">Appointment Confirmation Letter</span>
            <span className="text-sm font-medium text-green-600">
              {formData.appointmentConfirmationLetter ? formData.appointmentConfirmationLetter.name : "Not uploaded"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Appointment Schedule
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {formData.estimatedCharges && (
            <div>
              <p className="text-sm text-slate-600">Estimated Charges</p>
              <p className="font-medium">{formData.estimatedCharges}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-600">Preferred Date</p>
            <p className="font-medium">{formData.preferredAppointmentDate ? formatDate(formData.preferredAppointmentDate) : "Not specified"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-slate-600">Time Slot</p>
            <p className="font-medium">{formData.preferredTime || "Not specified"}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="bg-teal-600 hover:bg-teal-700 text-white">
          Back to Edit
        </Button>
        <Button onClick={onSubmit} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
          {loading ? "Submitting..." : "Confirm & Submit"}
        </Button>
      </div>
    </div>
  </div>
);

interface SuccessStepProps {
  onReset: () => void;
}

const SuccessStep = ({ onReset }: SuccessStepProps) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-4">Appointment Request Submitted!</h2>
    <p className="text-slate-600 mb-8">
      Your appointment request has been received. Our team will process your request and book the appointment on your behalf.
      You will receive a confirmation once the appointment is booked.
    </p>
    <div className="flex justify-center gap-4">
      <Button onClick={onReset} className="bg-teal-600 hover:bg-teal-700 text-white">
        Book Another Appointment
      </Button>
    </div>
  </div>
);

export default function WilcareAppointmentForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    location: "",
    islamabadProvider: "",
    primaryContact: "",
    email: "",
    appointmentType: "",
    visaType: "",
    originalPassport: "",
    medicalType: "",
    surname: "",
    givenName: "",
    gender: "",
    dateOfBirth: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    caseNumber: "",
    scannedPassport: null,
    kOneLetter: null,
    appointmentConfirmationLetter: null,
    estimatedCharges: "",
    preferredAppointmentDate: "",
    preferredTime: "",
    interviewDate: "",
    visaCategory: "",
    hadMedicalBefore: "",
    city: "",
    caseRef: "",
    numberOfApplicants: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAMC = formData.location === "islamabad" && formData.islamabadProvider === "amc";
  const isIOM = formData.location === "islamabad" && formData.islamabadProvider === "iom";
  const isWilcare = formData.location === "karachi" || formData.location === "lahore";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleLocationChange = (location: Location) => {
    setFormData(prev => ({ ...prev, location, islamabadProvider: "" }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.location) {
        setError("Please select a location");
        return;
      }
      if (formData.location === "islamabad" && !formData.islamabadProvider) {
        setError("Please select a provider (AMC or IOM)");
        return;
      }
      setError(null);
      if (isIOM) {
        setStep(9);
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (isAMC) {
        if (!formData.interviewDate || !formData.visaCategory || !formData.primaryContact || !formData.email) {
          setError("Please fill in all required fields");
          return;
        }
      } else if (isWilcare) {
        if (!formData.primaryContact || !formData.email) {
          setError("Please fill in Primary Contact and Email");
          return;
        }
      }
      setError(null);
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!formData.surname || !formData.givenName || !formData.gender || !formData.dateOfBirth) {
        setError("Please fill in all required fields");
        return;
      }
      setError(null);
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!formData.passportNumber) {
        setError("Please fill in Passport Number");
        return;
      }
      setError(null);
      if (isAMC) {
        setStep(5);
      } else {
        setStep(5);
      }
      return;
    }

    if (step === 5) {
      setError(null);
      if (isAMC) {
        setStep(7);
      } else {
        setStep(6);
      }
      return;
    }

    if (step === 6) {
      setError(null);
      setStep(7);
      return;
    }

    if (step === 7) {
      handleFinalSubmit();
      return;
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Submit appointment data to API
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit appointment');
      }

      console.log("Appointment submitted successfully:", result);
      setStep(8);
    } catch (err: unknown) {
      console.error("Error submitting appointment:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || "An error occurred while submitting your appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step === 9) {
      setStep(1);
    } else if (step > 1) {
      if (step === 5 && isAMC) {
        setStep(4);
      } else if (step === 7 && isAMC) {
        setStep(5);
      } else {
        setStep(step - 1);
      }
      setError(null);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      location: "",
      islamabadProvider: "",
      primaryContact: "",
      email: "",
      appointmentType: "",
      visaType: "",
      originalPassport: "",
      medicalType: "",
      surname: "",
      givenName: "",
      gender: "",
      dateOfBirth: "",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      caseNumber: "",
      scannedPassport: null,
      kOneLetter: null,
      appointmentConfirmationLetter: null,
      estimatedCharges: "",
      preferredAppointmentDate: "",
      preferredTime: "",
      interviewDate: "",
      visaCategory: "",
      hadMedicalBefore: "",
      city: "",
      caseRef: "",
      numberOfApplicants: "",
    });
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <LocationStep
            formData={formData}
            error={error}
            onLocationChange={handleLocationChange}
            onProviderChange={handleSelectChange("islamabadProvider")}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <BasicInfoStep
            formData={formData}
            error={error}
            isAMC={isAMC}
            isWilcare={isWilcare}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onNext={handleNextStep}
            onBack={handleGoBack}
          />
        );
      case 3:
        return (
          <PersonalInfoStep
            formData={formData}
            error={error}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onNext={handleNextStep}
            onBack={handleGoBack}
          />
        );
      case 4:
        return (
          <PassportDetailsStep
            formData={formData}
            error={error}
            isAMC={isAMC}
            onChange={handleInputChange}
            onNext={handleNextStep}
            onBack={handleGoBack}
          />
        );
      case 5:
        if (isAMC) {
          return (
            <ScheduleStep
              formData={formData}
              error={error}
              loading={loading}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleNextStep}
              onBack={handleGoBack}
            />
          );
        }
        return (
          <DocumentsStep
            formData={formData}
            error={error}
            onFileChange={handleFileChange}
            onNext={handleNextStep}
            onBack={handleGoBack}
          />
        );
      case 6:
        return (
          <ScheduleStep
            formData={formData}
            error={error}
            loading={loading}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleNextStep}
            onBack={handleGoBack}
          />
        );
      case 7:
        return (
          <ReviewStep
            formData={formData}
            error={error}
            loading={loading}
            onSubmit={handleNextStep}
            onBack={handleGoBack}
            formatDate={formatDate}
          />
        );
      case 8:
        return <SuccessStep onReset={handleReset} />;
      case 9:
        return <IOMContactStep onBack={handleGoBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Appointment Booking</h1>
          <p className="text-slate-600">Book your medical appointment</p>
          
          {step > 1 && step < 8 && step !== 9 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-600 mb-2">
                <span>Location</span>
                <span>{isAMC ? "AMC Info" : "HI"}</span>
                <span>Info</span>
                <span>Passport</span>
                {!isAMC && <span>Docs</span>}
                <span>When</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${((step - 1) / (isAMC ? 5 : 6)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <Card className="p-8 bg-white shadow-lg border-0">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}