"use client";

import { useStore } from "@/lib/store";
import { immigrationSteps } from "@/lib/steps";

import IslandCard from "../components/IR-pathway-roadmap/IslandCard";
import StepDialog from "../components/IR-pathway-roadmap/StepDialog";
import ProgressBar from "../components/IR-pathway-roadmap/ProgressBar";
import CompletionDialog from "../components/IR-pathway-roadmap/CompletionDialog";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function Home() {
  const { completedSteps: completed, completeStep } = useStore();
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  const progress = (completed.length / immigrationSteps.length) * 100;
  const isComplete = completed.length === immigrationSteps.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      setShowCompletionDialog(true);
    }
  }, [isComplete]);

  if (!mounted) return null;

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all">
        {/* Header with Progress */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              <div className="animate-slide-left">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                  Pakistan to USA Spousal Journey
                </h1>
                <p className="text-muted-foreground mt-2">Track your immigration pathway step by step</p>
              </div>
              <ProgressBar completed={completed.length} total={immigrationSteps.length} />
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-16 pb-20">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {immigrationSteps.map((step, index) => (
              <div
                key={step.id}
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <IslandCard
                  step={step}
                  isCompleted={completed.includes(step.id)}
                  onClick={() => setOpenStep(step.id)}
                />
              </div>
            ))}
          </div>
        </main>

        <StepDialog
          step={immigrationSteps.find((s) => s.id === openStep)}
          isCompleted={completed.includes(openStep || 0)}
          open={!!openStep}
          onOpenChange={(o) => !o && setOpenStep(null)}
          onComplete={() => {
            if (openStep) {
              completeStep(openStep);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }
          }}
        />

        <CompletionDialog
          open={showCompletionDialog}
          onOpenChange={setShowCompletionDialog}
          progress={progress}
        />
      </div>
    </>
  );
}
