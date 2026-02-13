import { motion } from "framer-motion";
import { BookOpen, ClipboardList, FileCheck, Banknote, HelpCircle } from "lucide-react";

export type GuideTabKey = "overview" | "how-to-apply" | "requirements" | "fees" | "help-center";

interface GuideTabsProps {
  activeTab: GuideTabKey;
  onTabChange: (tab: GuideTabKey) => void;
}

const TABS: { key: GuideTabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "how-to-apply", label: "How to Apply", icon: ClipboardList },
  { key: "requirements", label: "Requirements", icon: FileCheck },
  { key: "fees", label: "Fees & Processing", icon: Banknote },
  { key: "help-center", label: "Help Center", icon: HelpCircle },
];

const GuideTabs = ({ activeTab, onTabChange }: GuideTabsProps) => {
  return (
    <div className="sticky top-0 z-30 bg-transparent backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6">
        <nav className="flex justify-center items-center gap-1 overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeGuideTab"
                    className="absolute inset-0 rounded-full bg-primary shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default GuideTabs;
