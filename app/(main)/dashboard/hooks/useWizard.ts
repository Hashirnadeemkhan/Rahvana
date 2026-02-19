import { useState, useEffect, useCallback } from 'react';
import { roadmapData } from '../../../../data/roadmap';

export interface WizardState {
    currentStage: number;
    currentStep: number | null;
    completedSteps: Set<string>;
    collapsedSteps: Record<string, boolean>;
    role: 'both' | 'petitioner' | 'beneficiary';
    filingType: 'online' | 'paper' | 'both';
    documentChecklist: Record<string, boolean>;
    docUploads: Record<string, { name: string; size: number; lastModified: number }>;
    notes: Record<string, string>;
    started: boolean;
}

const STORAGE_KEY = 'rahvanaWizardState';

export function useWizard() {
    // Initialize state with defaults
    const [state, setState] = useState<WizardState>({
        currentStage: 0,
        currentStep: null,
        completedSteps: new Set(),
        collapsedSteps: {},
        role: 'both',
        filingType: 'online',
        documentChecklist: {},
        docUploads: {},
        notes: {},
        started: false,
    });

    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Reconstruct Set from array
                if (parsed.completedSteps) {
                    parsed.completedSteps = new Set(parsed.completedSteps);
                }
                setState(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to load wizard state', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever state changes (if loaded)
    useEffect(() => {
        if (!isLoaded) return;
        const stateToSave = {
            ...state,
            completedSteps: Array.from(state.completedSteps), // Serialize Set
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [state, isLoaded]);

    const normalizeState = useCallback(() => {
        setState(prev => {
            let { currentStage, currentStep } = prev;

            if (currentStage < 0) currentStage = 0;
            if (currentStage >= roadmapData.stages.length) currentStage = roadmapData.stages.length - 1;

            const stage = roadmapData.stages[currentStage];

            // If current step is invalid, find the first incomplete step
            if (currentStep === null || currentStep < 0 || currentStep >= stage.steps.length) {
                const firstIncomplete = stage.steps.findIndex(s => !prev.completedSteps.has(s.id));
                currentStep = firstIncomplete === -1 ? 0 : firstIncomplete;
            }

            // Auto-expand current step
            const stepId = stage.steps[currentStep]?.id;
            const newCollapsed = { ...prev.collapsedSteps };
            if (stepId) {
                newCollapsed[stepId] = false;
            }

            return {
                ...prev,
                currentStage,
                currentStep,
                collapsedSteps: newCollapsed
            };
        });
    }, []);

    // Run normalize once after load
    useEffect(() => {
        if (isLoaded) {
            normalizeState();
        }
    }, [isLoaded, normalizeState]);

    const actions = {
        setStage: (idx: number) => {
            setState(prev => ({ ...prev, currentStage: idx, currentStep: null }));
            setTimeout(normalizeState, 0);
        },
        setCurrentStep: (idx: number) => {
            setState(prev => {
                const stage = roadmapData.stages[prev.currentStage];
                const step = stage.steps[idx];
                const newCollapsed = { ...prev.collapsedSteps };
                if (step) {
                    newCollapsed[step.id] = false; // Expand when activated
                }
                return { ...prev, currentStep: idx, collapsedSteps: newCollapsed };
            });
        },
        toggleComplete: (stepId: string) => {
            setState(prev => {
                const newCompleted = new Set(prev.completedSteps);
                const newCollapsed = { ...prev.collapsedSteps };
                let newStepIdx = prev.currentStep;

                if (newCompleted.has(stepId)) {
                    newCompleted.delete(stepId);
                    newCollapsed[stepId] = false; // Keep expanded if un-completing
                } else {
                    newCompleted.add(stepId);
                    newCollapsed[stepId] = true; // Collapse on complete

                    // Auto-advance if we just completed the current step
                    const stage = roadmapData.stages[prev.currentStage];
                    const currentStepId = stage.steps[prev.currentStep ?? 0]?.id;
                    if (currentStepId === stepId) {
                        const nextIdx = stage.steps.findIndex(s => !newCompleted.has(s.id));
                        if (nextIdx !== -1) {
                            newStepIdx = nextIdx;
                        }
                    }
                }

                return {
                    ...prev,
                    completedSteps: newCompleted,
                    collapsedSteps: newCollapsed,
                    currentStep: newStepIdx
                };
            });
        },
        toggleCollapse: (stepId: string) => {
            setState(prev => ({
                ...prev,
                collapsedSteps: {
                    ...prev.collapsedSteps,
                    [stepId]: !prev.collapsedSteps[stepId]
                }
            }));
        },
        setRole: (role: WizardState['role']) => setState(prev => ({ ...prev, role })),
        setFilingType: (type: WizardState['filingType']) => setState(prev => ({ ...prev, filingType: type })),
        updateNote: (doc: string, note: string) => {
            setState(prev => ({ ...prev, notes: { ...prev.notes, [doc]: note } }));
        },
        toggleDocument: (doc: string) => {
            setState(prev => ({
                ...prev,
                documentChecklist: {
                    ...prev.documentChecklist,
                    [doc]: !prev.documentChecklist[doc]
                }
            }));
        },
        uploadDocument: (doc: string, file: File) => {
            setState(prev => ({
                ...prev,
                docUploads: {
                    ...prev.docUploads,
                    [doc]: { name: file.name, size: file.size, lastModified: file.lastModified }
                }
            }));
        },
        clearDocument: (doc: string) => {
            setState(prev => {
                const newUploads = { ...prev.docUploads };
                delete newUploads[doc];
                return { ...prev, docUploads: newUploads };
            });
        },
        resetProgress: () => {
            if (confirm('Reset all progress? This cannot be undone.')) {
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload();
            }
        }
    };

    return { state, actions, isLoaded };
}
