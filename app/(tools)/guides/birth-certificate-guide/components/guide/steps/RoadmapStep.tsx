import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, Upload, X, Check, AlertTriangle } from "lucide-react";
import guideData from "@/data/birth-certificate-guide-data.json";
import { cn } from "@/lib/utils";

interface RoadmapStepProps {
  caseType: string | null;
  personType: string | null;
  documentNeed: string | null;
  checkedDocuments: string[];
  onToggleDocument: (id: string) => void;
}

const RoadmapStep = ({
  caseType,
  personType,
  documentNeed,
  checkedDocuments,
  onToggleDocument,
}: RoadmapStepProps) => {
  const { title, estimated_timeline, stations, documents_checklist } =
    guideData.wizard.roadmap;

  const [activeStation, setActiveStation] = useState<string | null>(null);

  const filteredDocs = documents_checklist.filter((doc: any) => {
    if (doc.category && doc.category !== caseType) return false;
    // Add logic for personType/documentNeed filtering if specified in JSON
    if (doc.id === "applicant_id" && personType === "child") return false;
    if (doc.id === "hospital_slip" && documentNeed === "replacement") return false;
    return true;
  });

  const checkedCount = checkedDocuments.filter(id => filteredDocs.some((d: any) => d.id === id)).length;
  const totalDocs = filteredDocs.length;

  const selectedStation = stations.find(s => s.id === activeStation);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-[1.75rem] font-extrabold text-slate-900 mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
          {title}
        </h2>
        <p className="text-[0.95rem] text-slate-500 mb-8 leading-normal font-['Plus_Jakarta_Sans',system-ui]">
          Estimated completion: <span className="text-teal-600 font-bold">{estimated_timeline}</span>
        </p>
      </div>

      {/* Stations / Phases */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 font-['Plus_Jakarta_Sans',system-ui]">Application Journey</h3>
        <div className="flex flex-wrap items-start justify-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            {stations.map((station: any, i: number) => (
            <div key={station.id} className="flex items-start gap-4">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                    setActiveStation(activeStation === station.id ? null : station.id)
                }
                className="flex flex-col items-center gap-2 bg-transparent border-none p-1 cursor-pointer"
                >
                <div
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-[1.1rem] shadow-sm transition-all",
                        activeStation === station.id ? "bg-teal-700 scale-110" : "bg-teal-600"
                    )}
                >
                    {i + 1}
                </div>

                <span className="text-[0.8rem] font-semibold text-slate-800 text-center max-w-22 leading-[1.3] font-['Plus_Jakarta_Sans',system-ui]">
                    {station.title}
                </span>
                </motion.button>

                {i < stations.length - 1 && (
                <div className="w-8 h-0.5 bg-teal-200 mt-6 shrink-0 hidden sm:block" />
                )}
            </div>
            ))}
        </div>

        {/* Station Detail */}
        <AnimatePresence>
            {activeStation !== null && selectedStation && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
            >
                <div className="p-6 rounded-xl bg-white border-2 border-teal-600 relative shadow-lg">
                    <button
                        onClick={() => setActiveStation(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h4 className="text-[1.1rem] font-bold text-teal-900 mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                        Step {stations.indexOf(selectedStation) + 1}: {selectedStation.title}
                    </h4>
                    <p className="text-[0.875rem] text-slate-600 mb-4 leading-relaxed font-['Plus_Jakarta_Sans',system-ui]">
                        {selectedStation.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h5 className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider">Key Tasks:</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedStation.tasks.map((task: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-['Plus_Jakarta_Sans',system-ui]">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </section>

      {/* Checklist */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[1.15rem] font-bold text-slate-900 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                Required Documents ({checkedCount}/{totalDocs})
            </h3>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-teal-600 text-teal-700 text-[0.85rem] font-bold bg-white cursor-pointer font-['Plus_Jakarta_Sans',system-ui]"
            >
                <Download className="w-3.5 h-3.5" />
                Print List
            </motion.button>
        </div>

        <div className="flex flex-col gap-3">
            {filteredDocs.map((doc: any) => {
            const isChecked = checkedDocuments.includes(doc.id);

            return (
                <motion.div
                key={doc.id}
                whileHover={{ y: -1 }}
                className={cn(
                    "p-4 rounded-xl flex items-center justify-between transition-all border",
                    isChecked ? "bg-teal-50/30 border-teal-200" : "bg-white border-slate-100"
                )}
                >
                <div className="flex items-center gap-3 flex-1 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                    <button
                        onClick={() => onToggleDocument(doc.id)}
                        className={cn(
                            "w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-all border-2",
                            isChecked ? "bg-teal-600 border-teal-600" : "bg-white border-slate-200"
                        )}
                    >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-[0.9rem] font-bold",
                            isChecked ? "text-slate-400 line-through" : "text-slate-900"
                        )}>
                        {doc.label}
                        </span>

                        {doc.required && (
                        <span className="px-2 py-[1px] rounded-md bg-red-50 text-red-600 text-[0.7rem] font-bold">
                            Required
                        </span>
                        )}
                    </div>

                    <p className="text-[0.8rem] text-slate-500 mt-0.5">
                        {doc.description}
                    </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-200 text-slate-600 text-[0.8rem] font-bold hover:bg-slate-50 transition-all shrink-0 ml-4 font-['Plus_Jakarta_Sans',system-ui]"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                </motion.button>
                </motion.div>
            );
            })}
        </div>
      </section>
    </motion.div>

  );
};

export default RoadmapStep;
