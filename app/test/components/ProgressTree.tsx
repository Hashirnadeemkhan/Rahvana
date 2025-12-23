import React from 'react';
import { WizardState } from '../../(main)/dashboard/hooks/useWizard';
import { roadmapData } from '../../(main)/dashboard/data/roadmap';

interface ProgressTreeProps {
    state: WizardState;
    onSelectStep: (stageIdx: number, stepIdx: number) => void;
}

export function ProgressTree({ state, onSelectStep }: ProgressTreeProps) {
    return (
        <div id="sidebar-stages" className="space-y-2">
            {roadmapData.stages.map((stage, sIdx) => {
                const isActiveStage = state.currentStage === sIdx;
                const completedInStage = stage.steps.filter(s => state.completedSteps.has(s.id)).length;
                const stageProgress = Math.round((completedInStage / stage.steps.length) * 100);

                return (
                    <div key={stage.id} className="mb-4">
                        <div 
                            className={`p-3 rounded-lg cursor-pointer transition-all flex flex-col gap-2 ${
                                isActiveStage ? 'bg-[#ebf5f4] text-[#0d9488]' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            onClick={() => onSelectStep(sIdx, 0)}
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Stage {stage.id}
                            </span>
                            <span className="text-[13px] font-bold leading-tight">
                                {stage.name.split(':')[1]?.trim() || stage.name}
                            </span>
                            <div className="w-full bg-slate-200/50 rounded-full h-1 mt-1">
                                <div 
                                    className={`h-full rounded-full transition-all ${isActiveStage ? 'bg-[#0d9488]' : 'bg-slate-400'}`} 
                                    style={{ width: `${stageProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {isActiveStage && (
                            <div className="mt-2 ml-2 border-l-2 border-slate-100 pl-2 space-y-1">
                                {stage.steps.map((step, stIdx) => {
                                    const isCurrentStep = state.currentStep === stIdx;
                                    const isStepCompleted = state.completedSteps.has(step.id);

                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => onSelectStep(sIdx, stIdx)}
                                            className={`w-full text-left p-2 rounded-md transition-all flex items-center justify-between gap-2 ${
                                                isCurrentStep 
                                                    ? 'bg-white shadow-sm ring-1 ring-slate-100 text-[#0d9488] font-bold' 
                                                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                            }`}
                                        >
                                            <span className="text-[13px] line-clamp-2 leading-tight">
                                                {step.id}: {step.name}
                                            </span>
                                            <span className={`flex-shrink-0 text-lg ${isStepCompleted ? 'text-[#0d9488]' : 'text-slate-200'}`}>
                                                {isStepCompleted ? '✓' : '○'}
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
