"use client";
import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import {
  Download,
  Loader,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
} from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: "text" | "checkbox";
  group?: string;
  placeholder?: string;
}

interface Section {
  title: string;
  fields: Field[];
}

/* ---------- WIZARD UI (NO ANY TYPES) ---------- */
export default function DynamicFormWizard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const QUESTIONS_PER_PAGE = 3;

  /* ----- FETCH SECTIONS ----- */
  useEffect(() => {
    api
      .get<{ sections: Section[] }>("/i130/fields-structured")
      .then((res) => {
        setSections(res.data.sections);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.detail || "Failed to load form");
        setLoading(false);
      });
  }, []);

  /* ----- CHANGE HANDLERS ----- */
  const handleChange = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioGroup = (group: string, selectedName: string) => {
    const newForm = { ...form };
    sections.forEach((sec) => {
      sec.fields.forEach((f) => {
        if (f.group === group) {
          newForm[f.name] = f.name === selectedName;
        }
      });
    });
    setForm(newForm);
  };

  /* ----- SUBMIT ----- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post("/i130/fill", form, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "I-130_Filled_by_Arachnie.pdf";
      a.click();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /* ----- FLATTEN QUESTIONS FOR NAVIGATION ----- */
  const allQuestions = useMemo(() => {
    const list: Array<{
      sectionIdx: number;
      field: Field;
      label: string;
      type: "text" | "checkbox" | "radio";
    }> = [];

    sections.forEach((sec, secIdx) => {
      sec.fields.forEach((f) => {
        const isRadio = !!f.group && f.type === "checkbox";
        list.push({
          sectionIdx: secIdx,
          field: f,
          label: f.label,
          type: isRadio ? "radio" : f.type,
        });
      });
    });
    return list;
  }, [sections]);

  const totalQuestions = allQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const currentPage = Math.floor(currentQuestionIndex / QUESTIONS_PER_PAGE) + 1;
  const currentPageQuestions = allQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );
  const progressPercent = totalQuestions
    ? (currentQuestionIndex / totalQuestions) * 100
    : 0;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  const handleEdit = (sectionIdx: number) => {
    const firstIdx = allQuestions.findIndex((q) => q.sectionIdx === sectionIdx);
    if (firstIdx !== -1) {
      setCurrentQuestionIndex(firstIdx);
      setShowReview(false);
    }
  };

  /* ----- LOADING STATE ----- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading I-130 Form...</span>
      </div>
    );
  }

  /* ---------- REVIEW PAGE ---------- */
  if (showReview) {
    const grouped = allQuestions.reduce<
      Record<number, Array<(typeof allQuestions)[number]>>
    >((acc, q) => {
      if (!acc[q.sectionIdx]) acc[q.sectionIdx] = [];
      acc[q.sectionIdx].push(q);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Review Your Information
            </h1>
            <p className="text-slate-600">Please check all information before submitting</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">PDF downloaded successfully!</span>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-4 mb-8">
            {Object.entries(grouped).map(([secIdxStr, fields]) => {
              const secIdx = Number(secIdxStr);
              const sectionTitle = sections[secIdx]?.title ?? "Untitled Section";

              return (
                <div key={secIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">{sectionTitle}</h2>
                    <button
                      onClick={() => handleEdit(secIdx)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((q) => {
                      const value = form[q.field.name];
                      const display =
                        q.type === "radio"
                          ? value === true
                            ? "Yes"
                            : "No"
                          : q.type === "checkbox"
                          ? value
                            ? "Yes"
                            : "No"
                          : (value as string) || (
                              <span className="text-slate-400 italic">Not filled</span>
                            );

                      return (
                        <div key={q.field.name}>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            {q.label}
                          </p>
                          <p className="text-slate-900 font-medium break-words">{display}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => setShowReview(false)}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
            >
              Back to Editing
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- MAIN WIZARD UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Petition for Alien Relative
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>

          {/* Progress Bar */}
          <div className="mt-6 bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {Math.round(progressPercent)}% Complete • Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">PDF downloaded successfully.</span>
          </div>
        )}

        {/* Questions Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="space-y-6">
            {currentPageQuestions.map((q, idx) => {
              const isLast = idx === currentPageQuestions.length - 1;
              const isRadio = q.type === "radio";

              if (isRadio) {
                const group = q.field.group!;
                const groupFields = sections
                  .flatMap((s) => s.fields)
                  .filter((f) => f.group === group);

                return (
                  <div
                    key={group}
                    className={`pb-6 ${!isLast ? "border-b border-slate-200" : ""}`}
                  >
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      {q.field.label.split(" (")[0]}
                    </label>
                    <div className="space-y-3">
                      {groupFields.map((f) => {
                        const checked = form[f.name] === true;
                        return (
                          <div key={f.name} className="flex items-center space-x-3 p-2">
                            <input
                              type="radio"
                              name={group}
                              checked={checked}
                              onChange={() => handleRadioGroup(group, f.name)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <label className="font-medium text-gray-800">{f.label}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Normal text / checkbox
              return (
                <div
                  key={q.field.name}
                  className={`pb-6 ${!isLast ? "border-b border-slate-200" : ""}`}
                >
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    {q.label}
                  </label>

                  {q.type === "text" ? (
                    <input
                      type="text"
                      placeholder={q.field.placeholder}
                      value={(form[q.field.name] as string) ?? ""}
                      onChange={(e) => handleChange(q.field.name, e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-900"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!form[q.field.name]}
                        onChange={(e) => handleChange(q.field.name, e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600">Yes, this applies to me</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Review
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx + 1 <= currentPage ? "bg-blue-600 w-8" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}