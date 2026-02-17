"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Camera,
  ChevronDown,
  BookOpen,
  Users,
  FileText,
  Globe2,
  MapPin,
  AlertTriangle,
  Home,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { HeroSection } from "./components/hero-section";
import { PhotoGuideSection } from "./components/photo-guide-section";
import { LocationGuideSection } from "./components/location-guide-section";

const mrpGuidelines2026: Record<string, Record<string, Record<string, number>>> = {
  normal: {
    "36": { "5": 5500, "10": 7700 },
    "72": { "5": 10000, "10": 15000 },
    "100": { "5": 12000, "10": 18000 },
  },
  urgent: {
    "36": { "5": 8500, "10": 12200 },
    "72": { "5": 14500, "10": 21000 },
    "100": { "5": 19000, "10": 27000 },
  },
  fasttrack: {
    "36": { "5": 12500, "10": 18000 },
    "72": { "5": 20000, "10": 30000 },
    "100": { "5": 24000, "10": 36000 },
  },
};

const ePassportGuidelines2026: Record<string, Record<string, Record<string, number>>> = {
  normal: {
    "36": { "5": 9000, "10": 13500 },
    "72": { "5": 16500, "10": 24750 },
    "100": { "5": 20000, "10": 30000 }, // Estimated
  },
  urgent: {
    "36": { "5": 15000, "10": 22500 },
    "72": { "5": 27000, "10": 40500 },
    "100": { "5": 35000, "10": 50000 }, // Estimated
  },
  fasttrack: {
    "36": { "5": 20000, "10": 30000 },
    "72": { "5": 35000, "10": 55000 },
    "100": { "5": 45000, "10": 70000 }, // Estimated
  },
};

const sectionThemes: Record<string, { bg: string, border: string, accent: string, iconBg: string, hover: string }> = {
  understanding: { bg: "bg-indigo-50/30", border: "border-indigo-100", accent: "text-indigo-600", iconBg: "bg-indigo-100/50", hover: "hover:border-indigo-300 hover:bg-indigo-50/50" },
  eligibility: { bg: "bg-cyan-50/30", border: "border-cyan-100", accent: "text-cyan-600", iconBg: "bg-cyan-100/50", hover: "hover:border-cyan-300 hover:bg-cyan-50/50" },
  documents: { bg: "bg-emerald-50/30", border: "border-emerald-100", accent: "text-emerald-600", iconBg: "bg-emerald-100/50", hover: "hover:border-emerald-300 hover:bg-emerald-50/50" },
  photos: { bg: "bg-sky-50/30", border: "border-sky-100", accent: "text-sky-600", iconBg: "bg-sky-100/50", hover: "hover:border-sky-300 hover:bg-sky-50/50" },
  process: { bg: "bg-teal-50/30", border: "border-teal-100", accent: "text-[#0d7377]", iconBg: "bg-teal-100/50", hover: "hover:border-teal-300 hover:bg-teal-50/50" },
  time: { bg: "bg-cyan-50/30", border: "border-cyan-100", accent: "text-cyan-600", iconBg: "bg-cyan-100/50", hover: "hover:border-cyan-300 hover:bg-cyan-50/50" },
  fees: { bg: "bg-[#e8f6f6]/30", border: "border-[#14a0a6]/20", accent: "text-[#0d7377]", iconBg: "bg-[#0d7377]/10", hover: "hover:border-[#0d7377]/30 hover:bg-[#0d7377]/5" },
  locations: { bg: "bg-indigo-50/30", border: "border-indigo-100", accent: "text-indigo-600", iconBg: "bg-indigo-100/50", hover: "hover:border-indigo-300 hover:bg-indigo-50/50" },
  tips: { bg: "bg-rose-50/30", border: "border-rose-100", accent: "text-rose-600", iconBg: "bg-rose-100/50", hover: "hover:border-rose-300 hover:bg-rose-50/50" },
};

