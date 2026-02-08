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
  ChevronRight,
  ExternalLink,
  FileText,
  Users,
  TrendingUp,
  Home,
  Sparkles,
  BookOpen,
  Lightbulb,
  Globe2,
  RefreshCw,
  Search,
  MapPin,
  Camera,
} from "lucide-react";
import { HeroSection } from "./components/hero-section";
import { PhotoGuideSection } from "./components/photo-guide-section";
import { TestimonialsSection } from "./components/testimonials-section";

export default function PassportGuidePage() {
  const [pages, setPages] = React.useState<"36" | "72" | "100">("36");
  const [validity, setValidity] = React.useState<"5" | "10">("5");
  const [urgency, setUrgency] = React.useState<
    "normal" | "urgent" | "fasttrack"
  >("normal");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("understanding");
  const [completedSections, setCompletedSections] = React.useState<string[]>([]);


  const feeGuidelines2026: Record<string, Record<string, Record<string, number>>> = {
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

  const getRequiredFee = () => {
    return feeGuidelines2026[urgency][pages][validity];
  };

  const toggleSection = (section: string) => {
    setActiveTab(activeTab === section ? "" : section);
  };

  const markComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const progressPercentage = (completedSections.length / 10) * 100;

  const sections = [
    {
      id: "understanding",
      title: "Understanding Pakistani Passport",
      icon: BookOpen,
      description:
        "Learn about the types of passports and why you need one.",
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
          text: "Ordinary MRP (Machine Readable Passport): Common for citizens. e-Passport: Advanced with biometric chip. Official/Diplomatic: For government officials.",
        },
      ],
    },
    {
      id: "eligibility",
      title: "Eligibility Criteria",
      icon: Users,
      description:
        "Check if you qualify to apply for a Pakistani passport.",
      content: [
        {
          heading: "Who Can Apply?",
          text: "Every Pakistani citizen, including newborns. No minimum age.",
        },
        {
          heading: "Special Requirements",
          text: "Government employees need NOC from department (issued within 90 days). Overseas Pakistanis can renew online.",
        },
        {
          heading: "Special Cases",
          text: "Minors under 18, lost/damaged passports, name changes (e.g., after marriage).",
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      icon: FileText,
      description:
        "Complete checklist of documents needed for your application.",
      content: [
        {
          heading: "For Adults (New/Renewal)",
          text: "Original CNIC/NICOP + photocopy. Previous passport + photocopy of first 4 pages. NOC for government employees. For married women: Updated marital status on CNIC.",
        },
        {
          heading: "For Minors",
          text: "Original B-Form/CRC/Smart Card + photocopy. Parents' CNIC/NICOP + photocopies. Guardianship proof if applicable.",
        },
        {
          heading: "For Lost/Damaged",
          text: "FIR (police report) + copy. Affidavit. Damaged passport if available.",
        },
        {
          heading: "General",
          text: "Photos: White background, no glasses (NADRA guidelines). Fingerprint form scanned at 600 DPI.",
        },
      ],
    },
    {
      id: "photos",
      title: "Photo Specifications",
      icon: Camera,
      description: "Visual guide to meeting mandatory photo requirements.",
      content: [], // Handled by component injection in the main loop
    },
    {
      id: "process",
      title: "Application Process",
      icon: Globe2,
      description: "Step-by-step guide to applying online or in-person.",
      content: [
        {
          heading: "Online Process (Renewal/Mainly Overseas)",
          text: "1. Visit onlinemrp.dgip.gov.pk. 2. Register with CNIC/email/mobile. 3. Select category. 4. Upload details/photo/documents. 5. Pay fee online. 6. Submit and get token.",
        },
        {
          heading: "In-Person Process (New/Renewal)",
          text: "1. Pre-apply online (optional). 2. Visit RPO/EPO. 3. Submit documents at counter. 4. Biometrics/photo/data entry. 5. Interview. 6. Collect on given date.",
        },
        {
          heading: "Overseas",
          text: "Apply at embassy/consulate or online for renewal.",
        },
      ],
    },
    {
      id: "fees",
      title: "Fee Structure",
      icon: DollarSign,
      description:
        "Calculate fees based on pages, validity, and urgency.",
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
      id: "time",
      title: "Processing Time",
      icon: Clock,
      description: "Expected timelines for different categories.",
      content: [
        { heading: "Normal", text: "10-21 working days." },
        { heading: "Urgent", text: "4-7 working days." },
        {
          heading: "Fast Track",
          text: "2 working days (select cities). Backlog cleared in 2025.",
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
          heading: "Search Tips",
          text: "Use the search bar to filter by city or province.",
        },
      ],
    },
    {
      id: "tracking",
      title: "Tracking Your Application",
      icon: Search,
      description: "How to check status.",
      content: [
        {
          heading: "Methods",
          text: "Online: onlinetracking.dgip.gov.pk with token + DOB. SMS: Token to 9988. App: Passport Fee Asaan.",
        },
      ],
    },
    {
      id: "updates",
      title: "Recent Updates & Reforms",
      icon: RefreshCw,
      description: "Latest changes as of 2026.",
      content: [
        {
          heading: "Key Updates",
          text: "24/7 services in major cities. Fast Track in 47+ cities. e-Passport nationwide. Backlog eliminated. SHIKRA monitoring system (Jan 2026).",
        },
      ],
    },
    {
      id: "tips",
      title: "Tips & Common Mistakes",
      icon: Lightbulb,
      description: "Avoid pitfalls and best practices.",
      content: [
        {
          heading: "Tips",
          text: "Complete documents. Follow photo/fingerprint guidelines. Renew before expiry (6 months validity for travel). Avoid agents; use official site.",
        },
        {
          heading: "Common Mistakes",
          text: "Incomplete docs, wrong fees, expired CNIC.",
        },
      ],
    },
  ];

  const offices = [
    {
      province: "Islamabad",
      city: "Islamabad HQ",
      address: "DGIP Headquarter, G-8/1 Mauve Area, Islamabad.",
      phone: "051-111-344-777",
    },
    {
      province: "Islamabad",
      city: "Islamabad RPO G-10 (24/7)",
      address: "Plot Number 18, Sector G-10/4, Islamabad.",
      phone: "051-9239308",
    },
    {
      province: "Punjab",
      city: "Lahore-I (Garden Town) (24/7)",
      address: "4-A, Sher Shah Block, New Garden Town, Lahore.",
      phone: "042-9201836",
    },
    {
      province: "Punjab",
      city: "Rawalpindi",
      address:
        "Opposite Station High School No.3, Railway Workshop Road.",
      phone: "051-9237253",
    },
    {
      province: "Khyber Pakhtunkhwa",
      city: "Peshawar",
      address: "Phase-5, Hayatabad, Peshawar.",
      phone: "091-9217616-7",
    },
    {
      province: "Sindh",
      city: "Karachi (Saddar) (24/7)",
      address: "Shahrah-e-Iraq, Saddar, Karachi.",
      phone: "021-99203092",
    },
    {
      province: "Balochistan",
      city: "Quetta",
      address: "Arbab Barkat Ali Road, near FC Hospital, Quetta.",
      phone: "081-9201757",
    },
  ];

  const filteredOffices = offices.filter(
    (office) =>
      office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.province.toLowerCase().includes(searchTerm.toLowerCase())
  );




  const activeSectionData = sections.find(s => s.id === activeTab) || sections[0];


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




        {/* Central Guide Hub */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden mb-12 flex flex-col lg:flex-row min-h-175">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-[320px] bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#0d7377] rounded-2xl shadow-lg shadow-[#0d7377]/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 leading-none">Process Steps</h2>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-sans">Sequence Navigation</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {sections.map((section) => {
                const isActive = activeTab === section.id;
                const isCompleted = completedSections.includes(section.id);
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group relative",
                      isActive 
                        ? "bg-white shadow-md shadow-slate-200/50 border border-slate-200" 
                        : "hover:bg-slate-200/50"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute left-0 w-1 h-6 bg-[#0d7377] rounded-full"
                      />
                    )}
                    <div className={cn(
                      "p-2 rounded-xl transition-colors shrink-0",
                      isActive ? "bg-[#0d7377] text-white" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-700"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-semibold truncate",
                        isActive ? "text-[#0d7377]" : "text-slate-700"
                      )}>{section.title}</p>
                      {isCompleted && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-tighter mt-0.5"><CheckCircle className="w-3 h-3" /> Reviewed</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress Card within Sidebar */}
            <div className="mt-8 p-5 bg-linear-to-br from-[#0d7377] to-[#0a5a5d] rounded-3xl text-white">
              <div className="flex items-center justify-between mb-3 text-sm font-bold uppercase tracking-wider opacity-90">
                <span>Success Rate</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-white"
                />
              </div>
              <p className="text-[11px] leading-relaxed opacity-80">Complete all steps to minimize your passport rejection chances.</p>
            </div>
          </div>

          {/* Detailed Content Area */}
          <div className="flex-1 bg-white flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 lg:p-12 flex-1 scroll-smooth"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between mb-10 pb-8 border-b border-slate-100">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0d7377] mb-3 block">
                      Sequence {sections.findIndex(s => s.id === activeTab) + 1} of {sections.length}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{activeSectionData.title}</h2>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">{activeSectionData.description}</p>
                  </div>
                  <div className="hidden sm:block p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    {React.createElement(activeSectionData.icon, { className: "w-8 h-8 text-[#0d7377]" })}
                  </div>
                </div>

                {/* Section Specific Content Layouts */}
                <div className="grid gap-10">
                  {activeTab === "photos" ? (
                    <div className="-mt-16">
                      <PhotoGuideSection />
                    </div>
                  ) : activeTab === "fees" ? (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-6">
                        {activeSectionData.content.map((item, idx) => (
                          <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">{item.heading}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900 leading-relaxed">
                            <strong>Note:</strong> Service charges (~Rs. 1,000) and delivery fees are extra. Fast Track is only available in 47+ major cities.
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 ring-8 ring-slate-50">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-[#0d7377] rounded-xl">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">Fee Calculator</h3>
                            <p className="text-xs text-slate-500">Live Estimate per MRP 2026</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Urgency Level</label>
                            <select value={urgency} onChange={(e) => setUrgency(e.target.value as "normal" | "urgent" | "fasttrack")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d7377] outline-none">
                              <option value="normal">Normal (10-21 days)</option>
                              <option value="urgent">Urgent (4-7 days)</option>
                              <option value="fasttrack">Fast Track (2 days)</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 ml-1">Page Count</label>
                              <select value={pages} onChange={(e) => setPages(e.target.value as "36" | "72" | "100")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d7377] outline-none">
                                <option value="36">36 Pages</option>
                                <option value="72">72 Pages</option>
                                <option value="100">100 Pages</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 ml-1">Years Valid</label>
                              <select value={validity} onChange={(e) => setValidity(e.target.value as "5" | "10")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d7377] outline-none">
                                <option value="5">5 Years</option>
                                <option value="10">10 Years</option>
                              </select>
                            </div>
                          </div>
                          <div className="pt-4 mt-4 border-t border-slate-100">
                             <div className="bg-slate-900 rounded-2xl p-6 text-center shadow-inner">
                               <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 leading-none tracking-widest">Calculated Price</p>
                               <p className="text-4xl font-black text-white">Rs. {getRequiredFee().toLocaleString()}</p>
                               <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-white/10 rounded-full text-[10px] text-cyan-400 font-bold border border-white/5 uppercase">
                                 <CheckCircle className="w-3 h-3" /> MRP Category
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === "locations" ? (
                    <div className="space-y-8">
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#0d7377] transition-colors" />
                         </div>
                         <input 
                           type="text" 
                           placeholder="Search for office by city or province (e.g. Lahore, Sindh)..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full h-16 bg-slate-50 border border-slate-200 rounded-3xl pl-12 pr-6 text-slate-900 text-lg focus:ring-2 focus:ring-[#0d7377]/20 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                         />
                       </div>
                       <div className="grid md:grid-cols-2 gap-4 max-h-100 overflow-y-auto pr-2 scrollbar-thin">
                         {filteredOffices.map((office, idx) => (
                           <div key={idx} className="p-6 rounded-3xl border border-slate-100 bg-white hover:border-[#0d7377]/30 hover:shadow-md transition-all group">
                             <div className="flex justify-between items-start mb-3">
                               <h4 className="font-bold text-slate-800">{office.city}</h4>
                               <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{office.province}</span>
                             </div>
                             <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">{office.address}</p>
                             <div className="flex items-center gap-3 text-[#0d7377] group-hover:gap-4 transition-all">
                               <Globe2 className="w-4 h-4" />
                               <span className="text-xs font-bold">{office.phone}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {activeSectionData.content.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-8 pb-10 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-[#0d7377] mb-6 group-hover:bg-[#0d7377] group-hover:text-white transition-all shadow-sm">
                            {idx + 1}
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 mb-3">{item.heading}</h4>
                          <p className="text-slate-500 text-base leading-relaxed">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!completedSections.includes(activeTab) && (
                    <div className="mt-6">
                       <button
                        onClick={() => markComplete(activeTab)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#0d7377] text-white rounded-2xl font-bold hover:bg-[#0a5a5d] transition-all shadow-lg shadow-[#0d7377]/20 active:scale-95"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark this stage as Read
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            

          </div>
        </div>



        {/* Fee Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0d7377]/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-[#0d7377]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                2026 Fee Guidelines (MRP)
              </h2>
              <p className="text-slate-500 text-sm">
                Fees by pages, validity, and urgency
              </p>
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
                  {Object.keys(feeGuidelines2026.normal).map((page, idx) => (
                    <tr
                      key={`5y-${idx}`}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm text-slate-700">
                        {page} Pages - 5 Years
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.normal[page]["5"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.urgent[page]["5"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.fasttrack[page][
                          "5"
                        ].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {Object.keys(feeGuidelines2026.normal).map((page, idx) => (
                    <tr
                      key={`10y-${idx}`}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm text-slate-700">
                        {page} Pages - 10 Years
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.normal[page]["10"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.urgent[page]["10"].toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-800">
                        Rs.{" "}
                        {feeGuidelines2026.fasttrack[page][
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

        {/* Testimonials Section */}
        <TestimonialsSection />

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
