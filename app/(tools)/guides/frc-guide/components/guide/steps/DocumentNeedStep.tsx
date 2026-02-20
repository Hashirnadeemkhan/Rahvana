import { motion } from "framer-motion";
import { FileText, Edit3, RefreshCw } from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

const ICONS: Record<string, React.ElementType> = {
  new_certificate: FileText,
  correction_needed: Edit3,
  replacement: RefreshCw,
};

const GRADIENT_COLORS: Record<
  string,
  { bg: string; border: string; iconBg: string }
> = {
  green: {
    bg: "linear-gradient(135deg, hsl(150 60% 96%), hsl(168 50% 93%))",
    border: "hsl(168 60% 80%)",
    iconBg: "hsl(168 60% 90%)",
  },
  orange: {
    bg: "linear-gradient(135deg, hsl(35 80% 96%), hsl(25 70% 93%))",
    border: "hsl(35 70% 80%)",
    iconBg: "hsl(35 70% 90%)",
  },
  blue: {
    bg: "linear-gradient(135deg, hsl(210 70% 96%), hsl(220 60% 93%))",
    border: "hsl(210 60% 80%)",
    iconBg: "hsl(210 60% 90%)",
  },
};

interface DocumentNeedStepProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const DocumentNeedStep = ({
  selected,
  onSelect,
}: DocumentNeedStepProps) => {
  const { title, description, options } =
    guideData.wizard.document_need;

  return (
    <div>
      {/* Title */}
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)] mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        {title}
      </h2>

      {/* Description */}
      <p className="text-[0.95rem] text-[hsl(215_16%_47%)] mb-8 leading-normal">
        {description}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {options.map((option, i) => {
          const Icon = ICONS[option.id] || FileText;
          const colors =
            GRADIENT_COLORS[option.color] ||
            GRADIENT_COLORS.green;
          const isSelected = selected === option.id;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow:
                  "0 12px 32px -8px hsla(0,0%,0%,0.12)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(option.id)}
              className="
                p-7 px-5
                rounded-2xl
                text-left
                flex flex-col gap-4
                transition
              "
              style={{
                border: `2px solid ${
                  isSelected
                    ? "hsl(168 80% 30%)"
                    : colors.border
                }`,
                background: isSelected
                  ? "linear-gradient(135deg, hsl(168 60% 95%), hsl(168 50% 90%))"
                  : colors.bg,
                boxShadow: isSelected
                  ? "0 0 0 3px hsl(168 80% 30%/0.15)"
                  : "0 2px 8px hsla(0,0%,0%,0.04)",
              }}
            >
              {/* Icon Box */}
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center"
                style={{
                  background: isSelected
                    ? "hsl(168 60% 88%)"
                    : colors.iconBg,
                }}
              >
                <Icon
                  className="w-6.5 h-6.5"
                  style={{
                    color: isSelected
                      ? "hsl(168 80% 25%)"
                      : "hsl(220 20% 30%)",
                  }}
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-[1.05rem] font-bold text-[hsl(220_20%_10%)] mb-1 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                  {option.title}
                </h3>

                <p className="text-[0.85rem] text-[hsl(215_16%_50%)] leading-[1.4]">
                  {option.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentNeedStep;