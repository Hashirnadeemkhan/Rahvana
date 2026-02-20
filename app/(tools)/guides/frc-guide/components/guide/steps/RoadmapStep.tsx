import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, Upload, X, Check } from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

interface RoadmapStepProps {
  checkedDocuments: string[];
  onToggleDocument: (id: string) => void;
}

const RoadmapStep = ({
  checkedDocuments,
  onToggleDocument,
}: RoadmapStepProps) => {
  const { title, estimated_timeline, phases, documents_checklist } =
    guideData.wizard.roadmap;

  const [activePhase, setActivePhase] = useState<number | null>(null);

  const checkedCount = checkedDocuments.length;
  const totalDocs = documents_checklist.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Title */}
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)] mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        {title}
      </h2>

      <p className="text-[0.95rem] mb-8">
        <span className="text-[hsl(215_16%_47%)]">Estimated timeline: </span>
        <span className="text-[hsl(168_80%_30%)] font-bold">
          {estimated_timeline}
        </span>
      </p>

      {/* Timeline */}
      <div className="flex items-start justify-center gap-2 mb-10 p-6 rounded-2xl bg-[hsl(210_20%_99%)] border border-[hsl(214_32%_93%)]">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex items-start gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setActivePhase(activePhase === phase.id ? null : phase.id)
              }
              className="flex flex-col items-center gap-2 bg-transparent border-none p-1 cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-[1.1rem] shadow-[0_4px_12px_hsl(168_80%_30%/0.3)] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif] ${
                  activePhase === phase.id
                    ? "bg-[hsl(168_80%_30%)]"
                    : "bg-[linear-gradient(135deg,hsl(168_80%_30%),hsl(168_70%_38%))]"
                }`}
              >
                {phase.id}
              </div>

              <span className="text-[0.8rem] font-semibold text-[hsl(220_20%_20%)] text-center max-w-22 leading-[1.3]">
                {phase.title}
              </span>

              <span className="flex items-center gap-1 text-[0.72rem] text-[hsl(215_16%_55%)]">
                <Clock className="w-3 h-3" />
                {phase.duration}
              </span>
            </motion.button>

            {i < phases.length - 1 && (
              <div className="w-10 h-0.5 bg-[hsl(168_80%_30%)] mt-6 opacity-40" />
            )}
          </div>
        ))}
      </div>

      {/* Phase Detail */}
      <AnimatePresence>
        {activePhase !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-5 rounded-[12px] bg-[hsl(168_60%_96%)] border border-[hsl(168_50%_88%)]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[1rem] font-bold text-[hsl(168_80%_25%)] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                  Phase {activePhase}: {phases[activePhase - 1]?.title}
                </h4>

                <button
                  onClick={() => setActivePhase(null)}
                  className="text-[hsl(215_16%_50%)] bg-none border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[0.875rem] text-[hsl(168_50%_20%)] leading-normal">
                {phases[activePhase - 1]?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[1.15rem] font-bold text-[hsl(220_20%_10%)] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
          Required Documents ({checkedCount}/{totalDocs})
        </h3>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border-[1.5px] border-[hsl(168_80%_30%)] text-[hsl(168_80%_30%)] text-[0.85rem] font-semibold bg-transparent cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Print Checklist
        </motion.button>
      </div>

      {/* Checklist Items */}
      <div className="flex flex-col gap-3">
        {documents_checklist.map((doc) => {
          const isChecked = checkedDocuments.includes(doc.id);

          return (
            <motion.div
              key={doc.id}
              whileHover={{ y: -1 }}
              className={`p-4 rounded-[12px] flex items-center justify-between transition-all ${
                isChecked
                  ? "bg-[hsl(168_60%_98%)] border border-[hsl(168_60%_80%)]"
                  : "bg-white border border-[hsl(214_32%_91%)]"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleDocument(doc.id)}
                  className={`w-5.5 h-5.5 rounded-[6px] flex items-center justify-center shrink-0 transition-all ${
                    isChecked
                      ? "bg-[hsl(168_80%_30%)] border-2 border-[hsl(168_80%_30%)]"
                      : "bg-white border-2 border-[hsl(214_32%_85%)]"
                  }`}
                >
                  {isChecked && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[0.9rem] font-semibold text-[hsl(220_20%_15%)] ${
                        isChecked ? "line-through opacity-60" : ""
                      }`}
                    >
                      {doc.label}
                    </span>

                    {doc.required && (
                      <span className="px-2 py-[1px] rounded-[6px] bg-[hsl(0_84%_95%)] text-[hsl(0_70%_50%)] text-[0.7rem] font-semibold">
                        Required
                      </span>
                    )}
                  </div>

                  <p className="text-[0.8rem] text-[hsl(215_16%_55%)] mt-0.5">
                    {doc.description}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-[1.5px] border-[hsl(168_80%_30%)] text-[hsl(168_80%_30%)] text-[0.8rem] font-semibold bg-transparent shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RoadmapStep;
