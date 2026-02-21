import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, AlertTriangle, Link as LinkIcon, ExternalLink } from "lucide-react";

interface InfoPanelData {
  tips: string[];
  pitfalls: string[];
  links: { label: string; url: string }[];
}

interface WizardInfoPanelProps {
  data: InfoPanelData;
  lastVerified: string;
}

type InfoTab = "tips" | "pitfalls" | "links";

const TAB_CONFIG: {
  key: InfoTab;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { key: "tips", label: "Tips", icon: Info, color: "hsl(168 80% 30%)" },
  { key: "pitfalls", label: "Pitfalls", icon: AlertTriangle, color: "hsl(35 90% 50%)" },
  { key: "links", label: "Links", icon: LinkIcon, color: "hsl(215 70% 50%)" },
];

const WizardInfoPanel = ({ data, lastVerified }: WizardInfoPanelProps) => {
  const [activeTab, setActiveTab] = useState<InfoTab>("tips");

  return (
    <aside
      className="w-75 min-w-75 h-full bg-white 
                 border-l border-[hsl(214_32%_91%)]
                 flex flex-col overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex border-b border-[hsl(214_32%_91%)] px-1">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 
                          py-[0.85rem] px-2 text-[0.8rem] font-semibold
                          border-b-2 transition-colors
                          ${
                            isActive
                              ? "border-[hsl(168_80%_30%)] text-[hsl(168_80%_30%)]"
                              : "border-transparent text-[hsl(215_16%_57%)]"
                          }`}
              style={
                isActive
                  ? { borderBottomColor: tab.color, color: tab.color }
                  : undefined
              }
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tips */}
            {activeTab === "tips" &&
              data.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 mb-4 items-start">
                  <span
                    className="w-6 h-6 min-w-6 rounded-full
                               bg-[hsl(168_60%_95%)]
                               text-[hsl(168_80%_30%)]
                               flex items-center justify-center
                               text-xs font-bold mt-0.5"
                  >
                    {i + 1}
                  </span>

                  <p className="text-[0.85rem] leading-normal text-[hsl(220_20%_25%)]">
                    {tip}
                  </p>
                </div>
              ))}

            {/* Pitfalls */}
            {activeTab === "pitfalls" &&
              data.pitfalls.map((pitfall, i) => (
                <div key={i} className="flex gap-3 mb-4 items-start">
                  <span
                    className="w-6 h-6 min-w-6 rounded-full
                               bg-[hsl(35_90%_95%)]
                               text-[hsl(35_80%_40%)]
                               flex items-center justify-center
                               text-xs font-bold mt-0.5"
                  >
                    {i + 1}
                  </span>

                  <p className="text-[0.85rem] leading-normal text-[hsl(220_20%_25%)]">
                    {pitfall}
                  </p>
                </div>
              ))}

            {/* Links */}
            {activeTab === "links" &&
              data.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2
                             p-3 mb-2 rounded-[10px]
                             border border-[hsl(214_32%_91%)]
                             bg-[hsl(215_60%_98%)]
                             text-[hsl(215_70%_45%)]
                             text-[0.85rem] font-medium
                             hover:bg-[hsl(215_60%_95%)]
                             hover:border-[hsl(215_70%_80%)]
                             transition-all duration-200"
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 border-t border-[hsl(214_32%_91%)]
                   text-right text-[0.75rem]
                   text-[hsl(215_16%_60%)]"
      >
        Last verified: {lastVerified}
      </div>
    </aside>
  );
};

export default WizardInfoPanel;