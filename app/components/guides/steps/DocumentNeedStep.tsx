import { motion } from "framer-motion";
import { FileText, Edit3, RefreshCw } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  new_certificate: FileText,
  correction_needed: Edit3,
  replacement: RefreshCw,
  new_passport: FileText,
  renewal: Edit3,
  lost_damaged: RefreshCw,
};

const GRADIENT_STYLES: Record<
  string,
  { bg: string; border: string; iconBg: string }
> = {
  green: {
    bg: "bg-[linear-gradient(135deg,hsl(150_60%_96%),hsl(168_50%_93%))]",
    border: "border-[hsl(168_60%_80%)]",
    iconBg: "bg-[hsl(168_60%_90%)]",
  },
  orange: {
    bg: "bg-[linear-gradient(135deg,hsl(35_80%_96%),hsl(25_70%_93%))]",
    border: "border-[hsl(35_70%_80%)]",
    iconBg: "bg-[hsl(35_70%_90%)]",
  },
  blue: {
    bg: "bg-[linear-gradient(135deg,hsl(210_70%_96%),hsl(220_60%_93%))]",
    border: "border-[hsl(210_60%_80%)]",
    iconBg: "bg-[hsl(210_60%_90%)]",
  },
};

interface DocumentNeedOption {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface DocumentNeedData {
  title: string;
  description: string;
  options: DocumentNeedOption[];
}

interface DocumentNeedStepProps {
  selected: string | null;
  onSelect: (id: string) => void;
  data?: DocumentNeedData;
}

const DocumentNeedStep = ({
  selected,
  onSelect,
  data,
}: DocumentNeedStepProps) => {
  const title = data?.title || "What brings you here?";
  const description = data?.description || "";
  const options = data?.options || [];

  return (
    <div>
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)]
                     mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        {title}
      </h2>

      <p className="text-[0.95rem] text-[hsl(215_16%_47%)]
                    mb-8 leading-normal">
        {description}
      </p>

      <div className="grid grid-cols-3 gap-5">
        {options.map((option, i) => {
          const Icon = ICONS[option.id] || FileText;
          const styles =
            GRADIENT_STYLES[option.color] || GRADIENT_STYLES.green;
          const isSelected = selected === option.id;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 32px -8px hsla(0,0%,0%,0.12)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(option.id)}
              className={`
                p-7 rounded-2xl text-left flex flex-col gap-4
                border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-[hsl(168_80%_30%)] bg-[linear-gradient(135deg,hsl(168_60%_95%),hsl(168_50%_90%))] shadow-[0_0_0_3px_hsl(168_80%_30%/0.15)]"
                    : `${styles.border} ${styles.bg} shadow-[0_2px_8px_hsla(0,0%,0%,0.04)]`
                }
              `}
            >
              {/* Icon Box */}
              <div
                className={`w-14 h-14 rounded-[14px] flex items-center justify-center
                  ${
                    isSelected
                      ? "bg-[hsl(168_60%_88%)]"
                      : styles.iconBg
                  }`}
              >
                <Icon
                  className={`w-6.5 h-6.5
                    ${
                      isSelected
                        ? "text-[hsl(168_80%_25%)]"
                        : "text-[hsl(220_20%_30%)]"
                    }`}
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[1.05rem] font-bold
                               text-[hsl(220_20%_10%)]
                               mb-1
                               font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                  {option.title}
                </h3>

                <p className="text-[0.85rem]
                              text-[hsl(215_16%_50%)]
                              leading-[1.4]">
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