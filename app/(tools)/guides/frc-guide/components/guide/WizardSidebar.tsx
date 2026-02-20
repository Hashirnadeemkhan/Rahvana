import { motion } from "framer-motion";
import { ClipboardList, MapPin, Map, Search, Star, Bookmark } from "lucide-react";
import { type WizardStepId } from "@/types/frc-wizard";

const STEP_ICONS: Record<string, React.ElementType> = {
  document_need: ClipboardList,
  location: MapPin,
  roadmap: Map,
  office_finder: Search,
  validation: Star,
};

const STEP_LABELS: Record<string, string> = {
  document_need: "Document Need",
  location: "Location",
  roadmap: "Roadmap",
  office_finder: "Office Finder",
  validation: "Validation",
};

interface WizardSidebarProps {
  currentStep: number;
  steps: WizardStepId[];
  onStepClick: (step: number) => void;
}

type StepStatus = "completed" | "active" | "upcoming";

const getStatus = (index: number, currentStep: number): StepStatus => {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "active";
  return "upcoming";
};

const WizardSidebar = ({ currentStep, steps, onStepClick }: WizardSidebarProps) => {
  const progress = currentStep + 1;
  const total = steps.length;
  const progressPercent = (progress / total) * 100;

  return (
    <aside className="w-70 min-w-70 bg-white border-r border-[hsl(214_32%_91%)] flex flex-col h-full overflow-hidden">
      
      {/* Add to Active Wizards */}
      <div className="pt-5 px-4 pb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full flex items-center justify-center gap-2
            py-2.5 px-4
            rounded-[10px]
            text-white text-sm font-semibold
            shadow-[0_2px_8px_hsl(168_80%_30%/0.3)]
            bg-[linear-gradient(135deg,hsl(168_80%_30%),hsl(168_70%_38%))]
          "
        >
          <Bookmark className="w-4 h-4" />
          Add to Active Wizards
        </motion.button>
      </div>

      {/* Steps */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {steps.map((stepId, index) => {
          const status = getStatus(index, currentStep);
          const Icon = STEP_ICONS[stepId] || ClipboardList;
          const label = STEP_LABELS[stepId] || stepId;
          const isClickable = status === "completed";

          return (
            <div key={stepId}>
              <motion.button
                onClick={() => isClickable && onStepClick(index)}
                whileHover={isClickable ? { x: 4 } : {}}
                className={`
                  w-full flex items-center gap-3
                  p-3 rounded-xl
                  transition
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                `}
                style={{
                  background:
                    status === "active"
                      ? "linear-gradient(135deg, hsl(168 80% 30%), hsl(168 70% 38%))"
                      : "transparent",
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      status === "completed"
                        ? "hsl(168 80% 30%)"
                        : status === "active"
                        ? "hsla(0,0%,100%,0.2)"
                        : "hsl(210 20% 96%)",
                  }}
                >
                  {status === "completed" ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5L6.5 12L13 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color:
                          status === "active"
                            ? "white"
                            : "hsl(215 16% 57%)",
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="text-left">
                  <div
                    className="text-sm font-semibold font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]"
                    style={{
                      color:
                        status === "active"
                          ? "white"
                          : status === "completed"
                          ? "hsl(168 80% 30%)"
                          : "hsl(215 16% 57%)",
                    }}
                  >
                    {label}
                  </div>

                  <div
                    className="text-xs mt-[1px]"
                    style={{
                      color:
                        status === "active"
                          ? "hsla(0,0%,100%,0.8)"
                          : status === "completed"
                          ? "hsl(168 80% 30%)"
                          : "hsl(215 16% 67%)",
                    }}
                  >
                    {status === "completed"
                      ? "Completed"
                      : status === "active"
                      ? "In Progress"
                      : "Upcoming"}
                  </div>
                </div>
              </motion.button>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className="w-0.5 h-6 rounded-sm"
                  style={{
                    marginLeft: "calc(0.75rem + 17px)",
                    background:
                      status === "completed"
                        ? "hsl(168 80% 30%)"
                        : "hsl(214 32% 91%)",
                  }}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Progress */}
      <div className="p-4 border-t border-[hsl(214_32%_91%)]">
        <div className="flex justify-between text-[0.8rem] text-[hsl(215_16%_47%)] font-medium mb-2">
          <span>Progress</span>
          <span>
            {progress} of {total}
          </span>
        </div>

        <div className="h-1.5 rounded-[3px] bg-[hsl(210_20%_96%)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full rounded-[3px] bg-[linear-gradient(90deg,hsl(168_80%_30%),hsl(168_70%_42%))]"
          />
        </div>
      </div>
    </aside>
  );
};

export default WizardSidebar;