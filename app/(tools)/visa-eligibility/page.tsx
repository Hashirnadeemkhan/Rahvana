"use client";

import { VisaEligibilityTool } from "./components/VisaEligibilityTool";
import { useEffect } from "react";

export default function VisaSuggestionPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="w-full bg-slate-50 flex items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="w-full max-w-5xl h-full flex items-center justify-center">
        <VisaEligibilityTool />
      </div>
    </div>
  );
}
