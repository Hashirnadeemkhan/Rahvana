"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  FileText,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Home,
  ShieldCheck,
  BadgeCheck,
  Info,
  ClipboardList,
  AlertTriangle,
  CreditCard,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { HeroSection } from "./components/hero-section";

// --- Types & Config ---

type Province = "punjab" | "kp" | "sindh" | "balochistan" | "islamabad" | "abroad";
type MarriageCategory = 
  | "first" 
  | "polygamy" 
  | "bride_divorced_widowed" 
  | "foreigner" 
  | "online" 
  | "special";

interface NikahJourneyConfig {
  province: Province;
  district?: string;
  category: MarriageCategory;
  brideName: string;
  groomName: string;
  brideAge: string;
  groomAge: string;
}

const initialConfig: NikahJourneyConfig = {
  province: "punjab",
  category: "first",
  brideName: "",
  groomName: "",
  brideAge: "",
  groomAge: "",
};

const PUNJAB_PILOT_DISTRICTS = ["Chakwal", "Jhelum", "Nankana Sahib", "Lahore", "Faisalabad"];

export default function NikahNamaGuidePage() {
  const [activeTab, setActiveTab] = React.useState<string>("requirements");
  const [completedSections, setCompletedSections] = React.useState<string[]>([]);
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [showJourneyForm, setShowJourneyForm] = React.useState(true);
  const [config, setConfig] = React.useState<NikahJourneyConfig>(initialConfig);

  // Persistence logic
  React.useEffect(() => {
    const saved = localStorage.getItem("nikah-guide-progress-v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedSections(parsed.completed || []);
        setCheckedItems(parsed.checked || []);
        if (parsed.config) setConfig(parsed.config);
        if (parsed.showForm !== undefined) setShowJourneyForm(parsed.showForm);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("nikah-guide-progress-v2", JSON.stringify({
      completed: completedSections,
      checked: checkedItems,
      config,
      showForm: showJourneyForm
    }));
  }, [completedSections, checkedItems, config, showJourneyForm]);

  const markComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const toggleChecked = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const resetGuide = () => {
    if (confirm("Are you sure you want to start over? All progress will be lost.")) {
      setConfig(initialConfig);
      setCompletedSections([]);
      setCheckedItems([]);
      setShowJourneyForm(true);
      setActiveTab("requirements");
      localStorage.removeItem("nikah-guide-progress-v2");
    }
  };

  const getDynamicSections = () => {
    const sections = [];

    // 1. Prerequisites & Eligibility
    const reqContent = [
      { 
        heading: "Age & Eligibility Verification", 
        text: `• Groom: ${config.groomName || 'Dulha'} (Age: ${config.groomAge || '...'}) ${Number(config.groomAge) < 18 ? "⚠️ WARNING: Groom is under the legal age of 18 in most provinces." : "✓ Minimum legal age 18 met."}\n• Bride: ${config.brideName || 'Dulhan'} (Age: ${config.brideAge || '...'}) ${Number(config.brideAge) < 16 ? "⚠️ CRITICAL: Bride is under 16. In Punjab, the legal age for females is now 18 (2024/25 update). Registration may be denied." : Number(config.brideAge) < 18 ? "✓ Legal min 16 met (Check Punjab specific 18+ rules)." : "✓ Minimum age requirements met."}` 
      },
      { 
        heading: "Basic Legal Eligibility", 
        text: "• Consent: Both parties must give free & valid consent.\n• Single Status: Groom must not have an existing marriage unless arbitration permission is obtained.\n• Prohibited Degrees: Parties must not be related within prohibited degrees (Mahram)." 
      },
    ];

    let reqImportant = "Registration of marriage is MANDATORY under the Muslim Family Laws Ordinance, 1961. Failure to register within 30 days can lead to fines and legal complications.";
    
    if (config.category === "polygamy") {
      reqImportant = "ADVISORY: Permission from the Arbitration Council is MANDATORY. You must provide the Permission Certificate number during UC registration. Without this, the second marriage registration is a criminal offense.";
    } else if (config.category === "bride_divorced_widowed") {
      reqImportant = "IDDAT COMPLIANCE: Ensure the 'Iddat' period (approx. 90 days for divorce, 130 days for widows) is complete before the Nikah ceremony. Registration requires proof of previous marriage dissolution.";
    } else if (config.category === "foreigner") {
      reqImportant = "FOREIGNER PROTOCOL: An NOC from the foreign national's Embassy is required. If the marriage happened abroad, the local Nikah Nama must be attested by MOFA before applying for a NADRA MRC.";
    }

    sections.push({
      id: "requirements",
      title: "Prerequisites",
      icon: ShieldCheck,
      content: reqContent,
      importantInfo: reqImportant
    });

    // 2. Required Documents
    const docContent = [
      { 
        heading: "Primary Identity Documents", 
        text: `• Original CNIC of ${config.groomName || 'Groom'}\n• Original CNIC of ${config.brideName || 'Bride'}\n• Copies of CNICs of both Fathers/Guardians\n• Copies of CNICs of 2 Nikah Witnesses` 
      },
      {
        heading: "Supporting Evidence",
        text: "• 2 Passport sized photographs of both parties (White background)\n• Original Handwritten Nikah Nama (signed by all parties and Nikah Khawan)"
      }
    ];

    if (config.category === "polygamy") {
      docContent.push({ heading: "Arbitration Documents", text: "• Written Permission from existing wife/Arbitration Council.\n• Copy of previous Marriage Certificate." });
    }
    if (config.category === "bride_divorced_widowed") {
      docContent.push({ heading: "Dissolution Proof", text: "• Original Divorce Decree (Talaq Nama) issued by Union Council OR Death Certificate of deceased spouse." });
    }
    if (config.category === "foreigner") {
      docContent.push({ heading: "International Docs", text: "• Original Passport & Valid Visa of foreign national.\n• Embassy NOC Certificate (Attested)." });
    }

    sections.push({
      id: "documents",
      title: "Documents",
      icon: FileText,
      content: docContent
    });

    // 3. Step-by-Step Registration
    const isPilot = config.province === "punjab" && config.district && PUNJAB_PILOT_DISTRICTS.includes(config.district);
    const processContent = [
      {
        heading: "Step 1: Union Council Registration",
        text: `• Visit the Union Council office where the Nikah took place.\n• Submit the manual/handwritten Nikah Nama copies.\n• Pay the UC registration fee (approx Rs. 200 - 500).\n• The Secretary will enter details into the provincial portal.`
      },
      {
        heading: "Step 2: NADRA MRC Application",
        text: "• Once registered at UC, apply for the Computerized Marriage Registration Certificate (MRC).\n• You can apply at the UC office, an E-Khidman Markaz (Punjab), or NADRA Mega Centers.\n• Biometric verification of the applicant (Groom or Father) is usually required."
      }
    ];

    if (isPilot) {
      processContent.unshift({ 
        heading: "⚡ Digital Pilot: Pak ID App", 
        text: `• Since ${config.district} is a pilot district, you can initiate registration via the 'Pak ID' Mobile App.\n• Use phone sensors for biometric verification of parties.\n• Obtain a digital MRC instantly in your ID Wallet app after approval.` 
      });
    }

    if (config.category === "online") {
      processContent.push({
        heading: "Online/Video Nikah Specifics",
        text: "• If the Nikah Khawan was in Pakistan, register at the local UC.\n• If parties were abroad, register at the Pakistan Mission/Consulate first, then MOFA attestation for NADRA linkage."
      });
    }

    sections.push({
      id: "process",
      title: "Registration Process",
      icon: Globe2,
      content: processContent
    });

    // 4. Fees & Timeline
    sections.push({
      id: "fees",
      title: "Fees & Timelines",
      icon: CreditCard,
      content: [
        { 
          heading: "Cost Breakdown (Official)", 
          text: "• UC Registration Fee: Rs. 200 - 500\n• NADRA MRC (Normal): Rs. 200 - 500\n• NADRA MRC (Fast-Track/Urgent): Rs. 1,000" 
        },
        {
          heading: "Timeline Expectations",
          text: "• UC Registration: 1-3 working days.\n• Computerized MRC (Normal): 7-10 working days.\n• Fast Track: 24-48 hours (via E-Khidmat/Mega Centers)."
        }
      ],
      importantInfo: "Avoid paying 'agents' or 'facilitators' extra. These fees are the standard government rates for 2026."
    });

    return sections;
  };

  const dynamicSections = getDynamicSections();

  const renderQuestionnaire = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 bg-white rounded-[3rem] border-2 border-[#14a0a6]/20 shadow-2xl overflow-hidden"
      >
        <div className="bg-linear-to-r from-[#0d7377] to-[#14a0a6] p-8 lg:p-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic">MRC Roadmap Builder</h2>
              <p className="text-teal-50 opacity-90 uppercase tracking-widest text-xs font-bold">2026 Registration Standards</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 space-y-12">
          {/* Location */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0d7377] text-white text-xs font-black shadow-lg">1</span>
              <label className="text-lg font-black text-slate-800 tracking-tight">Where did/will the marriage take place?</label>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: "punjab", label: "Punjab" },
                { id: "kp", label: "KPK" },
                { id: "sindh", label: "Sindh" },
                { id: "balochistan", label: "Balochistan" },
                { id: "islamabad", label: "Islamabad" },
                { id: "abroad", label: "Abroad" },
              ].map((loc) => (
                <button
                  key={`province-${loc.id}`}
                  onClick={() => setConfig({ ...config, province: loc.id as Province })}
                  className={cn(
                    "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all text-left",
                    config.province === loc.id
                      ? "bg-[#0d7377] border-[#0d7377] text-white shadow-xl"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-[#14a0a6]/40 hover:bg-white"
                  )}
                  type="button"
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {config.province === "punjab" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                   Search Pilot District <Smartphone className="w-3 h-3" />
                </p>
                <select 
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#14a0a6] bg-slate-50 font-bold text-slate-700"
                  value={config.district || ""}
                  onChange={(e) => setConfig({ ...config, district: e.target.value })}
                >
                  <option value="">Select Local District</option>
                  <option value="Chakwal">Chakwal (Registration via App)</option>
                  <option value="Jhelum">Jhelum (Registration via App)</option>
                  <option value="Nankana Sahib">Nankana Sahib (Registration via App)</option>
                  <option value="Lahore">Lahore (Expanded Pilot)</option>
                  <option value="Faisalabad">Faisalabad (Expanded Pilot)</option>
                  <option value="Other">Other District</option>
                </select>
              </motion.div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0d7377] text-white text-xs font-black shadow-lg">2</span>
              <label className="text-lg font-black text-slate-800 tracking-tight">Marriage Type</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: "first", label: "First Marriage" },
                { id: "polygamy", label: "Polygamy (Second/Third)" },
                { id: "bride_divorced_widowed", label: "Divorced/Widowed Bride" },
                { id: "foreigner", label: "Foreign Spouse" },
                { id: "online", label: "Proxy / Video Nikah" },
                { id: "special", label: "Special Case" },
              ].map((cat) => (
                <button
                  key={`category-${cat.id}`}
                  onClick={() => setConfig({ ...config, category: cat.id as MarriageCategory })}
                  className={cn(
                    "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all text-left",
                    config.category === cat.id
                      ? "bg-[#0d7377] border-[#0d7377] text-white shadow-xl"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-[#14a0a6]/40 hover:bg-white"
                  )}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Identity */}
          <div className="space-y-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0d7377] text-white text-xs font-black shadow-lg">3</span>
              <label className="text-lg font-black text-slate-800 tracking-tight">Personalize Your Guide</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Bride&apos;s Identity</p>
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-white bg-white focus:border-[#14a0a6] outline-none shadow-sm"
                  value={config.brideName}
                  onChange={(e) => setConfig({ ...config, brideName: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Current Age"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-white bg-white focus:border-[#14a0a6] outline-none shadow-sm"
                  value={config.brideAge}
                  onChange={(e) => setConfig({ ...config, brideAge: e.target.value })}
                />
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Groom&apos;s Identity</p>
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-white bg-white focus:border-[#14a0a6] outline-none shadow-sm"
                  value={config.groomName}
                  onChange={(e) => setConfig({ ...config, groomName: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Current Age"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-white bg-white focus:border-[#14a0a6] outline-none shadow-sm"
                  value={config.groomAge}
                  onChange={(e) => setConfig({ ...config, groomAge: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setShowJourneyForm(false);
                setActiveTab("requirements");
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-full py-6 bg-linear-to-r from-[#0d7377] to-[#14a0a6] text-white rounded-4xl font-bold text-lg shadow-2xl shadow-[#0d7377]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 group"
            >
              Generate Registration Roadmap
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-12 mt-8">
          <Link href="/" className="hover:text-[#0d7377] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link href="/guides" className="hover:text-[#0d7377] font-medium">Guides</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-[#0d7377] font-black tracking-tight underline decoration-teal-500/30 decoration-4 underline-offset-4">Registration Guide 2026</span>
        </nav>

        {showJourneyForm ? renderQuestionnaire() : (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Sidebar Summary */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#14a0a6]/5 rounded-full blur-2xl -mr-16 -mt-16" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3 text-[#0d7377]" /> Active Case
                    </h3>
                    <button 
                      onClick={() => setShowJourneyForm(true)}
                      className="text-[10px] font-black text-[#14a0a6] hover:bg-teal-50 px-3 py-1 rounded-full transition-colors"
                    >
                      EDIT INPUTS
                    </button>
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                          <span className="text-xs font-black text-slate-900 capitalize">{config.province} {config.district ? `(${config.district})` : ''}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                          <span className="text-xs font-black text-slate-901 capitalize">{config.category.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Personalized For</p>
                          <p className="text-xs font-black text-[#0d7377]">{config.groomName || 'Dulha'} & {config.brideName || 'Dulhan'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dynamicSections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveTab(s.id)}
                        className={cn(
                          "w-full px-6 py-4 rounded-[1.8rem] border-2 text-left transition-all flex items-center justify-between group",
                          activeTab === s.id 
                            ? "bg-[#0d7377] border-[#0d7377] text-white shadow-xl shadow-[#0d7377]/20" 
                            : "bg-white border-slate-50 text-slate-500 hover:border-[#14a0a6]/20 hover:text-slate-900 shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <s.icon className={cn("w-4 h-4", activeTab === s.id ? "text-white" : "text-slate-400 group-hover:text-[#0d7377]")} />
                          <span className="text-sm font-black">{s.title}</span>
                        </div>
                        {completedSections.includes(s.id) && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={resetGuide}
                    className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset & Start Over
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Content area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {dynamicSections
                  .filter(s => s.id === activeTab)
                  .map((section) => {
                    const currentIndex = dynamicSections.findIndex(s => s.id === activeTab);
                    const nextSection = dynamicSections[currentIndex + 1];
                    const prevSection = dynamicSections[currentIndex - 1];

                    return (
                      <motion.div 
                        key={section.id}
                        initial={{ opacity: 0, scale: 0.98, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98, x: -20 }}
                        className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-2xl relative"
                      >
                        <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-[#0d7377] to-[#14a0a6] flex items-center justify-center text-white shadow-lg">
                            <section.icon className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-0.5 rounded-full">Step {currentIndex + 1} of {dynamicSections.length}</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                          </div>
                        </div>

                        {/* Critical Info Box */}
                        {section.importantInfo && (
                          <div className="group bg-linear-to-br from-rose-50/50 to-rose-100/20 border-2 border-rose-100 p-8 rounded-4xl flex gap-5 mb-12 relative overflow-hidden transition-all">
                             <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                              <AlertTriangle className="w-32 h-32 text-rose-500" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-rose-100 shrink-0 shadow-sm">
                              <Info className="w-6 h-6 text-rose-500" />
                            </div>
                            <div className="relative z-10">
                              <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Legal Compliance Warning</h5>
                              <p className="text-sm text-rose-950 font-bold leading-relaxed">{section.importantInfo}</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-12">
                          {section.content.map((item, i) => (
                            <div key={i} className="space-y-6">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-[#14a0a6] rounded-full" />
                                <h4 className="font-black text-slate-900 text-lg tracking-tight">{item.heading}</h4>
                              </div>
                              <div className="grid gap-3">
                                {item.text.split('\n').filter(l => l.trim()).map((bullet, bIdx) => {
                                  const itemId = `${section.id}-${i}-${bIdx}`;
                                  const isChecked = checkedItems.includes(itemId);
                                  return (
                                    <div 
                                      key={bIdx}
                                      onClick={(e) => toggleChecked(itemId, e)}
                                      className={cn(
                                        "group flex items-start gap-4 p-6 rounded-[2rem] border-2 transition-all cursor-pointer box-border",
                                        isChecked 
                                          ? "bg-teal-50/40 border-[#0d7377]/20 shadow-sm" 
                                          : "bg-white border-slate-50 hover:border-[#14a0a6]/20 hover:bg-slate-50/50"
                                      )}
                                    >
                                      <div className={cn(
                                        "mt-0.5 w-6 h-6 rounded-[10px] border-2 flex items-center justify-center shrink-0 transition-all shadow-sm",
                                        isChecked ? "bg-[#0d7377] border-[#0d7377] text-white" : "border-slate-200 bg-white"
                                      )}>
                                        {isChecked && <CheckCircle className="w-4 h-4" />}
                                      </div>
                                      <span className={cn(
                                        "text-sm leading-relaxed",
                                        isChecked ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                                      )}>
                                        {bullet.replace(/^•\s*/, '')}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                          {prevSection ? (
                            <button
                              onClick={() => {
                                setActiveTab(prevSection.id);
                                window.scrollTo({ top: 400, behavior: 'smooth' });
                              }}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all active:scale-95"
                            >
                              <ChevronLeft className="w-5 h-5" />
                              Back
                            </button>
                          ) : <div />}

                          {nextSection ? (
                            <button
                              onClick={() => {
                                setActiveTab(nextSection.id);
                                markComplete(section.id);
                                window.scrollTo({ top: 400, behavior: 'smooth' });
                              }}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-linear-to-r from-[#0d7377] to-[#14a0a6] text-white font-black text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-[#0d7377]/20"
                            >
                              Proceed to {nextSection.title}
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                markComplete(section.id);
                                alert("Success! Your personalized 2026 Registration Roadmap is complete.");
                              }}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-emerald-600/20"
                            >
                              Finish Roadmap
                              <BadgeCheck className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
