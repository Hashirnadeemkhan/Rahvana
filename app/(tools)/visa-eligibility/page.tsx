"use client";

import { VisaEligibilityTool } from "./components/VisaEligibilityTool";
import { useEffect } from "react";

export default function VisaSuggestionPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <VisaEligibilityTool />
    </div>
  );
}
