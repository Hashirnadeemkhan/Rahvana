import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, Upload, X, Check } from "lucide-react";

interface Phase {
  id: number;
  title: string;
  duration: string;
  description: string;
}

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

interface RoadmapData {
  title: string;
  estimated_timeline: string;
  phases: Phase[];
  documents_checklist: DocumentItem[];
}

interface RoadmapStepProps {
  checkedDocuments: string[];
  onToggleDocument: (id: string) => void;
  data?: RoadmapData;
}

const RoadmapStep = ({ checkedDocuments, onToggleDocument, data }: RoadmapStepProps) => {
  const title = data?.title || "Your Personalized Roadmap";
  const estimatedTimeline = data?.estimated_timeline || "";
  const phases = data?.phases || [];
  const documentsChecklist = data?.documents_checklist || [];

  const [activePhase, setActivePhase] = useState<number | null>(null);

  const checkedCount = checkedDocuments.length;
  const totalDocs = documentsChecklist.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Heading */}
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)]
                     mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        {title}
      </h2>
      <p className="text-[0.95rem] mb-8">
        <span className="text-[hsl(215_16%_47%)]">Estimated timeline: </span>
        <span className="text-[hsl(168_80%_30%)] font-bold">{estimatedTimeline}</span>
      </p>

      {/* Timeline Phases */}
      <div className="flex justify-center items-start gap-2.5
                      mb-10 p-6
                      rounded-xl
                      bg-[hsl(210_20%_99%)]
                      border border-[hsl(214_32%_93%)]">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex items-start gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              className="flex flex-col items-center gap-2 cursor-pointer
                         bg-transparent border-none p-1"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                               font-bold text-white text-[1.1rem] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]
                               shadow-[0_4px_12px_hsl(168_80%_30%/0.3)]
                               ${activePhase === phase.id 
                                  ? 'bg-[hsl(168_80%_30%)]'
                                  : 'bg-linear-to-br from-[hsl(168_80%_30%)] to-[hsl(168_70%_38%)]'}`}>
                {phase.id}
              </div>
              <span className="text-[0.8rem] font-semibold text-[hsl(220_20%_20%)]
                               text-center max-w-22.5 leading-[1.3]">
                {phase.title}
              </span>
              <span className="flex items-center gap-1 text-[0.72rem] text-[hsl(215_16%_55%)]">
                <Clock className="w-3 h-3" /> {phase.duration}
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
            className="overflow-hidden mb-6"
          >
            <div className="p-5 rounded-xl bg-[hsl(168_60%_96%)] border border-[hsl(168_50%_88%)]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[1rem] font-bold text-[hsl(168_80%_25%)]
                               font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                  Phase {activePhase}: {phases.find(p => p.id === activePhase)?.title}
                </h4>
                <button onClick={() => setActivePhase(null)} className="text-[hsl(215_16%_50%)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[0.875rem] text-[hsl(168_50%_20%)] leading-6">
                {phases.find(p => p.id === activePhase)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Checklist Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[1.15rem] font-bold text-[hsl(220_20%_10%)]
                       font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
          Required Documents ({checkedCount}/{totalDocs})
        </h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                     border-[1.5px] border-[hsl(168_80%_30%)]
                     text-[hsl(168_80%_30%)] font-semibold text-[0.85rem]
                     bg-transparent cursor-pointer"
        >
          <Download className="w-4 h-4" /> Print Checklist
        </motion.button>
      </div>

      {/* Documents Checklist Items */}
      <div className="flex flex-col gap-3">
        {documentsChecklist.map((doc) => {
          const isChecked = checkedDocuments.includes(doc.id);
          return (
            <motion.div
              key={doc.id}
              whileHover={{ y: -1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-all
                          ${isChecked ? 'bg-[hsl(168_60%_98%)] border-[hsl(168_60%_80%)]' : 'bg-white border border-[hsl(214_32%_91%)]'}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => onToggleDocument(doc.id)}
                  className={`w-5.5 h-5.5 flex items-center justify-center rounded-md border-2
                              ${isChecked ? 'bg-[hsl(168_80%_30%)] border-[hsl(168_80%_30%)]' : 'bg-white border-[hsl(214_32%_85%)]'}
                              cursor-pointer shrink-0 transition-all`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.9rem] font-semibold
                                     ${isChecked ? 'line-through opacity-60' : 'text-[hsl(220_20%_15%)]'}`}>
                      {doc.label}
                    </span>
                    {doc.required && (
                      <span className="px-2 py-0.5 rounded-md text-[0.7rem] font-semibold
                                       bg-[hsl(0_84%_95%)] text-[hsl(0_70%_50%)]">
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                           border-[1.5px] border-[hsl(168_80%_30%)]
                           text-[hsl(168_80%_30%)] font-semibold text-[0.8rem]
                           bg-transparent shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RoadmapStep;