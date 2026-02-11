"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Home,
  ShieldCheck,
  BadgeCheck,
  Info,
  RotateCcw,
  GraduationCap,
  Plane,
  Stamp,
  Search,
  BookOpen,
  Award,
  CreditCard,
  Building2,
  FileSearch,
} from "lucide-react";
import { HeroSection } from "./components/hero-section";

// --- Types & Config ---

interface Step {
  id: string;
  title: string;
  shortTitle: string;
  icon: any;
  categories: {
    heading: string;
    items: { id: string; text: string; subtext?: string }[];
  }[];
  proTip?: string;
}

const STEPS: Step[] = [
  {
    id: "gathering",
    title: "1. Document Gathering & Verification",
    shortTitle: "Documents",
    icon: FileText,
    categories: [
      {
        heading: "Primary Academic Documents",
        items: [
          { id: "gen-1", text: "Matric (SSC) Certificate & Transcript" },
          { id: "gen-2", text: "Intermediate (HSSC) Certificate & Transcript" },
          { id: "gen-3", text: "Bachelor's Degree & Final Transcripts", subtext: "Required for Grad school applicants" },
          { id: "gen-4", text: "Master's Degree (if applicable)" },
          { id: "gen-5", text: "Passport (Must be valid for 6 months minimum)" },
        ],
      },
      {
        heading: "University Admit Documents",
        items: [
          { id: "admit-1", text: "I-20 Form (Original signed hardcopy/digital)", subtext: "Obtained from your US University" },
          { id: "admit-2", text: "Admission Letter" },
        ],
      },
    ],
    proTip: "Ensure all names on certificates match your Passport exactly. Any discrepancy requires an Affidavit.",
  },
  {
    id: "attestation",
    title: "2. Attestation Journey (Pakistan Authorities)",
    shortTitle: "Attestation",
    icon: Stamp,
    categories: [
      {
        heading: "School Level (IBCC)",
        items: [
          { id: "ibcc-1", text: "Online Application at ibcc.edu.pk", subtext: "Register and fill the form" },
          { id: "ibcc-2", text: "Attestation of Matric & Inter Certificates", subtext: "Fee: PKR 2,000-5,000 per doc" },
          { id: "ibcc-3", text: "Equivalence Certificate", subtext: "Required if certificates are O/A Levels" },
        ],
      },
      {
        heading: "Higher Education (HEC)",
        items: [
          { id: "hec-1", text: "Portal Account at eservices.hec.gov.pk" },
          { id: "hec-2", text: "Upload Degrees & Transcripts" },
          { id: "hec-3", text: "Biometric & Verification", subtext: "Verified through University linkage" },
          { id: "hec-4", text: "Final HEC Stamp", subtext: "PKR 800 - 2,000 per document" },
        ],
      },
      {
        heading: "Ministry of Foreign Affairs (MOFA)",
        items: [
          { id: "mofa-1", text: "Final Attestation (Optional but recommended)", subtext: "Done after HEC/IBCC stamps" },
        ],
      },
    ],
    proTip: "Urgent attestation is available but requires higher fees. Always keep photocopies of the back side (stamped side).",
  },
  {
    id: "evaluation",
    title: "3. Evaluations & Test Scores",
    shortTitle: "Tests",
    icon: FileSearch,
    categories: [
      {
        heading: "Standardized Tests",
        items: [
          { id: "test-1", text: "English Proficiency (IELTS/TOEFL/Duolingo)" },
          { id: "test-2", text: "Academic Tests (SAT/GRE/GMAT scores)" },
        ],
      },
      {
        heading: "Credential Evaluation (WES etc.)",
        items: [
          { id: "eval-1", text: "Register on WES.org (or ECE/IEE)" },
          { id: "eval-2", text: "Request Official Sealed Envelopes from University/HEC" },
          { id: "eval-3", text: "Courier Documents to Evaluation Agency" },
        ],
      },
    ],
    proTip: "Do NOT break the seal of university-issued envelopes. They must remain sealed to be accepted by WES.",
  },
  {
    id: "fees",
    title: "4. US Fees & SEVIS Registration",
    shortTitle: "Fees",
    icon: CreditCard,
    categories: [
      {
        heading: "SEVIS Obligations",
        items: [
          { id: "sevis-1", text: "SEVIS I-901 Fee Payment ($350)", subtext: "Pay at fmjfee.com" },
          { id: "sevis-2", text: "Print SEVIS Receipt", subtext: "Mandatory for interview" },
        ],
      },
      {
        heading: "Visa Application Fees",
        items: [
          { id: "visa-1", text: "MRV Visa Fee ($185)", subtext: "Payable via Allied Bank in Pakistan" },
          { id: "visa-2", text: "Keep Deposit Slip", subtext: "Required for receipt number on UStraveldocs" },
        ],
      },
    ],
    proTip: "The MRV fee is non-refundable. Ensure I-20 details are correct before paying SEVIS.",
  },
  {
    id: "interview",
    title: "5. DS-160 & Visa Success",
    shortTitle: "Success",
    icon: Plane,
    categories: [
      {
        heading: "Online Filings",
        items: [
          { id: "final-1", text: "Complete DS-160 Form accurately" },
          { id: "final-2", text: "Schedule Appointment (Islamabad/Karachi)" },
        ],
      },
      {
        heading: "Financial Evidence (Core for Interview)",
        items: [
          { id: "fin-1", text: "Bank Statements (covering 1 year of costs)" },
          { id: "fin-2", text: "Affidavit of Support / Sponsor Letters" },
          { id: "fin-3", text: "Tax Returns (Sponsor's FBR/IRS records)" },
        ],
      },
      {
        heading: "Final Checklist for Embassy",
        items: [
          { id: "emb-1", text: "I-20 (Original Signed)" },
          { id: "emb-2", text: "Passport & DS-160 Confirmation" },
          { id: "emb-3", text: "Attested Academic Folder" },
          { id: "emb-4", text: "SEVIS & MRV Receipts" },
        ],
      },
    ],
    proTip: "Be ready to explain your 'Ties to Pakistan' and your specific academic goals in the US.",
  },
];

