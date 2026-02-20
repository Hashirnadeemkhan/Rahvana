import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Info } from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

interface WhatsThisModalProps {
  open: boolean;
  onClose: () => void;
}

const WhatsThisModal = ({ open, onClose }: WhatsThisModalProps) => {
  const data = guideData.wizard.whats_this;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0
              bg-black/50
              backdrop-blur-sm
              z-100
            "
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="
              fixed
              top-[50%] left-[50%]
              -translate-x-1/2 -translate-y-1/2
              w-[90%] max-w-150
              max-h-[85vh] overflow-y-auto
              bg-white
              rounded-2xl
              shadow-[0_25px_60px_-12px_hsla(0,0%,0%,0.25)]
              z-100
              p-8
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[hsl(168_60%_95%)] flex items-center justify-center">
                  <FileText className="w-5.5 h-5.5 text-[hsl(168_80%_30%)]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[hsl(220_20%_10%)] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                    {data.heading}
                  </h2>
                  <p className="text-[0.8rem] text-[hsl(215_16%_50%)]">
                    {data.sub}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="
                  w-8 h-8 rounded-lg
                  bg-[hsl(210_20%_96%)]
                  flex items-center justify-center
                  text-[hsl(215_16%_47%)]
                "
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* What is FRC */}
            <h3 className="text-base font-bold text-[hsl(220_20%_10%)] mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
              What is a Family Registration Certificate?
            </h3>

            <p className="text-[0.875rem] leading-[1.7] text-[hsl(220_20%_30%)] mb-6">
              {data.description}
            </p>

            {/* Quick Instructions */}
            <h3 className="text-base font-bold text-[hsl(220_20%_10%)] mb-3 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
              Quick Instructions
            </h3>

            <ol className="mb-6 list-none p-0">
              {data.quick_instructions.map((item, i) => (
                <li
                  key={i}
                  className="
                    flex items-center gap-3
                    text-[0.875rem]
                    text-[hsl(220_20%_25%)]
                    mb-2
                    leading-normal
                  "
                >
                  <span className="text-[hsl(168_80%_30%)] font-bold min-w-4">
                    {i + 1}.
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            {/* Disclaimer */}
            <div
              className="
              p-4 rounded-xl
              bg-[hsl(40_100%_97%)]
              border border-[hsl(40_80%_85%)]
              flex gap-3 items-start
            "
            >
              <Info className="w-4.5 h-4.5 text-[hsl(35_80%_45%)] shrink-0 mt-0.5" />

              <div>
                <p className="text-[0.8rem] font-bold text-[hsl(35_80%_35%)] mb-1">
                  Important Disclaimer
                </p>

                <p className="text-[0.8rem] leading-[1.6] text-[hsl(35_50%_30%)]">
                  {data.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WhatsThisModal;
