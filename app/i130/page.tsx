// app/i130/page.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import { formFields, getInitialFormData } from "./formConfig";

// Safe Input & Button
const SafeInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`border p-2 w-full mt-1 rounded focus:border-blue-500 focus:ring-1 ${props.className || ""}`}
    suppressHydrationWarning={true}
  />
);

const SafeButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${props.className || ""}`}
    suppressHydrationWarning={true}
  />
);

// Radio Group
type RadioOption = {
  label: string;
  value: string;
  pdfKey?: string;
};

type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => (
  <div className="flex flex-wrap gap-4 mt-2">
    {options.map((opt: RadioOption) => (
      <label key={opt.value} className="flex items-center text-sm font-normal text-gray-700">
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={onChange}
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          suppressHydrationWarning={true}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

export default function I130Form() {
  const [formData, setFormData] = useState(getInitialFormData());

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const submit = async () => {
    const payload: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = formData[field.key];
      if (!value) return;

      if (field.type === "radio" && field.options) {
        const selected = field.options.find((opt) => opt.value === value);
        if (selected) {
          payload[selected.pdfKey] = "Yes";
          // Uncheck others
          field.options
            .filter((opt) => opt.value !== value)
            .forEach((opt) => {
              payload[opt.pdfKey] = "Off";
            });
        }
      } else {
        payload[field.pdfKey] = value;
      }
    });

    const res = await fetch("http://localhost:8000/api/v1/fill-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return alert("Error generating PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "i130-filled.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cleanup fdprocessedid
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll("[fdprocessedid]").forEach((el) => el.removeAttribute("fdprocessedid"));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // === SECTION LIST ===
  const sections = [
    "Part 1. Relationship",
    "Part 2. Information About You (Petitioner)",
    "Address History",
    "Your Marital Information",
    
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 border-b-4 border-blue-200 pb-2">
        USCIS Form I-130 Filler
      </h1>

      <div className="space-y-10">
        {sections.map((section) => (
          <div
            key={section}
            className="bg-white p-8 border border-gray-200 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-2">
              {section}
            </h2>

            <div className="space-y-6">
              {formFields
                .filter(
                  (f) =>
                    f.section === section &&
                    (!f.condition || f.condition(formData))
                )
                .map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-base font-semibold text-gray-800">
                      {field.label}
                    </label>

                    {field.type === "text" ? (
                      <SafeInput
                        name={field.key}
                        value={formData[field.key]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                      />
                    ) : (
                      <RadioGroup
                        name={field.key}
                        options={field.options!}
                        value={formData[field.key]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <SafeButton
        onClick={submit}
        className="mt-10 w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl transition duration-200 text-lg tracking-wider"
      >
        Generate Filled PDF
      </SafeButton>
    </div>
  );
}