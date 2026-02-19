import React, { useState, useEffect } from "react";
import { WizardState } from "../../(main)/dashboard/hooks/useWizard";
import { roadmapData } from "../../../data/roadmap";

interface ProgressTreeProps {
  state: WizardState;
  onSelectStep: (stageIdx: number, stepIdx: number) => void;
}

export function ProgressTree({ state, onSelectStep }: ProgressTreeProps) {
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>(
    {},
  );

  // Sync expanded state with active stage
  useEffect(() => {
    setExpandedStages((prev) => ({
      ...prev,
      [state.currentStage]: true,
    }));
  }, [state.currentStage]);

  const toggleStage = (sIdx: number) => {
    setExpandedStages((prev) => ({
      ...prev,
      [sIdx]: !prev[sIdx],
    }));
  };

  return (
    <div id="sidebar-stages" className="space-y-2">
      {roadmapData.stages.map((stage, sIdx) => {
        const isActiveStage = state.currentStage === sIdx;
        const isExpanded = expandedStages[sIdx];
        const completedInStage = stage.steps.filter((s) =>
          state.completedSteps.has(s.id),
        ).length;
        const stageProgress = Math.round(
          (completedInStage / stage.steps.length) * 100,
        );

        return (
          <div key={stage.id} className="mb-4">
            <div
              className={`p-3 rounded-lg cursor-pointer transition-all flex flex-col gap-2 relative ${
                isActiveStage
                  ? "bg-[#ebf5f4] text-primary"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => {
                toggleStage(sIdx);
                if (!isActiveStage) onSelectStep(sIdx, 0);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Stage {stage.id}
                </span>
                <span
                  className={`text-sm transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              <span className="text-[13px] font-bold leading-tight pr-4">
                {stage.name.split(":")[1]?.trim() || stage.name}
              </span>
              <div className="w-full bg-slate-200/50 rounded-full h-1 mt-1">
                <div
                  className={`h-full rounded-full transition-all ${isActiveStage ? "bg-[#0d9488]" : "bg-slate-400"}`}
                  style={{ width: `${stageProgress}%` }}
                ></div>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-2 ml-4 border-l-2 border-slate-100 pl-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {stage.steps.map((step, stIdx) => {
                  const isCurrentStep =
                    state.currentStep === stIdx && isActiveStage;
                  const isStepCompleted = state.completedSteps.has(step.id);

                  return (
                    <button
                      key={step.id}
                      onClick={() => onSelectStep(sIdx, stIdx)}
                      className={`w-full text-left p-2 rounded-md transition-all flex items-center justify-between gap-2 ${
                        isCurrentStep
                          ? "bg-white shadow-sm ring-1 ring-slate-100 text-primary font-bold"
                          : "text-slate-600 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <span className="text-[13px] line-clamp-2 leading-tight">
                        {step.id}: {step.name}
                      </span>
                      <span
                        className={`shrink-0 text-lg ${isStepCompleted ? "text-[#0d9488]" : "text-slate-200"}`}
                      >
                        {isStepCompleted ? "✓" : "○"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
