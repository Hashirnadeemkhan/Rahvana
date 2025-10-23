"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface InitialQuestions {
  dateOfBirth: string
  gender: string
  nationality: string
  maritalStatus: string
}

export default function InitialQuestionsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<InitialQuestions>({
    dateOfBirth: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.dateOfBirth) {
      setError("Date of birth is required")
      setLoading(false)
      return
    }
    if (!formData.gender) {
      setError("Gender is required")
      setLoading(false)
      return
    }
    if (!formData.nationality) {
      setError("Nationality is required")
      setLoading(false)
      return
    }
    if (!formData.maritalStatus) {
      setError("Marital status is required")
      setLoading(false)
      return
    }

    // Save initial questions
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    const updatedProfile = {
      ...existingProfile,
      initialQuestions: formData,
    }
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    setLoading(false)
    router.push("/complete-profile")
  }

  return (
    <Card className="p-8 bg-white shadow-lg border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
          <Input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
          <Input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            placeholder="e.g., Pakistani"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Select Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
