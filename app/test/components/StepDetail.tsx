import React from 'react';
import { WizardState } from '../../(main)/dashboard/hooks/useWizard';

interface StepDetailProps {
    step: any;
    stage: any;
    state: WizardState;
    onToggleComplete: (id: string, e: React.MouseEvent) => void;
    onNext: () => void;
    onPrev: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export function StepDetail({ 
    step, 
    stage, 
    state, 
    onToggleComplete, 
    onNext, 
    onPrev, 
    isFirst, 
    isLast 
}: StepDetailProps) {
    const isCompleted = state.completedSteps.has(step.id);

    return (
        <div id="step-content">
            <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[13px] font-semibold mb-3">
                    Stage {stage.id} • Step {step.id}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{step.name}</h2>
                <div className="text-slate-500 text-base leading-relaxed border-b border-slate-200 pb-6 mb-8">
                    {step.description || `This step involves preparing and submitting the necessary ${step.name} documents.`}
                </div>

                {/* Checklist / Actions */}
                <div className="mb-10">
                    <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                        <span>📋</span> Required Actions & Documents
                    </h4>
                    <div className="space-y-3">
                        {step.actions?.map((action: string, idx: number) => (
                            <label 
                                key={`action-${idx}`}
                                className={`flex gap-4 items-start p-4 border rounded-lg cursor-pointer transition-all hover:border-[#0d9488] ${
                                    isCompleted ? 'bg-slate-50 opacity-80' : 'bg-white border-slate-200'
                                }`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isCompleted}
                                    onChange={(e) => onToggleComplete(step.id, e as any)}
                                    className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer accent-[#0d9488] mt-1"
                                />
                                <div className="flex-1">
                                    <span className={`text-[15px] font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {action}
                                    </span>
                                </div>
                            </label>
                        ))}
                        {step.documents?.map((doc: string, idx: number) => (
                            <label 
                                key={`doc-${idx}`}
                                className={`flex gap-4 items-start p-4 border rounded-lg cursor-pointer transition-all hover:border-[#0d9488] ${
                                    isCompleted ? 'bg-slate-50 opacity-80' : 'bg-white border-slate-200'
                                }`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isCompleted}
                                    onChange={(e) => onToggleComplete(step.id, e as any)}
                                    className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer accent-[#0d9488] mt-1"
                                />
                                <div className="flex-1">
                                    <span className={`text-[15px] font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {doc} (Document)
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Succession Condition */}
                {step.output && (
                    <div className="bg-teal-50 border border-teal-100 rounded-lg p-5 mb-8">
                        <h4 className="text-[12px] font-bold text-[#0d9488] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span>✅</span> Success Condition
                        </h4>
                        <p className="text-[#0f766e] text-[15px] font-medium">{step.output}</p>
                    </div>
                )}

                {/* Help/Notes */}
                {step.notes && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
                        <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span>💡</span> Pro Tip
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.notes}</p>
                    </div>
                )}

                {/* Pakistan Specific */}
                {step.pakistanSpecific && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 border-l-4 border-l-amber-500">
                        <h4 className="text-[12px] font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span>🇵🇰</span> Pakistan Specific Guidance
                        </h4>
                        <p className="text-amber-900 text-sm leading-relaxed font-medium">{step.pakistanSpecific}</p>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
                <button 
                    onClick={onPrev}
                    disabled={isFirst}
                    className={`px-6 py-3 rounded-lg font-bold transition-all border border-slate-200 ${
                        isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                    ← Previous Step
                </button>
                <div className="flex gap-4">
                    <button 
                        onClick={(e) => onToggleComplete(step.id, e as any)}
                        className={`px-8 py-3 rounded-lg font-bold transition-all ${
                            isCompleted 
                                ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' 
                                : 'bg-[#0d9488] text-white hover:bg-[#0f766e] shadow-md hover:-translate-y-px'
                        }`}
                    >
                        {isCompleted ? '✓ Completed' : 'Mark Step Complete'}
                    </button>
                    {!isLast && (
                        <button 
                            onClick={onNext}
                            className="px-6 py-3 bg-[#334155] text-white rounded-lg font-bold hover:bg-[#1e293b] transition-all shadow-md hover:-translate-y-px"
                        >
                            Next Step →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
