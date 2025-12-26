import React from 'react';
import { Button } from "@/components/ui/button";
import { WizardState } from '../../(main)/dashboard/hooks/useWizard';

interface StepCardProps {
    step: any; // Using any for roadmap step object for simplicity, ideally define proper type
    idx: number;
    state: WizardState;
    onToggleComplete: (id: string, e: React.MouseEvent) => void;
    onToggleCollapse: (id: string) => void;
    isActive: boolean;
}

export function StepCard({ step, idx, state, onToggleComplete, onToggleCollapse, isActive }: StepCardProps) {
    const isCompleted = state.completedSteps.has(step.id);
    const isCollapsed = state.collapsedSteps[step.id] && !isActive;
    
    // Role filtering
    let isDimmed = false;
    if (state.role !== 'both') {
        const who = step.who?.toLowerCase() || '';
        if (who !== 'both' && who !== state.role) isDimmed = true;
    }

    return (
        <div 
            id={`step-${step.id}`}
            className={`
                bg-white border rounded-xl transition-all duration-300 overflow-hidden scrolling-smooth
                ${isActive ? 'shadow-md border-teal-500 ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300'}
                ${isDimmed ? 'opacity-50 grayscale' : 'opacity-100'}
            `}
        >
            {/* Header */}
            <div 
                className={`p-5 cursor-pointer flex items-start justify-between gap-4 ${isCompleted ? 'bg-gray-50/50' : 'bg-white'}`}
                onClick={() => onToggleCollapse(step.id)}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{step.id}</span>
                        {isCompleted && <span className="text-teal-600 text-xs font-semibold px-2 py-0.5 bg-teal-50 rounded-full">Completed</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{step.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                        {step.who && (
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium flex items-center gap-1">
                                👤 {step.who}
                            </span>
                        )}
                        {step.where && (
                            <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 font-medium flex items-center gap-1">
                                📍 {step.where}
                            </span>
                        )}
                        {step.timeline && (
                            <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 font-medium flex items-center gap-1">
                                ⏱️ {step.timeline}
                            </span>
                        )}
                        {step.fee && (
                            <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1">
                                💰 {step.fee}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 pt-1">
                     <Button
                        variant={isCompleted ? "secondary" : "default"}
                        size="sm"
                        onClick={(e) => onToggleComplete(step.id, e)}
                        className={`
                            ${isCompleted 
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                : 'bg-teal-600 hover:bg-teal-700 text-white'}
                        `}
                    >
                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                    </Button>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-6">
                    {step.actions && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Actions Required:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                                {step.actions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    )}

                    {step.inputs && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Inputs Needed:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                                {step.inputs.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                            </ul>
                        </div>
                    )}

                    {step.documents && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Documents Required:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                                {step.documents.map((d: string, idx: number) => <li key={idx}>{d}</li>)}
                            </ul>
                        </div>
                    )}

                    {step.output && (
                         <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                            <h4 className="text-xs font-bold text-teal-800 uppercase mb-1">Success Condition</h4>
                            <p className="text-sm text-teal-900">{step.output}</p>
                        </div>
                    )}

                    {step.notes && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex gap-3 text-sm">
                            <span className="text-lg">ℹ️</span>
                            <div className="text-blue-900">{step.notes}</div>
                        </div>
                    )}

                    {step.pakistanSpecific && (
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex gap-3 text-sm">
                            <span className="text-lg">🇵🇰</span>
                            <div>
                                <strong className="block text-amber-900 text-xs uppercase tracking-wide">Pakistan Specific</strong>
                                <div className="text-amber-900">{step.pakistanSpecific}</div>
                            </div>
                        </div>
                    )}

                    {/* Example of specialized buttons based on ID, per original code */}
                    {step.id === 'II-07' && (
                        <Button variant="outline" className="w-full text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100" onClick={(e) => { e.stopPropagation(); alert('Calculator Tool'); }}>
                            💰 I-864 Calculator
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
