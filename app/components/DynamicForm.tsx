// app/components/DynamicForm.tsx - FIX

"use client";
import { useState, useCallback, useEffect } from "react";
import { formFields, getInitialFormData } from "@/app/i130/formConfig";

// Safe Input & Button
const SafeInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { value, ...rest } = props;
  return (
    <input
      {...rest}
      value={value ?? ""} // Ensure value is always a string, never undefined
      className={`border p-2 w-full mt-1 rounded focus:border-blue-500 focus:ring-1 ${
        rest.className || ""
      }`}
      suppressHydrationWarning={true}
    />
  );
};

const SafeButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      props.className || ""
    }`}
    suppressHydrationWarning={true}
  />
);

// Radio Group
type RadioOption = {
  label: string;
  value: string;
  pdfKey: string;
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
      <label
        key={opt.value}
        className="flex items-center text-sm font-normal text-gray-700"
      >
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

// Checkbox Component
type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ name, label, checked, onChange }: CheckboxProps) => (
  <label className="flex items-center text-sm font-normal text-gray-700 mt-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      suppressHydrationWarning={true}
    />
    {label}
  </label>
);

export default function I130Form() {
  // Initialize with all fields as empty strings (not undefined)
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    getInitialFormData()
  );
  const [isClient, setIsClient] = useState(false);

  // Only render after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (checked ? "Yes" : "") : value || "",
      }));
    },
    []
  );

 const submit = async () => {
  const payload: Record<string, string> = {};

  formFields.forEach((field) => {
    const value = formData[field.key];
    if (!value) return;

    if (field.type === "radio" && field.options) {
      const selected = field.options.find((opt) => opt.value === value);
      if (selected) {
        payload[selected.pdfKey] = "Yes";

        // SAB BAQI OPTIONS KO "Off" BHEJO
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

    const apiUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
        : "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        return alert("Error generating PDF: " + errorText);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "i130-filled.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form. Please check console for details.");
    }
  };

  // Cleanup fdprocessedid
  useEffect(() => {
    const t = setTimeout(() => {
      document
        .querySelectorAll("[fdprocessedid]")
        .forEach((el) => el.removeAttribute("fdprocessedid"));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // === SECTION LIST ===
  const sections = [
    "Part 1. Relationship",
    "Part 2. Information About You (Petitioner)",
    "Address History",
    "Your U.S. Entry Information",
    "Employment Information",
    "Previous Employment",
    "Your Marital Information",
    "Immigration & Employment Information",
    "Physical Characteristics",
    "Biographic Information",
    "Part 3. Biographic Information",
    "Part 4. Information About Your Relative",
    "Part 4. Current Physical Address",
    "Part 4. Address Where Your Relative Intends to Live",
    "Part 4. Address Abroad (if not immigrating to U.S.)",
    "Part 4. Contact Information",
    "Part 4. Marital Information",
    "Part 4. Current Marriage Information",
    "Part 4. Names of Prior Spouses",
    "Part 4. Information About Your Relative's Parents",
    "Part 4. Information About Your Relative's Current Spouse",
  ];

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 border-b-4 border-blue-200 pb-2">
        USCIS Form I-130 Filler
      </h1>

      <div className="space-y-10">
        {sections.map((section) => {
          const fieldsInSection = formFields.filter(
            (f) =>
              f.section === section &&
              (!f.condition || f.condition(formData))
          );

          if (fieldsInSection.length === 0) return null;

          return (
            <div
              key={section}
              className="bg-white p-8 border border-gray-200 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-2">
                {section}
              </h2>

              <div className="space-y-6">
                {fieldsInSection.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-base font-semibold text-gray-800">
                      {field.label}
                    </label>

                    {field.type === "text" || field.type === "date" ? (
                      <SafeInput
                        type={field.type === "date" ? "text" : "text"}
                        name={field.key}
                        value={formData[field.key] ?? ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                      />
                    ) : field.type === "radio" ? (
                      <RadioGroup
                        name={field.key}
                        options={field.options!}
                        value={formData[field.key] ?? ""}
                        onChange={handleChange}
                      />
                    ) : field.type === "checkbox" ? (
                      <Checkbox
                        name={field.key}
                        label={field.label}
                        checked={formData[field.key] === "Yes"}
                        onChange={handleChange}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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