"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Field as FormField } from "@/lib/formConfig/i130"   

const SafeInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { value, ...rest } = props
  return (
    <input
      {...rest}
      value={value ?? ""}
      className={`border border-gray-300 p-3 w-full mt-1 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition ${rest.className || ""}`}
    />
  )
}

type RadioOption = { label: string; value: string; pdfKey: string }

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => (
  <div className="flex flex-col gap-3 mt-2">
    {options.map((opt) => (
      <label
        key={opt.value}
        className="flex items-center text-sm font-normal cursor-pointer hover:text-gray-900"
      >
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={onChange}
          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        {opt.label}
      </label>
    ))}
  </div>
)

interface CheckboxProps {
  name: string
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ name, label, checked, onChange }: CheckboxProps) => (
  <label className="flex items-center text-sm font-normal mt-3 cursor-pointer hover:text-gray-900">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    {label}
  </label>
)

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`border border-gray-300 p-3 w-full mt-1 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition resize-none ${props.className || ""}`}
  />
)

interface FormStepProps {
  stepNumber: number
  sectionTitle: string
  fields: FormField[]
  formData: Record<string, string>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function FormStep({ stepNumber, sectionTitle, fields, formData, onInputChange }: FormStepProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Step {stepNumber}: {sectionTitle}</h2>
        <p className="text-gray-600 mt-2">Please fill in the following information</p>
      </div>

      <div className="space-y-8">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-base font-semibold text-gray-800">{field.label}</label>

            {field.type === "text" || field.type === "date" ? (
              <SafeInput
                type={field.type === "date" ? "text" : "text"}
                name={field.key}
                value={formData[field.key] ?? ""}
                onChange={onInputChange}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
              />
            ) : field.type === "radio" ? (
              <RadioGroup
                name={field.key}
                options={field.options!}
                value={formData[field.key] ?? ""}
                onChange={onInputChange}
              />
            ) : field.type === "checkbox" ? (
              <Checkbox
                name={field.key}
                label={field.label}
                checked={formData[field.key] === "Yes"}
                onChange={onInputChange}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                name={field.key}
                value={formData[field.key] ?? ""}
                onChange={onInputChange}
                placeholder={field.placeholder}
                rows={4}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}