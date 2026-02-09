"use client";

import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import { ResultPage } from "./ResultPage";

function ResultPageInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const handleRestart = () => {
    window.location.href = "/visa-case-strength-checker";
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Invalid Session
            </h2>
            <p className="text-slate-600 mb-6">
              No session ID provided. Please start a new assessment.
            </p>
            <button
              onClick={handleRestart}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
          >
            ← Back to My Cases
          </button>
        </div>
        <ResultPage sessionId={sessionId} onRestart={handleRestart} />
      </div>
    </div>
  );
}

export default function ResultPageRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultPageInner />
    </Suspense>
  );
}