export default function EducationCertificatesGuidePage() {
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);

  // Persistence logic
  React.useEffect(() => {
    const saved = localStorage.getItem("usa-edu-guide-progress-final");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checked) setCheckedItems(parsed.checked);
        if (parsed.currentStep !== undefined) setActiveTab(parsed.currentStep);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("usa-edu-guide-progress-final", JSON.stringify({
      checked: checkedItems,
      currentStep: activeTab
    }));
  }, [checkedItems, activeTab]);

  const toggleChecked = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getProgress = () => {
    const totalItems = STEPS.reduce((acc, step) => 
      acc + step.categories.reduce((cAcc, cat) => cAcc + cat.items.length, 0), 0);
    return Math.round((checkedItems.length / totalItems) * 100);
  };

  const resetProgress = () => {
    if (confirm("Reset all progress?")) {
      setCheckedItems([]);
      setActiveTab(0);
      localStorage.removeItem("usa-edu-guide-progress-final");
    }
  };

  const currentStep = STEPS[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Breadcrumb & Global Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-8">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-[#0d7377] transition-colors"><Home className="w-4 h-4" /></Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/guides" className="hover:text-[#0d7377] font-medium">Guides</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-[#0d7377] font-black tracking-tight underline decoration-teal-500/30 decoration-4 underline-offset-4 uppercase text-xs">US Education Roadmap</span>
          </nav>

          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Overall Progress</p>
              <p className="text-sm font-black text-slate-900">{getProgress()}% Completed</p>
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                className="h-full bg-linear-to-r from-[#0d7377] to-[#14a0a6]" 
              />
            </div>
            <button onClick={resetProgress} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Stepper Navigation */}
        <div className="hidden lg:grid grid-cols-5 gap-4 mb-12">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "group relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 overflow-hidden",
                activeTab === idx 
                  ? "bg-[#0d7377] border-[#0d7377] text-white shadow-xl shadow-[#0d7377]/20" 
                  : idx < activeTab 
                    ? "bg-teal-50 border-teal-100 text-[#0d7377]" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-[#14a0a6]/40 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                activeTab === idx ? "bg-white/20" : "bg-slate-50 group-hover:bg-teal-50"
              )}>
                <step.icon className={cn("w-5 h-5", activeTab === idx ? "text-white" : "text-slate-400 group-hover:text-[#0d7377]")} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{step.shortTitle}</span>
              
              {/* Checkmark for completed steps */}
              {STEPS[idx].categories.every(cat => cat.items.every(i => checkedItems.includes(i.id))) && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start text-left">
          {/* Main Content Area */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-2xl relative overflow-hidden"
              >
                {/* Visual Background Decal */}
                <div className="absolute -right-16 -top-16 opacity-[0.03] rotate-12">
                   <currentStep.icon className="w-64 h-64 text-[#0d7377]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-[#0d7377] to-[#14a0a6] flex items-center justify-center text-white shadow-lg shrink-0">
                      <currentStep.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-full mb-2 inline-block">Stage {activeTab + 1} of {STEPS.length}</span>
                      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{currentStep.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-16">
                    {currentStep.categories.map((cat, catIdx) => (
                      <div key={catIdx} className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-1.5 bg-[#14a0a6] rounded-full" />
                          <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase text-sm">{cat.heading}</h4>
                        </div>
                        
                        <div className="grid gap-3">
                          {cat.items.map((item) => {
                            const isChecked = checkedItems.includes(item.id);
                            return (
                              <div 
                                key={item.id}
                                onClick={() => toggleChecked(item.id)}
                                className={cn(
                                  "group flex items-start gap-5 p-6 rounded-[2rem] border-2 transition-all cursor-pointer",
                                  isChecked 
                                    ? "bg-teal-50/40 border-[#0d7377]/20 shadow-sm" 
                                    : "bg-white border-slate-50 hover:border-[#14a0a6]/20 hover:bg-slate-50/50"
                                )}
                              >
                                <div className={cn(
                                  "mt-1 w-6 h-6 rounded-[10px] border-2 flex items-center justify-center shrink-0 transition-all shadow-sm",
                                  isChecked ? "bg-[#0d7377] border-[#0d7377] text-white" : "border-slate-200 bg-white group-hover:border-[#14a0a6]/40"
                                )}>
                                  {isChecked && <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className={cn(
                                    "text-base leading-tight tracking-tight",
                                    isChecked ? "text-slate-900 font-bold" : "text-slate-700 font-semibold"
                                  )}>
                                    {item.text}
                                  </span>
                                  {item.subtext && (
                                    <span className="text-xs text-slate-400 mt-1 font-medium">{item.subtext}</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Footer */}
                  <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      disabled={activeTab === 0}
                      onClick={() => {
                        setActiveTab(prev => prev - 1);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-black text-sm transition-all",
                        activeTab === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 text-slate-600 border-2 border-slate-200"
                      )}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>

                    {activeTab < STEPS.length - 1 ? (
                      <button
                        onClick={() => {
                          setActiveTab(prev => prev + 1);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-5 rounded-2xl bg-linear-to-r from-[#0d7377] to-[#14a0a6] text-white font-black text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-[#0d7377]/20"
                      >
                        Next: {STEPS[activeTab + 1].shortTitle}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => alert("Roadmap Complete! Best of luck with your US studies.")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-5 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-emerald-600/20"
                      >
                        Finish Roadmap
                        <BadgeCheck className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Advisory */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6 lg:sticky lg:top-24 text-left">
             <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2.5 bg-rose-50 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-rose-500" />
                   </div>
                   <h3 className="font-black text-slate-900 text-lg tracking-tight">Stage Advisory</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed mb-8">
                   {currentStep.proTip}
                </p>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0">
                         <Info className="w-4 h-4 text-[#14a0a6]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Organized</p>
                         <p className="text-xs font-bold text-slate-600 leading-relaxed">
                            Check multiple boxes to see your journey progress bar move. Use this checklist as your final folder audit.
                         </p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Quick Links / External */}
             <div className="bg-linear-to-br from-[#0d7377] to-[#14a0a6] rounded-[2.5rem] p-8 text-white shadow-xl">
                <h4 className="font-black text-lg mb-4 tracking-tight">Official Portals</h4>
                <div className="space-y-3">
                   {[
                      { name: "HEC E-Services", url: "https://eservices.hec.gov.pk" },
                      { name: "IBCC Pakistan", url: "https://ibcc.edu.pk" },
                      { name: "CEAC DS-160", url: "https://ceac.state.gov" },
                      { name: "SEVIS Payment", url: "https://fmjfee.com" }
                   ].map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
                      >
                         <span className="text-xs font-black uppercase tracking-widest">{link.name}</span>
                         <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
                      </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
