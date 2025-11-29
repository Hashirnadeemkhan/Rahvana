// app/components/forms/reusable/multi-step-form.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { getFormConfig } from "@/lib/formConfig";
import { ProgressBar } from "./progress-bar";
import { FormStep } from "./form-step";
import { ReviewPage } from "./review-page";
import type { Field as ConfigField } from "@/lib/formConfig/types";

type ViewType = "form" | "review";

type MultiStepFormProps = {
  formCode: string;
};

export function MultiStepForm({ formCode }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [view, setView] = useState<ViewType>("form");

  // Hooks must always run in the same order
  const config = useMemo(() => getFormConfig(formCode), [formCode]);

  // Load initial form data
  useEffect(() => {
    if (config) setFormData(config.getInitialFormData());
  }, [config]);

  const sections = useMemo(() => {
    if (!config) return [];

    const sectionMap = new Map<string, ConfigField[]>();

    config.formFields.forEach((field: ConfigField) => {
      if (field.condition && !field.condition(formData)) return;

      const section = field.section ?? "General";
      if (!sectionMap.has(section)) sectionMap.set(section, []);
      sectionMap.get(section)!.push(field);
    });

    return Array.from(sectionMap.entries())
      .filter(([, fields]) => fields.length > 0)
      .map(([title, fields]) => ({ title, fields }));
  }, [formData, config]);

  const totalSteps = sections.length;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const currentSection = sections[currentStep - 1];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? "Yes" : "") : value,
      }));
    },
    []
  );

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else setView("review");
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
    setView("form");
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
    setView("form");
  };

  const buildPdfPayload = (): Record<string, string> => {
    if (!config) return {};

    const payload: Record<string, string> = {};

    config.formFields.forEach((field: ConfigField) => {
      const value = formData[field.key];
      if (!value || (field.condition && !field.condition(formData))) return;

      if (field.type === "radio" && field.options) {
        const selected = field.options.find((opt: { value: string; pdfKey: string }) => opt.value === value);
        if (selected) {
          payload[selected.pdfKey] = "Yes";
          field.options
            .filter((opt: { value: string; pdfKey: string }) => opt.value !== value)
            .forEach((opt: { value: string; pdfKey: string }) => (payload[opt.pdfKey] = "Off"));
        }
      } else if (field.type === "checkbox") {
        payload[field.pdfKey] = value === "Yes" ? "Yes" : "Off";
      } else {
        payload[field.pdfKey] = value;
      }
    });

    return payload;
  };

  const handlePreviewPDF = async () => {
    const payload = buildPdfPayload();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: formCode, data: payload }),
      });

      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Preview failed: " + err.message);
      else alert("Preview failed");
    }
  };

  const handleDownloadPDF = async () => {
    const payload = buildPdfPayload();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: formCode, data: payload }),
      });

      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formCode.toUpperCase()}-filled.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Download failed: " + err.message);
      else alert("Download failed");
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-800 mb-3">Form Not Found</h2>
          <p className="text-red-700">
            Sorry, the form &quot;<strong>{formCode.toUpperCase()}</strong>&quot; is not available yet.
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Available: I-130, I-130A, I-864, DS-260
          </p>
        </div>
      </div>
    );
  }

  if (totalSteps === 0) {
    return <div className="text-center py-20 text-gray-500">No questions in this form.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">
            {config.formTitle || `USCIS Form ${formCode.toUpperCase()}`}
          </h1>
          {config.formSubtitle && <p className="text-blue-100 text-lg">{config.formSubtitle}</p>}
        </div>

        <div className="p-8">
          {view === "form" && (
            <ProgressBar current={currentStep} total={totalSteps} progress={progress} />
          )}

          {view === "form" && currentSection && (
            <>
              <FormStep
                stepNumber={currentStep}
                sectionTitle={currentSection.title}
                fields={currentSection.fields}
                formData={formData}
                onInputChange={handleChange}
              />

              <div className="flex justify-between mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-semibold rounded-lg transition"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  {currentStep === totalSteps ? "Review Answers" : "Next"}
                </button>
              </div>

              <div className="mt-10 p-6 bg-blue-50 rounded-xl">
                <p className="font-semibold text-blue-900 mb-4">Quick Navigation:</p>
                <div className="flex flex-wrap gap-3">
                  {sections.map((section, idx) => {
                    const label = section.title.split(".").pop()?.trim() || section.title;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleGoToStep(idx + 1)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                          currentStep === idx + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-700 border border-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {view === "review" && (
            <ReviewPage
              formData={formData}
              sections={sections}
              onEditStep={handleEditStep}
              onBackToForm={() => setView("form")}
              onPreviewPDF={handlePreviewPDF}
              onDownloadPDF={handleDownloadPDF}
            />
          )}
        </div>
      </div>
    </div>
  );
}