const sections = [
  {
    id: "understanding",
    title: "Understanding Pakistani Passport",
    icon: BookOpen,
    description: "Learn about the types of passports and why you need one.",
    content: [
      {
        heading: "What is a Pakistani Passport?",
        text: "A Pakistani passport is an official document issued by the Directorate General of Immigration & Passports (DGIP) for international travel. It serves as proof of Pakistani citizenship and identity.",
      },
      {
        heading: "When is it required?",
        text: "Required for all international travel, including applying for visas to countries like the US. It must be valid for at least 6 months beyond your intended stay for most visas.",
      },
      {
        heading: "Types of Passports",
        text: "• Ordinary MRP: Common Machine Readable Passport for citizens.\n• e-Passport: Advanced with biometric chip for faster clearance.\n• Official/Diplomatic: Issued to government officials and diplomats.",
      },
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility Criteria",
    icon: Users,
    description: "Check if you qualify to apply for a Pakistani passport.",
    content: [
      {
        heading: "Who Can Apply?",
        text: "Every Pakistani citizen, including newborns. No minimum age.",
      },
      {
        heading: "Special Requirements",
        text: "• Overseas Pakistanis: Can renew online (Full Process).\n• Govt Employees: Need NOC valid for <90 days.\n• Dual Nationals: Must provide copy of foreign passport.",
      },
      {
        heading: "Special Cases",
        text: "• Minors under 18 (require both parents).\n• Lost/Damaged cases (require FIR/Affidavit).\n• Name or status changes (require updated CNIC).",
      },
    ],
  },
  {
    id: "documents",
    title: "Required Documents",
    icon: FileText,
    description: "Complete checklist of documents needed for your application.",
    content: [
      {
        heading: "For Adults (New/Renewal)",
        text: "• Original CNIC/NICOP/Smart CNIC + copy\n• Previous passport + copy (renewal only)\n• NOC for govt employees (valid <90 days)\n• For married women: CNIC with updated marital status",
      },
      {
        heading: "For Minors",
        text: "• Original B-Form/CRC/Smart Card + copy\n• Parents' CNIC/NICOP + copies\n• Guardianship certificate if not parents\n• Both parents must accompany",
      },
      {
        heading: "For Lost",
        text: "• Police FIR + copy\n• Affidavit on Rs. 50 stamp paper\n• Previous passport copy if available",
      },
      {
        heading: "For Damaged",
        text: "• Original damaged passport\n• Police FIR if theft/damage by others\n• Signed Affidavit on stamp paper",
      },
      {
        heading: "General: Payment",
        text: "• Fee payment proof (Challan/PSID/e-Payment)",
      },
      {
        heading: "General: Photos (Visit)",
        text: "• No physical photos needed; captured live at the office.",
      },
      {
        heading: "General: Photos (Online)",
        text: "• Digital photo (45mm x 35mm, white background)\n• Specs: No glasses; Headscarf allowed for women but ears must be visible.",
      },
      {
        heading: "General: Biometrics (Online)",
        text: "• 600 DPI high-quality fingerprint scan required.",
      },
    ],
  },
  {
    id: "photos",
    title: "Photo Specifications",
    icon: Camera,
    description: "Visual guide to meeting mandatory photo requirements.",
    content: [],
  },
  {
    id: "process",
    title: "Application Process",
    icon: Globe2,
    description: "Step-by-step guide to applying online or in-person.",
    content: [
      {
        heading: "Hybrid Process (New/Lost/Damaged)",
        text: "• Register/Pay fee online via [DGIP Portal](https://onlinemrp.dgip.gov.pk/) or 'Passport Fee Asaan' app.\n• Book appointment (optional/select cities).\n• Visit RPO/EPO for mandatory biometrics, photo capture and interview.\n• Tracking & Pickup.",
      },
      {
        heading: "Full Online Process (Renewals Only)",
        text: "Only available for category 'Renewal' (if valid or expired for <12 months).\n\n• Visit [DGIP Online Portal](https://onlinemrp.dgip.gov.pk/).\n• Upload digital photo & fingerprint form.\n• Pay fee online.\n• Receive passport via delivery.\n• Note: Not available for lost/damaged cases or data changes.",
      },
      {
        heading: "Standard In-Person Visit (Full Office Flow)",
        text: "• Visit your Regional Passport Office (RPO) without initial online steps.\n• Submit documents at counter.\n• Complete biometrics & photo session.\n• Interview with Assistant Director.\n• Pickup on given date.",
      },
      {
        heading: "Minor Applicants Process",
        text: "• For minors, the interview stage can be deferred if documents are pre-attested by a Grade-17 Gazetted officer.\n• Both parents must accompany the minor for the visit.",
      },
    ],
  },
  {
    id: "time",
    title: "Processing Time",
    icon: Clock,
    description: "Expected timelines for different categories.",
    content: [
      { heading: "Normal", text: "10 working days." },
      { heading: "Urgent", text: "4 working days." },
      {
        heading: "Fast Track",
        text: "2 working days (select cities only). Backlog cleared in 2025.",
      },
      {
        heading: "Delivery Note",
        text: "Delivery via courier typically takes an additional 2-3 working days.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fee Structure",
    icon: DollarSign,
    description: "Calculate fees based on pages, validity, and urgency.",
    content: [
      {
        heading: "Payment Methods",
        text: "Online via card, Passport Fee Asaan app, or bank challan (PSID). No refunds.",
      },
      {
        heading: "Additional Charges",
        text: "Service charges ~Rs. 1,000 incl. taxes. e-Passport has separate fees.",
      },
    ],
  },
  {
    id: "locations",
    title: "Passport Offices Locations",
    icon: MapPin,
    description: "Find nearest RPO or EPO.",
    content: [
      {
        heading: "Official Office Directory",
        text: "You can find the complete list of Regional Passport Offices (RPOs) and Executive Passport Offices (EPOs) across Pakistan and abroad at the [Official DGIP Office List](https://dgip.gov.pk/contactus/offices.php)."
      }
    ],
  },
  {
    id: "tips",
    title: "Critical Tips & Common Mistakes",
    icon: AlertTriangle,
    description: "Crucial warnings and best practices to avoid rejection.",
    content: [
      {
        heading: "Expert Tips",
        text: "• Renew your passport **7-12 months** before expiry to avoid travel issues.\n• For **Lost** cases, be prepared for penalty fees (Double fee for 1st loss, Quadruple for 2nd).\n• Avoid unauthorized agents; use only the [Official DGIP Site](https://onlinemrp.dgip.gov.pk/).",
      },
      {
        heading: "Critical Warnings",
        text: "• Never share your tracking ID with third parties.\n• Ensure your CNIC is valid (not expired) before applying.\n• Incomplete or falsified documentation will lead to immediate rejection & legal action.",
      },
    ],
  },
];


export default function PassportGuidePage() {
  const [passportType, setPassportType] = React.useState<"mrp" | "e-passport">("mrp");
  
  const currentGuidelines = passportType === "e-passport" ? ePassportGuidelines2026 : mrpGuidelines2026;
  const [pages, setPages] = React.useState<"36" | "72" | "100" | null>(null);
  const [validity, setValidity] = React.useState<"5" | "10" | null>(null);
  const [urgency, setUrgency] = React.useState<
    "normal" | "urgent" | "fasttrack" | null
  >(null);

  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [journeyConfig, setJourneyConfig] = React.useState<{
    type: "new" | "renewal" | "lost" | "damaged" | null;
    method: "online" | "in-person" | null;
    age: "adult" | "minor" | null;
  }>({
    type: null,
    method: null,
    age: null,
  });
  const [showJourneyForm, setShowJourneyForm] = React.useState(true);
  const [collapsedSections, setCollapsedSections] = React.useState<string[]>([]);

  const toggleSectionCollapse = (id: string) => {
    setCollapsedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };


  const getRequiredFee = () => {
    if (!urgency || !pages || !validity) return 0;
    const guidelines = passportType === "e-passport" ? ePassportGuidelines2026 : mrpGuidelines2026;
    return guidelines[urgency][pages][validity];
  };



  const toggleChecked = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const filteredSections = sections.filter(section => {
    if (showJourneyForm) return true;
    if (section.id === "photos" && journeyConfig.method === "in-person") return false;
    return true;
  });

  const getFilteredContent = React.useCallback((sectionId: string, content: { heading: string; text?: string; [key: string]: unknown }[]) => {
    if (showJourneyForm) return content;

    if (sectionId === "documents") {
      let filtered = content;
      
      // Filter by Type
      if (journeyConfig.type === "renewal") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("lost") && !c.heading.toLowerCase().includes("damaged"));
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("new") || c.heading.toLowerCase().includes("renewal"));
      }
      if (journeyConfig.type === "new") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("lost") && !c.heading.toLowerCase().includes("damaged"));
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("renewal") || c.heading.toLowerCase().includes("new"));
      }
      if (journeyConfig.type === "lost") {
        filtered = filtered.filter((c) => c.heading.toLowerCase().includes("lost") || c.heading.toLowerCase().includes("general"));
      }
      if (journeyConfig.type === "damaged") {
        filtered = filtered.filter((c) => c.heading.toLowerCase().includes("damaged") || c.heading.toLowerCase().includes("general"));
      }
      
      // Filter by Age
      if (journeyConfig.age === "adult") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("minor") && !c.heading.toLowerCase().includes("b-form") && !c.heading.toLowerCase().includes("crc"));
      }
      if (journeyConfig.age === "minor") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("adult"));
      }

      // Filter by Method (For General items)
      if (journeyConfig.method === "online") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("(visit)"));
      }
      if (journeyConfig.method === "in-person") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("(online)"));
      }

      return filtered;
    }

    if (sectionId === "process") {
      let filtered = content;
      
      if (journeyConfig.type === "new" || journeyConfig.type === "lost" || journeyConfig.type === "damaged") {
        // New, Lost, and Damaged always allow Hybrid or Full Office visit
        filtered = filtered.filter((c) => c.heading.toLowerCase().includes("hybrid") || c.heading.toLowerCase().includes("standard"));
      } else if (journeyConfig.type === "renewal") {
        // Renewals depend on the selected method
        if (journeyConfig.method === "online") {
          filtered = filtered.filter((c) => c.heading.toLowerCase().includes("online"));
        } else {
          filtered = filtered.filter((c) => c.heading.toLowerCase().includes("standard"));
        }
      }

      // Age-based filtering for process
      if (journeyConfig.age !== "minor") {
        filtered = filtered.filter((c) => !c.heading.toLowerCase().includes("minor"));
      }

      return filtered;
    }

    if (sectionId === "time") {
      if (!urgency) return content;
      return content.filter((c) => c.heading.toLowerCase().includes(urgency.toLowerCase()) || c.heading.toLowerCase().includes("delivery"));
    }

    return content;
  }, [showJourneyForm, journeyConfig, urgency]);

  const totalCheckItems = React.useMemo(() => {
    let count = 0;
    filteredSections.forEach(s => {
      if (s.id === "photos") count += 1;
      else if (s.id === "locations") count += 0;
      else count += getFilteredContent(s.id, s.content).length;
    });
    return count || 1;
  }, [filteredSections, getFilteredContent]);

  const progressPercentage = (checkedItems.length / totalCheckItems) * 100;





  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100/30 to-slate-200/20">


      {/* Lamp Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-[#0d7377] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 font-medium">
            Pakistani Passport Guide
          </span>
        </nav>

        {showJourneyForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-8 lg:p-12 relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-[#0d7377]" />
            </div>
            
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Personalize Your Passport Journey</h2>
              <p className="text-slate-600 mb-10">Select your case details to get a tailored guide with exactly what you need.</p>

              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {/* Application Type */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Purpose</label>
                  <div className="flex flex-col gap-2">
                    {["new", "renewal", "lost", "damaged"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setJourneyConfig({ ...journeyConfig, type: t as "new" | "renewal" | "lost" | "damaged" })}
                        className={cn(
                          "px-4 py-2.5 rounded-xl border text-left transition-all",
                          journeyConfig.type === t 
                            ? "bg-[#0d7377] border-[#0d7377] text-white shadow-lg" 
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0d7377]"
                        )}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)} Passport
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Method</label>
                  <div className="flex flex-col gap-2">
                    {["online", "in-person"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setJourneyConfig({ ...journeyConfig, method: m as "online" | "in-person" })}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-left transition-all",
                          journeyConfig.method === m 
                            ? "bg-[#0d7377] border-[#0d7377] text-white shadow-lg" 
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0d7377]"
                        )}
                      >
                        {m === "online" ? "Apply Online" : "Visit Office"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Applicant</label>
                  <div className="flex flex-col gap-2">
                    {["adult", "minor"].map((a) => (
                      <button
                        key={a}
                        onClick={() => setJourneyConfig({ ...journeyConfig, age: a as "adult" | "minor" })}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-left transition-all",
                          journeyConfig.age === a 
                            ? "bg-[#0d7377] border-[#0d7377] text-white shadow-lg" 
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0d7377]"
                        )}
                      >
                        {a === "adult" ? "Adult (18+)" : "Minor (<18)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={!journeyConfig.type || !journeyConfig.method || !journeyConfig.age}
                onClick={() => setShowJourneyForm(false)}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
              >
                Start My Tailored Guide
              </button>
            </div>
          </motion.div>
        )}




        {/* Checklist Journey Hub */}
        {!showJourneyForm && (
          <div className="grid lg:grid-cols-3 gap-8 mb-12 items-start">
            {/* Left Column: Progress & Quick Info */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Your Journey Progress</h3>
                  <span className="text-sm font-bold text-[#0d7377] bg-[#0d7377]/10 px-3 py-1 rounded-full">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-linear-to-r from-[#0d7377] to-[#14a0a6]"
                  />
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applying For</p>
                       <p className="text-sm font-bold text-slate-700 capitalize">{journeyConfig.type} Passport</p>
                     </div>
                     <Sparkles className="w-4 h-4 text-[#0d7377]/30" />
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Method</p>
                     <p className="text-sm font-bold text-slate-700 capitalize">
                       {(journeyConfig.type === "new" && journeyConfig.method === "online") 
                         ? "Hybrid (Digital + Office)" 
                         : journeyConfig.method === "online" 
                           ? "Online Renewal" 
                           : "In-Person Office Visit"}
                     </p>
                   </div>

                   {/* Plan Selection Toggles in Sidebar */}
                   <div className="pt-4 space-y-4 border-t border-slate-100">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Configure Your Plan</p>
                     
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Passport Type</label>
                       <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                         {[
                           { id: "mrp", label: "MRP" },
                           { id: "e-passport", label: "e-Passport" }
                         ].map((t) => (
                           <button
                             key={t.id}
                             onClick={() => setPassportType(t.id as "mrp" | "e-passport")}
                             className={cn(
                               "py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                               passportType === t.id 
                                 ? "bg-[#0d7377] text-white shadow-sm" 
                                 : "text-slate-500 hover:text-slate-700"
                             )}
                           >
                             {t.label}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Processing Speed</label>
                       <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                         {["normal", "urgent", "fasttrack"].map((t) => (
                           <button
                             key={t}
                             onClick={() => setUrgency(t as "normal" | "urgent" | "fasttrack")}
                             className={cn(
                               "py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all",
                               urgency === t 
                                 ? "bg-[#0d7377] text-white shadow-sm" 
                                 : "text-slate-500 hover:text-slate-700"
                             )}
                           >
                             {t === "fasttrack" ? "Fast" : t}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Pages</label>
                          <select 
                            value={pages || ""} 
                            onChange={(e) => setPages(e.target.value as "36" | "72" | "100")}
                            className="w-full bg-slate-100 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0d7377]/20 outline-none"
                          >
                            <option value="" disabled>Select</option>
                            <option value="36">36 Pgs</option>
                            <option value="72">72 Pgs</option>
                            <option value="100">100 Pgs</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Validity</label>
                          <select 
                            value={validity || ""} 
                            onChange={(e) => setValidity(e.target.value as "5" | "10")}
                            className="w-full bg-slate-100 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0d7377]/20 outline-none"
                          >
                            <option value="" disabled>Select</option>
                            <option value="5">5 Years</option>
                            <option value="10">10 Years</option>
                          </select>
                        </div>
                     </div>
                   </div>

                   <button 
                    onClick={() => setShowJourneyForm(true)}
                    className="w-full py-3 text-[10px] font-bold text-slate-400 hover:text-[#0d7377] transition-colors border border-dashed border-slate-200 rounded-xl mt-4"
                  >
                    Reset All Parameters
                  </button>
                </div>
              </div>

              {/* Fee Quick Preview */}
              <div className="bg-[#e8f6f6] rounded-4xl p-8 text-[#0d7377] shadow-xl">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-[#0d7377]/10 rounded-xl">
                     <DollarSign className="w-5 h-5 text-[#0d7377]" />
                   </div>
                   <h3 className="font-bold">Estimated Fee</h3>
                 </div>
                 <p className="text-3xl font-black mb-1">
                    {(!urgency || !pages || !validity) ? "Rs. --" : `Rs. ${getRequiredFee().toLocaleString()}`}
                 </p>
                 <p className="text-[10px] text-[#0d7377]/60 uppercase tracking-widest mb-6">
                    {(!urgency || !pages || !validity) ? "Input Details Above" : `${pages} Pages • ${validity} Years • ${urgency}`}
                 </p>
                 <Link href="#fees" className="block text-center py-3 bg-[#0d7377]/10 hover:bg-[#0d7377]/20 rounded-xl text-xs font-bold transition-all text-[#0d7377]">
                   View Full Fee Breakdown
                 </Link>
              </div>
            </div>

            {/* Middle/Right Column: Checklist Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Journey Dashboard / Case Summary */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-[#14a0a6] text-[10px] font-black uppercase tracking-[0.2em] mb-3">System Synchronized</p>
                  <h2 className="text-2xl md:text-3xl font-black mb-8 leading-tight">
                    Your Personalized <span className="text-[#14a0a6]">Journey Dashboard</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Category", value: `${journeyConfig.type?.toUpperCase()} PASSPORT` },
                      { label: "Applicant", value: journeyConfig.age === "adult" ? "ADULT (18+)" : "MINOR (<18)" },
                      { 
                        label: "Submission", 
                        value: (journeyConfig.type === "new" && journeyConfig.method === "online")
                          ? "HYBRID (WEB + OFFICE)" 
                          : journeyConfig.method === "online" 
                            ? "ONLINE PORTAL" 
                            : "OFFICE VISIT" 
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#14a0a6] flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{item.label}</p>
                          <p className="text-xs font-black text-white">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-[10px] font-medium text-white/40 italic">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Irrelevant information hides automatically based on your case.
                  </div>
                </div>
              </motion.div>
              {filteredSections.map((section, sIdx) => {
                const content = getFilteredContent(section.id, section.content);
                const theme = sectionThemes[section.id] || sectionThemes.process;
                
                const isCollapsed = collapsedSections.includes(section.id);
                
                return (
                  <motion.div 
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                    className={cn(
                      "bg-white rounded-4xl border overflow-hidden shadow-sm flex flex-col transition-all duration-300",
                      theme.border,
                      !isCollapsed && theme.bg
                    )}
                  >
                    <button 
                      onClick={() => toggleSectionCollapse(section.id)}
                      className={cn(
                        "w-full text-left p-6 lg:p-8 border-b flex items-center justify-between group transition-colors",
                        isCollapsed ? "bg-slate-50/50 border-slate-100 hover:bg-slate-100/50" : cn("border-transparent", theme.bg)
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-2xl shadow-sm border transition-transform group-hover:scale-110",
                          isCollapsed ? "bg-white border-slate-100" : theme.iconBg,
                          !isCollapsed && "border-transparent"
                        )}>
                          <section.icon className={cn("w-5 h-5", theme.accent)} />
                        </div>
                        <div>
                          <h3 className={cn("font-bold transition-colors", theme.accent)}>{section.title}</h3>
                          <p className="text-xs text-slate-500">{section.description}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        className={cn(
                          "p-2 rounded-xl bg-white border text-slate-400 transition-colors",
                          !isCollapsed ? theme.border : "border-slate-200",
                          "group-hover:" + theme.accent
                        )}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 lg:p-8">
                            {section.id === "photos" ? (
                              <PhotoGuideSection />
                            ) : section.id === "locations" ? (
                              <LocationGuideSection />
                            ) : section.id === "fees" ? (
                              <div className="space-y-6">
                                <div className="bg-linear-to-br from-[#0d7377] to-[#14a0a6] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <DollarSign className="w-24 h-24" />
                                  </div>
                                  <div className="relative z-10">
                                    <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">
                                      {(!urgency || !pages || !validity) ? "Fee Projection" : "Tailored Quote"}
                                    </p>
                                    <h4 className="text-4xl font-black mb-4">
                                      {(!urgency || !pages || !validity) ? "Rs. Pending" : `Rs. ${(getRequiredFee() * (journeyConfig.type === "lost" ? 2 : 1)).toLocaleString()}`}
                                    </h4>
                                    {journeyConfig.type === "lost" && (
                                      <p className="text-[10px] text-white/80 font-bold mb-4 bg-white/10 p-2 rounded-lg">
                                        ⚠️ Note: Lost cases attract a 100% penalty for first loss (Double Fee).
                                      </p>
                                    )}
                                    {(!urgency || !pages || !validity) ? (
                                      <p className="text-xs text-white/60 italic font-medium">Please select your processing speed, page count, and validity in the sidebar to calculate exact fees.</p>
                                    ) : (
                                      <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">{passportType}</span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">{urgency}</span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">{pages} Pages</span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">{validity} Years</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="grid gap-4">
                                  <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                                    <h5 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4" /> 
                                      Official Payment Methods
                                    </h5>
                                    <p className="text-xs text-emerald-800 leading-relaxed">
                                      {journeyConfig.method === "online" ? (
                                        "Since you're applying Online, you must pay via Credit/Debit card (Visa/Mastercard) directly on the portal. Ensure your card has international sessions enabled."
                                      ) : (
                                        "For In-Person visits, generating a PSID via the 'Passport Fee Asaan' app is recommended. You can then pay at any bank branch or ATM before your appointment."
                                      )}
                                    </p>
                                  </div>
                                  
                                  {journeyConfig.type === "lost" && (
                                    <div className="p-5 rounded-2xl border border-red-100 bg-red-50 text-red-900">
                                      <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Lost Passport Note
                                      </h5>
                                      <p className="text-xs leading-relaxed opacity-80">
                                        Lost cases require a police report (FIR) and may incur a penalty fee (usually double for 1st loss) which is collected at the RPO.
                                      </p>
                                    </div>
                                  )}

                                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
                                    <h5 className="font-bold text-slate-900 text-sm mb-2">Important Note</h5>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                      Fees are non-refundable. For e-Passport (now available), fees start from Rs. 9,000 for 36 pages. Lost cases may have higher charges depending on the number of times lost.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : section.id === "time" ? (
                              <div className="space-y-4">
                                <div className="grid gap-4">
                                  {content.map((item: { heading: string; text?: string; [key: string]: unknown }, idx: number) => {
                                    const isActive = urgency === item.heading.toLowerCase().replace(" ", "") as "normal" | "urgent" | "fasttrack";
                                    return (
                                      <div 
                                        key={idx}
                                        className={cn(
                                          "p-5 rounded-2xl border transition-all",
                                          isActive 
                                            ? "bg-[#0d7377]/5 border-[#0d7377] shadow-sm scale-[1.02]" 
                                            : "bg-white border-slate-100 opacity-60"
                                        )}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={cn("font-bold text-sm", isActive ? "text-[#0d7377]" : "text-slate-900")}>
                                            {item.heading}
                                          </h5>
                                        </div>
                                        <p className="text-xs text-slate-500">{item.text}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                                {!urgency && (
                                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select processing speed in sidebar to see your schedule</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {content.map((item: { heading: string; text?: string; [key: string]: unknown }, idx: number) => {
                                  const itemId = `${section.id}-${idx}`;
                                  const isChecked = checkedItems.includes(itemId);
                                  
                                  return (
                                    <div 
                                      key={idx}
                                      onClick={() => toggleChecked(itemId)}
                                      className={cn(
                                        "group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                                        isChecked 
                                          ? "bg-emerald-50/50 border-emerald-200 shadow-sm" 
                                          : cn("bg-white border-slate-100", theme.hover)
                                      )}
                                    >
                                      <div className={cn(
                                        "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                                        isChecked 
                                          ? "bg-emerald-500 border-emerald-500 text-white" 
                                          : cn("border-slate-200 group-hover:", theme.accent.replace('text-', 'border-'))
                                      )}>
                                        {isChecked && <CheckCircle className="w-4 h-4" />}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className={cn(
                                          "font-bold text-sm mb-1 transition-colors",
                                          isChecked ? "text-emerald-900" : "text-slate-900"
                                        )}>{item.heading}</h4>
                                        <p className={cn(
                                          "text-xs leading-relaxed transition-colors whitespace-pre-line",
                                          isChecked ? "text-emerald-700/80" : "text-slate-500"
                                        )}>
                                          {(item.text || "").split(/(\[.*?\]\(.*?\))/g).map((part: string, i: number) => {
                                            const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                            if (match) {
                                              return (
                                                <a 
                                                  key={i} 
                                                  href={match[2]} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-[#0d7377] font-bold hover:underline inline-flex items-center gap-0.5"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  {match[1]}
                                                  <ExternalLink className="w-2 h-2" />
                                                </a>
                                              );
                                            }
                                            return part;
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}



        {/* Fee Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0d7377]/10 rounded-xl">
                  <DollarSign className="w-5 h-5 text-[#0d7377]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    2026 Fee Guidelines ({passportType === 'mrp' ? 'MRP' : 'e-Passport'})
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Fees by pages, validity, and urgency
                  </p>
                </div>
              </div>

              <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                {[
                  { id: "mrp", label: "MRP" },
                  { id: "e-passport", label: "e-Passport" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPassportType(t.id as "mrp" | "e-passport")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap",
                      passportType === t.id 
                        ? "bg-[#0d7377] text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-slate-50 to-slate-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Pages / Validity
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Normal
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Urgent
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Fast Track
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(currentGuidelines.normal).map((page, idx) => (
                    <tr
                      key={`5y-${idx}`}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm text-slate-700">
                        {page} Pages - 5 Years
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.normal[page]["5"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.urgent[page]["5"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.fasttrack[page][
                          "5"
                        ].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {Object.keys(currentGuidelines.normal).map((page, idx) => (
                    <tr
                      key={`10y-${idx}`}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm text-slate-700">
                        {page} Pages - 10 Years
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.normal[page]["10"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.urgent[page]["10"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {currentGuidelines.fasttrack[page][
                          "10"
                        ].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
              Additional service charges apply. For e-Passport, fees are higher
              (e.g., 36 pages 5y normal Rs. 9,000).
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-[#0d7377] via-[#14a0a6] to-[#32e0c4] p-1"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0d7377]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#14a0a6]/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0d7377]/10 text-[#0d7377] rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Ready to Apply?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
                Start Your Passport Application Today
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Use the official DGIP portal or visit your nearest office to get
                started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://onlinemrp.dgip.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-[#0d7377] to-[#14a0a6] text-white rounded-xl font-semibold hover:from-[#0a5a5d] hover:to-[#0d7377] transition-all shadow-lg shadow-[#0d7377]/20"
                >
                  Apply Online
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="https://dgip.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit DGIP
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-8 border-t border-slate-200">
          <p>Last updated: February 2026. Based on DGIP guidelines.</p>
          <p className="mt-2">
            This guide is for informational purposes only.
          </p>
        </footer> 
      </div>
    </div>
  );
}