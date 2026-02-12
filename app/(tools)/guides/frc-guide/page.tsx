"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GuideTabs, { GuideTabKey } from "./components/GuideTabs";
import GuideHero from "./components/GuideHero";
import OverviewTab from "./components/tabs/OverviewTab";
import HowToApplyTab from "./components/tabs/HowToApplyTab";
import RequirementsTab from "./components/tabs/RequirementsTab";
import FeesTab from "./components/tabs/FeesTab";
import HelpCenterTab from "./components/tabs/HelpCenterTab";

const TAB_CONTENT: Record<GuideTabKey, React.ReactNode> = {
  overview: <OverviewTab />,
  "how-to-apply": <HowToApplyTab />,
  requirements: <RequirementsTab />,
  fees: <FeesTab />,
  "help-center": <HelpCenterTab />,
};

const TAB_ORDER: GuideTabKey[] = ["overview", "how-to-apply", "requirements", "fees", "help-center"];

export default function FrcGuidePage() {
  const [activeTab, setActiveTab] = useState<GuideTabKey>("overview");
  const prevTabRef = useRef<GuideTabKey>("overview");
  const [tabDirection, setTabDirection] = useState<'forward' | 'backward'>('forward');

  const handleTabChange = (newTab: GuideTabKey) => {
    const currentIndex = TAB_ORDER.indexOf(prevTabRef.current);
    const newIndex = TAB_ORDER.indexOf(newTab);
    
    setTabDirection(newIndex > currentIndex ? 'forward' : 'backward');
    prevTabRef.current = newTab;
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 guide-grid-bg pointer-events-none z-0" />
      <div className="relative z-10">
        <GuideHero />
        <GuideTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="container mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ 
                opacity: 0, 
                rotateY: tabDirection === 'forward' ? 90 : -90,
                x: tabDirection === 'forward' ? 50 : -50
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                x: 0
              }}
              exit={{ 
                opacity: 0, 
                rotateY: tabDirection === 'forward' ? -90 : 90,
                x: tabDirection === 'forward' ? -50 : 50
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
