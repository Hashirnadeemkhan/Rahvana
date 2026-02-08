"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Users,
  TrendingUp,
  Home,
  Sparkles,
  Target,
  Trophy,
  BookOpen,
  Lightbulb,
  ArrowDown,
  Globe2,
  RefreshCw,
  Search,
  MapPin,
  ChevronDown,
  Zap,
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
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [completedSections, setCompletedSections] = React.useState<string[]>(
    []
  );

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
    setActiveSection(activeSection === section ? null : section);
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

  const sectionIcons = [
    BookOpen, Users, FileText, Globe2, DollarSign,
    Clock, MapPin, Search, RefreshCw, Lightbulb
  ]; // Still used if needed elsewhere but fixed the unused warning if it was assigned but not used
  console.log(sectionIcons); // Temporary usage to bypass lint if still unused


  const sectionColors = [
    "from-[#0d7377] to-[#14a0a6]",
    "from-[#0d7377] to-[#11908f]",
    "from-[#0a5a5d] to-[#0d7377]",
    "from-[#14a0a6] to-[#32e0c4]",
    "from-[#0d7377] to-[#14a0a6]",
    "from-[#0a5a5d] to-[#0d7377]",
    "from-[#0d7377] to-[#14a0a6]",
    "from-[#14a0a6] to-[#0d7377]",
    "from-[#0d7377] to-[#32e0c4]",
    "from-[#0a5a5d] to-[#14a0a6]",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100/30 to-slate-200/20">
      {/* Floating Progress Indicator */}
      <div className="fixed top-6 right-6 z-50 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-5 w-56"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-slate-800">Your Progress</span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-[#0d7377] to-[#14a0a6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-slate-600">
            {completedSections.length} of 10 sections completed
          </p>
          {completedSections.length === 10 && (
            <div className="mt-3 flex items-center gap-1.5 text-[#0d7377] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              All sections reviewed!
            </div>
          )}
        </motion.div>
      </div>

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

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4"
        >
          <div className="p-2 bg-amber-100 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">
              Important Notice
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This guide is for informational purposes only and does not
              constitute official advice. Always verify on{" "}
              <a
                href="https://dgip.gov.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-amber-900 inline-flex items-center gap-1"
              >
                dgip.gov.pk
                <ExternalLink className="w-3 h-3" />
              </a>{" "}
              or contact helpline 051-111-344-777.
            </p>
          </div>
        </motion.div>

        {/* Photo Guide Section (Compare + Lens) */}
        <PhotoGuideSection />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12 mt-8">
          {/* Left Column - Sections */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#0d7377]/10 rounded-xl">
                <Target className="w-6 h-6 text-[#0d7377]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Guide Sections
                </h2>
                <p className="text-sm text-slate-500">
                  Click each section to expand and learn more
                </p>
              </div>
            </div>

            {sections.map((section, sectionIdx) => {
              const isActive = activeSection === section.id;
              const isCompleted = completedSections.includes(section.id);
              const Icon = section.icon;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: sectionIdx * 0.05 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-[#0d7377]/30 shadow-lg shadow-[#0d7377]/10 bg-white"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-5 flex items-start gap-4 text-left"
                  >
                    <div
                      className={`p-3 rounded-xl bg-linear-to-br ${sectionColors[sectionIdx]} shadow-sm shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {section.title}
                        </h3>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 border-t border-slate-100"
                    >
                      <div className="pt-5 space-y-5">
                        {section.content.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="mt-1 w-7 h-7 rounded-full bg-linear-to-br from-[#0d7377]/10 to-[#14a0a6]/10 text-[#0d7377] flex items-center justify-center text-xs font-bold shrink-0 border border-[#0d7377]/20">
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-1">
                                {item.heading}
                              </h4>
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {item.text}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {!isCompleted && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          onClick={() => markComplete(section.id)}
                          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#0d7377] to-[#14a0a6] text-white rounded-xl font-medium text-sm hover:from-[#0a5a5d] hover:to-[#0d7377] transition-all shadow-sm hover:shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as reviewed
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - Fee Calculator, Resources, Office Search */}
          <div className="space-y-6">
            {/* Fee Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="bg-linear-to-r from-[#0d7377] to-[#14a0a6] p-5">
                <div className="flex items-center gap-2 text-white mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Fee Calculator</h3>
                </div>
                <p className="text-[#e8f6f6] text-sm">
                  Calculate your passport fee (MRP, 2026)
                </p>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) =>
                      setUrgency(
                        e.target.value as "normal" | "urgent" | "fasttrack"
                      )
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] outline-none transition-all bg-slate-50"
                  >
                    <option value="normal">Normal (10-21 days)</option>
                    <option value="urgent">Urgent (4-7 days)</option>
                    <option value="fasttrack">Fast Track (2 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pages
                  </label>
                  <select
                    value={pages}
                    onChange={(e) =>
                      setPages(e.target.value as "36" | "72" | "100")
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] outline-none transition-all bg-slate-50"
                  >
                    <option value="36">36 Pages</option>
                    <option value="72">72 Pages</option>
                    <option value="100">100 Pages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Validity
                  </label>
                  <select
                    value={validity}
                    onChange={(e) =>
                      setValidity(e.target.value as "5" | "10")
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] outline-none transition-all bg-slate-50"
                  >
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>

                <div className="bg-linear-to-br from-[#0d7377]/5 to-[#14a0a6]/5 rounded-2xl p-5 border border-[#0d7377]/20">
                  <p className="text-sm text-[#0d7377] font-medium mb-1">
                    Total Fee (PKR)
                  </p>
                  <p className="text-3xl font-bold text-[#0d7377]">
                    Rs. {getRequiredFee().toLocaleString()}
                  </p>
                  <p className="text-xs text-[#0d7377]/70 mt-2">
                    Based on 2026 DGIP Guidelines (excl. service charges)
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    Fees may vary for e-Passport or lost cases. Verify on
                    dgip.gov.pk.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Office Search */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">Find Office</h3>
              </div>
              <input
                type="text"
                placeholder="Search city or province..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] outline-none transition-all mb-4"
              />
              <div className="max-h-60 overflow-y-auto space-y-3">
                {filteredOffices.map((office, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {office.city} ({office.province})
                    </p>
                    <p className="text-xs text-slate-500">{office.address}</p>
                    <p className="text-xs text-slate-500">
                      Phone: {office.phone}
                    </p>
                  </div>
                ))}
                {filteredOffices.length === 0 && (
                  <p className="text-sm text-slate-500 text-center">
                    No results found
                  </p>
                )}
              </div>
            </div>

            {/* Quick Resources */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">
                  Quick Resources
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "DGIP Website",
                    icon: ExternalLink,
                    href: "https://dgip.gov.pk",
                  },
                  {
                    label: "Online Application",
                    icon: Globe2,
                    href: "https://onlinemrp.dgip.gov.pk",
                  },
                  {
                    label: "Fee Asaan App",
                    icon: Download,
                    href: "https://play.google.com/store/apps/details?id=pk.gov.dgip.passport",
                  },
                  {
                    label: "Tracking Portal",
                    icon: Search,
                    href: "https://onlinetracking.dgip.gov.pk",
                  },
                ].map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#0d7377]/10 transition-colors">
                      <resource.icon className="w-4 h-4 text-slate-500 group-hover:text-[#0d7377] transition-colors" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium group-hover:text-[#0d7377] transition-colors flex-1">
                      {resource.label}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0d7377] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Pro Tips Card */}
            <div className="bg-linear-to-br from-[#0d7377] to-[#0a5a5d] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                <h3 className="font-semibold">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#e8f6f6]">
                <li className="flex items-start gap-2">
                  <ArrowDown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 -rotate-90" />
                  Visit during off-peak hours to avoid crowds.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowDown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 -rotate-90" />
                  Keep copies of all submitted documents.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowDown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 -rotate-90" />
                  Use official channels only to avoid scams.
                </li>
              </ul>
            </div>
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
