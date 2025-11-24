"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { formFields,getInitialFormData } from "@/lib/formConfig/i130"
import { ProgressBar } from "./progress-bar"
import { FormStep } from "./form-step"
import { ReviewPage } from "./review-page"

type ViewType = "form" | "review"

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [view, setView] = useState<ViewType>("form")
  const [isClient, setIsClient] = useState(false)

  // Initialize form data only on client
  useEffect(() => {
    setFormData(getInitialFormData())
    setIsClient(true)
  }, [])

  // Group fields by section and apply conditions
  const sections = useMemo(() => {
    if (!isClient) return []

    const sectionMap = new Map<string, typeof formFields>()

    formFields.forEach((field) => {
      if (field.condition && !field.condition(formData)) return

      const section = field.section ?? "General"

      if (!sectionMap.has(section)) {
        sectionMap.set(section, [])
      }
      sectionMap.get(section)!.push(field)
    })

    return Array.from(sectionMap.entries())
      .filter(([, fields]) => fields.length > 0)
      .map(([title, fields]) => ({ title, fields }))
  }, [formData, isClient])

  const totalSteps = sections.length
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0
  const currentSection = sections[currentStep - 1]

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target as HTMLInputElement
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? "Yes" : "") : value || "",
      }))
    },
    []
  )

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      setView("review")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleGoToStep = (step: number) => {
    setCurrentStep(step)
    setView("form")
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
    setView("form")
  }

  const handleBackToForm = () => {
    setView("form")
    setCurrentStep(1)
  }

  // -------------------------------------------------
  // Shared payload builder
  // -------------------------------------------------
  const buildPdfPayload = (): Record<string, string> => {
    const payload: Record<string, string> = {}

    formFields.forEach((field) => {
      const value = formData[field.key]
      if (!value) return
      if (field.condition && !field.condition(formData)) return

      if (field.type === "radio" && field.options) {
        const selected = field.options.find((opt) => opt.value === value)
        if (selected) {
          payload[selected.pdfKey] = "Yes"
          field.options
            .filter((opt) => opt.value !== value)
            .forEach((opt) => (payload[opt.pdfKey] = "Off"))
        }
      } else if (field.type === "checkbox") {
        payload[field.pdfKey] = value === "Yes" ? "Yes" : "Off"
      } else {
        payload[field.pdfKey] = value
      }
    })

    return payload
  }

  // -------------------------------------------------
  // PREVIEW: Open filled PDF in new tab
  // -------------------------------------------------
  const handlePreviewPDF = async () => {
    const payload = buildPdfPayload()
    const apiUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
        : "http://localhost:8000/api/v1"

    try {
      const res = await fetch(`${apiUrl}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.text()
        alert(`Error: ${err}`)
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const newTab = window.open(url, "_blank", "noopener,noreferrer")
      if (!newTab) {
        alert("Please allow pop-ups to preview the PDF.")
      }

      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch (e) {
      console.error(e)
      alert("Network error. Check console.")
    }
  }

  // -------------------------------------------------
  // DOWNLOAD: Trigger file download
  // -------------------------------------------------
  const handleDownloadPDF = async () => {
    const payload = buildPdfPayload()
    const apiUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
        : "http://localhost:8000/api/v1"

    try {
      const res = await fetch(`${apiUrl}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.text()
        alert(`Error: ${err}`)
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "i130-filled.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert("Network error. Check console.")
    }
  }

  if (!isClient) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (totalSteps === 0) {
    return <div className="p-6 text-center text-gray-600">No fields to display.</div>
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">USCIS Form I-130</h1>
          <p className="text-gray-600">Petition for Alien Relative</p>
        </div>

        {view === "form" && (
          <ProgressBar current={currentStep} total={totalSteps} progress={progress} />
        )}

        {view === "form" && currentSection && (
          <div>
            <FormStep
              stepNumber={currentStep}
              sectionTitle={currentSection.title}
              fields={currentSection.fields}
              formData={formData}
              onInputChange={handleChange}
            />

            <div className="flex gap-4 mt-8 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-semibold rounded-lg transition disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                {currentStep === totalSteps ? "Review" : "Next"}
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3 font-semibold">Jump to section:</p>
              <div className="flex gap-2 flex-wrap">
                {sections.map((section, idx) => {
                  const title = section.title || "Section"
                  const parts = title.split(".")
                  const displayText = parts.length > 1 ? parts[1].trim() : title

                  return (
                    <button
                      key={idx}
                      onClick={() => handleGoToStep(idx + 1)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        currentStep === idx + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {displayText}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <ReviewPage
            formData={formData}
            sections={sections}
            onEditStep={handleEditStep}
            onBackToForm={handleBackToForm}
            onPreviewPDF={handlePreviewPDF}
            onDownloadPDF={handleDownloadPDF}
          />
        )}
      </div>
    </div>
  )
}