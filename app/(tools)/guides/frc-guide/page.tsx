"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WizardHeader from "./components/guide/WizardHeader";
import WizardSidebar from "./components/guide/WizardSidebar";
import WizardInfoPanel from "./components/guide/WizardInfoPanel";
import WhatsThisModal from "./components/guide/WhatsThisModal";
import DocumentNeedStep from "./components/guide/steps/DocumentNeedStep";
import LocationStep from "./components/guide/steps/LocationStep";
import RoadmapStep from "./components/guide/steps/RoadmapStep";
import OfficeFinderStep from "./components/guide/steps/OfficeFinderStep";
import ValidationStep from "./components/guide/steps/ValidationStep";
import { type WizardStepId, type WizardState } from "@/types/frc-wizard";
import guideData from "@/data/frc-guide-data.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEP_IDS: WizardStepId[] = [
  "document_need",
  "location",
  "roadmap",
  "office_finder",
  "validation",
];

const INFO_PANEL_KEYS: Record<
  WizardStepId,
  keyof typeof guideData.wizard.info_panel
> = {
  document_need: "document_need",
  location: "location",
  roadmap: "roadmap",
  office_finder: "office_finder",
  validation: "validation",
};

const FrcGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWhatsThis, setShowWhatsThis] = useState(true);
  const [state, setState] = useState<WizardState>({
    documentNeed: null,
    province: null,
    district: null,
    city: null,
    checkedDocuments: [],
    validationChecks: [],
    uploadedFile: false,
  });

  const currentStepId = STEP_IDS[currentStep];
  const infoPanelData =
    guideData.wizard.info_panel[INFO_PANEL_KEYS[currentStepId]];

  const canGoNext = (): boolean => {
    switch (currentStepId) {
      case "document_need":
        return !!state.documentNeed;
      case "location":
        return !!state.province && !!state.district && !!state.city;
      case "roadmap":
        return true;
      case "office_finder":
        return true;
      case "validation":
        return false;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < STEP_IDS.length - 1 && canGoNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleDocumentNeedSelect = (id: string) => {
    setState((s) => ({ ...s, documentNeed: id }));
    // Auto-advance after selection
    setTimeout(() => setCurrentStep(1), 400);
  };

  const toggleDocument = (id: string) => {
    setState((s) => ({
      ...s,
      checkedDocuments: s.checkedDocuments.includes(id)
        ? s.checkedDocuments.filter((d) => d !== id)
        : [...s.checkedDocuments, id],
    }));
  };

  const toggleValidationCheck = (label: string) => {
    setState((s) => ({
      ...s,
      validationChecks: s.validationChecks.includes(label)
        ? s.validationChecks.filter((l) => l !== label)
        : [...s.validationChecks, label],
    }));
  };

  const renderStep = () => {
    switch (currentStepId) {
      case "document_need":
        return (
          <DocumentNeedStep
            selected={state.documentNeed}
            onSelect={handleDocumentNeedSelect}
          />
        );
      case "location":
        return (
          <LocationStep
            province={state.province}
            district={state.district}
            city={state.city}
            onProvinceChange={(v) => setState((s) => ({ ...s, province: v }))}
            onDistrictChange={(v) => setState((s) => ({ ...s, district: v }))}
            onCityChange={(v) => setState((s) => ({ ...s, city: v }))}
          />
        );
      case "roadmap":
        return (
          <RoadmapStep
            checkedDocuments={state.checkedDocuments}
            onToggleDocument={toggleDocument}
          />
        );
      case "office_finder":
        return (
          <OfficeFinderStep
            province={state.province}
            district={state.district}
          />
        );
      case "validation":
        return (
          <ValidationStep
            validationChecks={state.validationChecks}
            onToggleCheck={toggleValidationCheck}
            uploadedFile={state.uploadedFile}
            onUpload={() => setState((s) => ({ ...s, uploadedFile: true }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-14 flex flex-col bg-slate-50 font-sans">
      <WizardHeader onWhatsThis={() => setShowWhatsThis(true)} />

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        {/* Left Sidebar */}
        <WizardSidebar
          currentStep={currentStep}
          steps={STEP_IDS}
          onStepClick={setCurrentStep}
        />

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto relative px-10 py-8">
          {/* Grid background */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(5,150,105,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,0.02) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Wizard Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-5 pb-6">
              {currentStep > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              ) : (
                <div />
              )}

              <span className="text-sm text-slate-500 font-medium">
                Step {currentStep + 1} of {STEP_IDS.length}
              </span>

              {currentStep < STEP_IDS.length - 1 && (
                <motion.button
                  whileHover={{ scale: canGoNext() ? 1.03 : 1 }}
                  whileTap={{ scale: canGoNext() ? 0.97 : 1 }}
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition
                    ${
                      canGoNext()
                        ? "bg-linear-to-r from-emerald-700 to-emerald-600 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }
                  `}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </main>

        {/* Right Info Panel */}
        <WizardInfoPanel
          data={infoPanelData}
          lastVerified={guideData.wizard.last_verified}
        />
      </div>

      {/* What's This Modal */}
      <WhatsThisModal
        open={showWhatsThis}
        onClose={() => setShowWhatsThis(false)}
      />
    </div>
  );
};

export default FrcGuide;
