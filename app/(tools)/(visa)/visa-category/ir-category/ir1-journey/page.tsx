"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useWizard, WizardState } from "@/app/(main)/dashboard/hooks/useWizard";
import { roadmapData } from "@/data/roadmap";
import { ProgressTree } from "@/app/test/components/ProgressTree";
import { StepDetail } from "@/app/test/components/StepDetail";
import { DocumentVault } from "@/app/test/components/DocumentVault";
import { useRouter } from "next/navigation";

export default function IR1JourneyPage() {
  const { user } = useAuth();
  const { state, actions, isLoaded } = useWizard();
  const router = useRouter();
  const isSignedIn = !!user;

  const handleToggleAuth = () => {
    router.push("/login");
  };

  return (
    <section id="ir1-journey" className="block">
      <div className="max-w-[1400px] mx-auto px-6 py-[60px]">
        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-4">
            IR-1/CR-1 Spouse Visa Journey
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            Comprehensive roadmap for bringing your spouse to the United States
            via consular processing at U.S. Embassy Islamabad, Pakistan.
          </p>
          <div className="bg-[#e0f2fe] border-l-4 border-l-[#0d9488] p-4 rounded-xl mb-8 flex gap-3 items-start">
            <p className="text-base text-slate-800 leading-relaxed font-medium">
              <span className="font-bold">IR-1 vs CR-1:</span> If married less
              than 2 years at entry, you&apos;ll receive CR-1 (conditional,
              2-year green card requiring I-751 filing). If married 2+ years,
              IR-1 (10-year green card).
            </p>
          </div>

          <h2 className="text-xl font-bold mb-6 text-slate-800">
            The 5 Stages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-primary font-bold text-sm mb-1 uppercase tracking-wide">
                Stage I
              </h4>
              <p className="font-bold text-slate-800 text-lg mb-4">
                USCIS Petition
              </p>
              <p className="text-slate-500 text-sm">17-65 months</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[#0d9488] font-bold text-sm mb-1 uppercase tracking-wide">
                Stage II
              </h4>
              <p className="font-bold text-slate-800 text-lg mb-4">
                NVC/CEAC Processing
              </p>
              <p className="text-slate-500 text-sm">4-9 months</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[#0d9488] font-bold text-sm mb-1 uppercase tracking-wide">
                Stage III
              </h4>
              <p className="font-bold text-slate-800 text-lg mb-4">
                Medical + Interview
              </p>
              <p className="text-slate-500 text-sm">2-4 weeks</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[#0d9488] font-bold text-sm mb-1 uppercase tracking-wide">
                Stage IV
              </h4>
              <p className="font-bold text-slate-800 text-lg mb-4">
                Post-Interview & Travel
              </p>
              <p className="text-slate-500 text-sm">1-2 weeks</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[#0d9488] font-bold text-sm mb-1 uppercase tracking-wide">
                Stage V
              </h4>
              <p className="font-bold text-slate-800 text-lg mb-4">
                U.S. Arrival
              </p>
              <p className="text-slate-500 text-sm">90 days</p>
            </div>
          </div>

          <div className="bg-secondary text-white rounded-xl p-10 mb-10">
            <h4 className="text-lg font-bold mb-3">
              📹 Getting Started with Rahvana (3 min)
            </h4>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2 text-sm">
                <span className="text-amber-500">▸</span>{" "}
                <strong>Goals:</strong> Understand the 5 stages, set realistic
                expectations, feel supported
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-amber-500">▸</span>{" "}
                <strong>Target:</strong> Both petitioner and beneficiary
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-amber-500">▸</span>{" "}
                <strong>Topics:</strong> Timeline overview, cost breakdown,
                common mistakes to avoid, emotional support for separated
                couples
              </li>
            </ul>
            <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-bold cursor-not-allowed bg-[#ffffff33]">
              ▶ Play Video (Placeholder)
            </button>
          </div>

          {!isSignedIn && (
            <div className="bg-[#faba20] text-[#7c2d12] rounded-2xl p-6 mb-8 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl" role="img" aria-label="lock">
                  🔒
                </span>
                <h4 className="text-2xl font-bold">Full Wizard Access</h4>
              </div>
              <p className="mb-4 text-lg opacity-90 mx-auto">
                Sign in free to save your progress, mark steps complete, and use
                the document vault.
              </p>
              <button
                className="px-8 py-3 rounded-xl bg-primary/90 text-white font-bold text-lg hover:bg-[#0f766e] transition-all shadow-lg active:scale-95"
                onClick={handleToggleAuth}
              >
                Sign In Free
              </button>
            </div>
          )}
        </div>
        <Wizard state={state} actions={actions} isLoaded={isLoaded} />
      </div>
    </section>
  );
}

type WizardActions = ReturnType<typeof useWizard>["actions"];

interface WizardProps {
  state: WizardState;
  actions: WizardActions;
  isLoaded: boolean;
}

function Wizard({ state, actions, isLoaded }: WizardProps) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="p-20 text-center text-slate-400">
        Loading your journey...
      </div>
    );
  }

  const currentStage = roadmapData.stages[state.currentStage];
  const currentStep = currentStage.steps[state.currentStep || 0];
  const totalSteps = roadmapData.stages.reduce(
    (acc, s) => acc + s.steps.length,
    0,
  );
  const completedTotal = state.completedSteps.size;
  const progressPercent = Math.round((completedTotal / totalSteps) * 100);

  const handleNext = () => {
    const nextStepIdx = (state.currentStep || 0) + 1;
    if (nextStepIdx < currentStage.steps.length) {
      actions.setCurrentStep(nextStepIdx);
    } else if (state.currentStage + 1 < roadmapData.stages.length) {
      actions.setStage(state.currentStage + 1);
      actions.setCurrentStep(0);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    const prevStepIdx = (state.currentStep || 0) - 1;
    if (prevStepIdx >= 0) {
      actions.setCurrentStep(prevStepIdx);
    } else if (state.currentStage - 1 >= 0) {
      const prevStage = roadmapData.stages[state.currentStage - 1];
      actions.setStage(state.currentStage - 1);
      actions.setCurrentStep(prevStage.steps.length - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Overall Journey Progress
            </span>
            <span className="text-sm font-bold text-[#0d9488]">
              {progressPercent}% ({completedTotal}/{totalSteps} steps)
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d9488] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => setIsVaultOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-[#0d9488] hover:bg-[#ebf5f4] transition-all"
        >
          📁 Document Vault
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[600px] mb-12">
        <aside className="w-full md:w-[320px] bg-slate-50 border-r border-slate-200 p-4 md:p-6 overflow-y-auto max-h-[800px]">
          <ProgressTree
            state={state}
            onSelectStep={(stageIdx, stepIdx) => {
              actions.setStage(stageIdx);
              actions.setCurrentStep(stepIdx);
            }}
          />
        </aside>

        <main className="flex-1 p-4 md:p-8 bg-white overflow-y-auto">
          <StepDetail
            step={currentStep}
            stage={currentStage}
            state={state}
            onToggleComplete={actions.toggleComplete}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={state.currentStage === 0 && state.currentStep === 0}
            isLast={
              state.currentStage === roadmapData.stages.length - 1 &&
              state.currentStep === currentStage.steps.length - 1
            }
          />
        </main>
      </div>

      <DocumentVault
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        state={state}
        onToggleDocument={actions.toggleDocument}
        onUpdateNote={actions.updateNote}
        onUpload={actions.uploadDocument}
        onClearUpload={actions.clearDocument}
      />
    </div>
  );
}
