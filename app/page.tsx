"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
// import { Header } from './test/components/Header';
import { Wizard } from "./test/components/Wizard";
import { Dashboard } from "./test/components/Dashboard";
import {
  VisaCategorySection,
  ToolsSection,
  PricingSection,
  IR1JourneyDetail,
} from "./test/components/StaticSections";
import { useWizard } from "./(main)/dashboard/hooks/useWizard";
import GetInTouch from "@/app/components/HomePage/GetInTouch";
import Image from "next/image";
import { StackedCarousel } from "./components/StackedCarousel";
import Link from "next/link";
import HydrationSafeButton from "@/app/components/HydrationSafeButton";

const JOURNEYS = [
  // Family & Protection
  {
    category: "Family & Protection",
    code: "IR-1/CR-1",
    title: "Spouse of U.S. Citizen",
    desc: "Bring your spouse to the United States through the immediate relative visa process.",
    icon: Icons.Heart,
    live: true,
  },
  {
    category: "Family & Protection",
    code: "K-1",
    title: "Fiancé(e) Visa",
    desc: "Bring your fiancé(e) to the U.S. to marry within 90 days of arrival.",
    icon: Icons.Briefcase,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "K-3",
    title: "Spouse (short-separation option)",
    desc: "Spouse (short-separation option)",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "IR-5",
    title: "Parent of U.S. Citizen",
    desc: "Petition for your parent as an immediate relative of a U.S. citizen.",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "IR-2 / CR-2",
    title: "Child of U.S. Citizen",
    desc: "Child of U.S. Citizen",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "IR-3 / IR-4",
    title: "Intercountry Adoption",
    desc: "Intercountry Adoption",
    icon: Icons.Globe,
    live: false,
  },
  // Family Preferences
  {
    category: "Family & Protection",
    code: "F-1",
    title: "Adult Child (Unmarried) of U.S. Citizen",
    desc: "Adult Child (Unmarried) of U.S. Citizen",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "F-2A",
    title: "Spouse/Child of Green Card Holder",
    desc: "Spouse/Child of Green Card Holder",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "F-2B",
    title: "Adult Child (Unmarried) of Green Card Holder",
    desc: "Adult Child (Unmarried) of Green Card Holder",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "F-3",
    title: "Adult Child (Married) of U.S. Citizen",
    desc: "Adult Child (Married) of U.S. Citizen",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "F-4",
    title: "Sibling of U.S. Citizen",
    desc: "Sibling of U.S. Citizen",
    icon: Icons.Globe,
    live: false,
  },
  // Humanitarian
  {
    category: "Family & Protection",
    code: "Refugee",
    title: "Refugee (USRAP)",
    desc: "Refugee (USRAP)",
    icon: Icons.ShieldCheck,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "Asylum",
    title: "Asylum (typically filed in U.S.)",
    desc: "Asylum (typically filed in U.S.)",
    icon: Icons.ShieldCheck,
    live: false,
  },
  {
    category: "Family & Protection",
    code: "Parole",
    title: "Humanitarian Parole (case-by-case)",
    desc: "Humanitarian Parole (case-by-case)",
    icon: Icons.ShieldCheck,
    live: false,
  },

  // Work & Business - Pro Work
  {
    category: "Work & Business",
    code: "H-1B",
    title: "Specialty Occupation",
    desc: "Work in the U.S. in a specialty occupation requiring a bachelor's degree.",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Work & Business",
    code: "L-1A / L-1B",
    title: "Company Transfer (Manager / Specialist)",
    desc: "Company Transfer (Manager / Specialist)",
    icon: Icons.Globe,
    live: false,
  },
  // Talent
  {
    category: "Work & Business",
    code: "O-1A / O-1B",
    title: "Extraordinary Talent (Science / Business / Arts)",
    desc: "Extraordinary Talent (Science / Business / Arts)",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Work & Business",
    code: "O-2",
    title: "Support Staff for O-1",
    desc: "Support Staff for O-1",
    icon: Icons.Globe,
    live: false,
  },
  // Sports/Arts
  {
    category: "Work & Business",
    code: "P-1 / P-2 / P-3",
    title: "Athlete / Entertainer / Tour Group",
    desc: "Athlete / Entertainer / Tour Group",
    icon: Icons.Activity,
    live: false,
  },
  // Trade / Investment
  {
    category: "Work & Business",
    code: "E-1",
    title: "Treaty Trader",
    desc: "Treaty Trader",
    icon: Icons.Building2,
    live: false,
  },
  {
    category: "Work & Business",
    code: "E-2",
    title: "Treaty Investor",
    desc: "Treaty Investor",
    icon: Icons.Globe,
    live: false,
  },
  // Culture / Faith
  {
    category: "Work & Business",
    code: "R-1",
    title: "Religious Worker",
    desc: "Religious Worker",
    icon: Icons.Heart,
    live: false,
  },
  {
    category: "Work & Business",
    code: "Q-1",
    title: "Cultural Exchange (Work + Culture)",
    desc: "Cultural Exchange (Work + Culture)",
    icon: Icons.Globe,
    live: false,
  },
  // Media
  {
    category: "Work & Business",
    code: "I",
    title: "Journalist / Media",
    desc: "Journalist / Media",
    icon: Icons.Globe,
    live: false,
  },
  // Seasonal
  {
    category: "Work & Business",
    code: "H-2A",
    title: "Seasonal Agriculture (eligibility list applies)",
    desc: "Seasonal Agriculture (eligibility list applies)",
    icon: Icons.Globe,
    live: false,
  },
  {
    category: "Work & Business",
    code: "H-2B",
    title: "Seasonal Non-Agriculture (eligibility list applies)",
    desc: "Seasonal Non-Agriculture (eligibility list applies)",
    icon: Icons.Globe,
    live: false,
  },
  // Training
  {
    category: "Work & Business",
    code: "H-3",
    title: "Trainee / Special Education Exchange",
    desc: "Trainee / Special Education Exchange",
    icon: Icons.Globe,
    live: false,
  },

  // Work Green Cards
  // High Impact
  {
    category: "Work Green Cards",
    code: "EB-1",
    title: "Priority Workers",
    desc: "For persons of extraordinary ability, outstanding researchers, and multinational executives.",
    icon: Icons.Star,
    live: false,
  },
  // Advanced
  {
    category: "Work Green Cards",
    code: "EB-2",
    title: "Advanced Degree / Exceptional Ability",
    desc: "Advanced Degree / Exceptional Ability",
    icon: Icons.Cpu,
    live: false,
  },
  {
    category: "Work Green Cards",
    code: "EB-2 (NIW Path)",
    title: "National Interest Waiver",
    desc: "Self-petition without employer sponsorship based on national interest.",
    icon: Icons.Briefcase,
    live: false,
  },
  // Career
  {
    category: "Work Green Cards",
    code: "EB-3",
    title: "Skilled Worker / Professional",
    desc: "Skilled Worker / Professional",
    icon: Icons.Users,
    live: false,
  },
  // Special
  {
    category: "Work Green Cards",
    code: "EB-4",
    title: "Special Immigrants (varies)",
    desc: "Special Immigrants (varies)",
    icon: Icons.Users,
    live: false,
  },
  // Investment
  {
    category: "Work Green Cards",
    code: "EB-5",
    title: "Investor Green Card",
    desc: "Investor Green Card",
    icon: Icons.Users,
    live: false,
  },
  // Lottery
  {
    category: "Work Green Cards",
    code: "DV",
    title: "Diversity Visa (DV Lottery)",
    desc: "Diversity Visa (DV Lottery)",
    icon: Icons.Users,
    live: false,
  },

  // Students & Visitors
  // Visit
  {
    category: "Students & Visitors",
    code: "B-2",
    title: "Tourism / Family Visit",
    desc: "Tourism / Family Visit",
    icon: Icons.Camera,
    live: false,
  },
  {
    category: "Students & Visitors",
    code: "B-1",
    title: "Business Visitor",
    desc: "Business Visitor",
    icon: Icons.Camera,
    live: false,
  },
  // Study
  {
    category: "Students & Visitors",
    code: "F-1",
    title: "Student Visa",
    desc: "Study at a U.S. academic institution or English language program.",
    icon: Icons.Camera,
    live: false,
  },
  {
    category: "Students & Visitors",
    code: "F-2",
    title: "Student Dependent",
    desc: "Student Dependent",
    icon: Icons.Camera,
    live: false,
  },
  {
    category: "Students & Visitors",
    code: "M-1",
    title: "Vocational / Technical Student",
    desc: "Vocational / Technical Student",
    icon: Icons.Camera,
    live: false,
  },
  {
    category: "Students & Visitors",
    code: "M-2",
    title: "Vocational Dependent",
    desc: "Vocational Dependent",
    icon: Icons.Camera,
    live: false,
  },
  // Exchange
  {
    category: "Students & Visitors",
    code: "J-1",
    title: "Exchange Visitor (Programs)",
    desc: "Exchange Visitor (Programs)",
    icon: Icons.Camera,
    live: false,
  },
  {
    category: "Students & Visitors",
    code: "J-2",
    title: "Exchange Dependent",
    desc: "Exchange Dependent",
    icon: Icons.Camera,
    live: false,
  },
];

const LIFECYCLE_STEPS = [
  {
    step: 1,
    title: "Preparation",
    icon: Icons.FileText,
    desc: "The foundation of a successful immigration case starts with thorough preparation. Gather all required documents, verify your eligibility, and understand the timeline ahead.",
    items: [
      "Verify petitioner eligibility",
      "Gather identity documents",
      "Collect marriage evidence",
      "Prepare financial documents",
    ],
  },
  {
    step: 2,
    title: "USCIS Filing",
    icon: Icons.CheckCircle,
    desc: "Submit your Form I-130 petition to USCIS. This establishes the family relationship and begins your official immigration journey.",
    items: [
      "Complete Form I-130",
      "Compile supporting documents",
      "Submit filing fee",
      "Track receipt notice",
    ],
  },
  {
    step: 3,
    title: "NVC Processing",
    icon: Icons.Layout,
    desc: "After USCIS approval, your case moves to the National Visa Center for document collection and interview scheduling.",
    items: [
      "Pay NVC fees",
      "Submit DS-260 application",
      "Upload civil documents",
      "Complete financial documents",
    ],
  },
  {
    step: 4,
    title: "Embassy Interview",
    icon: Icons.Users,
    desc: "Attend your visa interview at the U.S. embassy in your country. This is the final review before visa issuance.",
    items: [
      "Complete medical exam",
      "Prepare interview documents",
      "Attend visa interview",
      "Respond to any requests",
    ],
  },
  {
    step: 5,
    title: "Visa Issuance",
    icon: Icons.IdCard,
    desc: "Upon interview approval, your immigrant visa will be printed and returned to you along with a sealed packet.",
    items: [
      "Receive visa in passport",
      "Review visa details",
      "Pay USCIS immigrant fee",
      "Plan travel to U.S.",
    ],
  },
  {
    step: 6,
    title: "Entry & Green Card",
    icon: Icons.Plane,
    desc: "Enter the United States as a lawful permanent resident. Your green card will arrive by mail within weeks.",
    items: [
      "Enter U.S. before visa expiry",
      "Complete port of entry process",
      "Receive green card by mail",
      "Apply for Social Security",
    ],
  },
];

const FAQS = [
  {
    q: "How long does the IR-1 visa process take?",
    a: "Current processing times for IR-1/CR-1 visas typically range from 12 to 18 months, depending on USCIS case volume and embassy scheduling. Rahvana helps you stay on track and avoid unnecessary delays.",
  },
  {
    q: "What's the difference between IR-1 and CR-1 visas?",
    a: "Both visas are for spouses of U.S. citizens. The CR-1 (Conditional Resident) is issued if you've been married less than 2 years at the time of entry, giving you a 2-year conditional green card. The IR-1 (Immediate Relative) is for marriages of 2+ years and provides a 10-year permanent green card directly.",
  },
  {
    q: "What documents do I need for the I-130 petition?",
    a: "Key documents include: proof of U.S. citizenship (passport, birth certificate, naturalization certificate), marriage certificate, passport photos, proof of termination of prior marriages (if any), and evidence of bona fide marriage (photos, joint accounts, correspondence). Rahvana provides a complete checklist tailored to your situation.",
  },
  {
    q: "Can my spouse work while the visa is being processed?",
    a: "During consular processing (when your spouse is abroad), they cannot work in the U.S. However, once they enter the U.S. on their immigrant visa, they can work immediately. The immigrant visa stamp in their passport serves as proof of work authorization while waiting for the physical green card.",
  },
  {
    q: "What are the income requirements for sponsorship?",
    a: "The petitioner must demonstrate income at or above 125% of the Federal Poverty Guidelines for their household size. For 2024, this is approximately $24,650 for a household of 2. Assets can also be used, valued at 3x the shortfall. Joint sponsors are permitted if you don't meet the requirement alone.",
  },
  {
    q: "How does Rahvana help with my immigration case?",
    a: "Rahvana provides step-by-step guidance through each stage of your journey. We offer personalized document checklists, timeline tracking, AI-powered case insights, secure document storage, and access to immigration experts for consultations. Our goal is to simplify the complex process and reduce stress.",
  },
];

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const [activeSection, setActiveSection] = useState("home");
  const searchParams = useSearchParams();

  // Listen for section changes in URL
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Default to "home" if no section param
      setActiveSection("home");
      // Handle hash navigation (e.g. #contact)
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // If no hash and no section, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [searchParams]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [journeyTab, setJourneyTab] = useState("Family & Protection");
  const [activeStep, setActiveStep] = useState(1);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toastContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
    const container = toastContainerRef.current;
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
      </div>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Close button
    toast.querySelector(".toast-close")?.addEventListener("click", () => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    });

    // Auto-remove
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  };

  // Lifted wizard state to share with Dashboard
  const { state, actions, isLoaded } = useWizard();

  const handleNavigate = (section: string) => {
    if (section === "contact") {
      setActiveSection("home");
      setTimeout(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleAuth = () => {
    setIsSignedIn(!isSignedIn);
  };

  const handleStartJourney = () => {
    if (!isSignedIn) {
      handleToggleAuth();
    }
    setActiveSection("ir1-journey");
  };

  // const scrollCarousel = (amount: number) => {
  //   if (carouselRef.current) {
  //     carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  //   }
  // };

  // Auto-redirect to dashboard on login if explicitly toggled there?
  // The original app didn't do this, just showed the link. We'll keep it simple.

  return (
    <div className="min-h-screen bg-background font-sans text-slate-800">
      {/* <Header 
                    activeSection={activeSection} 
                    onNavigate={handleNavigate}
                    isSignedIn={isSignedIn}
                    onToggleAuth={handleToggleAuth}
                /> */}

      <main className="min-h-[calc(100vh-200px)]">
        {activeSection === "home" && (
          <div className="flex flex-col">
            {/* HERO SECTION */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
              <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2 max-w-2xl"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-rahvana-primary-pale text-rahvana-primary">
                      <Icons.ShieldCheck className="w-4 h-4" />
                      Trusted by families worldwide
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6">
                      Your Immigration Journey,
                      <br />
                      <span className="bg-linear-to-r from-rahvana-primary to-rahvana-primary-light bg-clip-text text-fill-transparent">
                        Simplified
                      </span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      Navigate the complexities of U.S. immigration with
                      confidence. Rahvana provides step-by-step guidance, smart
                      tools, and expert support to help you reunite with loved
                      ones.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-10">
                      <Link href={"/visa-category/ir-category"}>
                        <HydrationSafeButton
                          onClick={() => {}}
                          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-lg bg-linear-to-r from-rahvana-primary to-rahvana-primary-light shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                          Begin Your Journey
                          <Icons.ArrowRight className="w-5 h-5" />
                        </HydrationSafeButton>
                      </Link>
                      <Link href={"/visa-category/ir-category"}>
                        <HydrationSafeButton
                          onClick={() => {
                            // setActiveSection("journeys");
                          }} //() => handleNavigate("journeys")
                          className="inline-flex items-center px-8 py-4 text-base font-semibold text-rahvana-primary rounded-lg border border-slate-200 bg-white hover:bg-rahvana-primary-pale hover:border-rahvana-primary transition-all"
                        >
                          Explore Journeys
                        </HydrationSafeButton>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-8">
                      {[
                        { icon: Icons.Lock, text: "Secure Vault" },
                        { icon: Icons.Cpu, text: "AI Insights" },
                        {
                          icon: Icons.CheckCircle,
                          text: "Step-by-Step Guidance",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rahvana-primary-pale text-rahvana-primary">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium text-slate-600">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2 relative"
                  >
                    <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-rahvana-primary-pale/50 -z-10 blur-3xl"></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-rahvana-primary-pale/50 -z-10 blur-3xl"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                      <Image
                        src="/assets/images/hero-journey.jpg"
                        alt="Family reunion"
                        className="w-full h-auto aspect-4/3 object-cover"
                        height={600}
                        width={600}
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-rahvana-primary/10 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* JOURNEYS SECTION */}
            <section
              className="relative py-24 bg-slate-50 overflow-hidden"
              id="journeys"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%">
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rahvana-primary-pale text-rahvana-primary text-sm font-semibold mb-4"
                  >
                    <Icons.Compass className="w-4 h-4" />
                    Find Your Path
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
                  >
                    Explore Immigration Journeys
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg text-slate-600"
                  >
                    Select your visa category to access personalized guidance,
                    document checklists, and timeline tracking.
                  </motion.p>
                </div>

                <div className="flex justify-center gap-3 mb-12 flex-wrap">
                  {[
                    "Family & Protection",
                    "Work & Business",
                    "Work Green Cards",
                    "Students & Visitors",
                  ].map((tab) => (
                    <HydrationSafeButton
                      key={tab}
                      onClick={() => setJourneyTab(tab)}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all border ${
                        journeyTab === tab
                          ? "bg-rahvana-primary border-rahvana-primary text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-600 hover:border-rahvana-primary hover:text-rahvana-primary"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() +
                        tab.slice(1).replace("-", " ")}
                    </HydrationSafeButton>
                  ))}
                </div>

                <div className="relative group min-h-[500px] flex items-center justify-center">
                  <StackedCarousel
                    items={JOURNEYS.filter((j) => j.category === journeyTab)}
                    onNavigate={handleNavigate}
                    onNotify={() => setShowComingSoon(true)}
                  />
                </div>
              </div>
            </section>

            {/* QUICK TOOLS SECTION */}
            <section className="relative py-24 bg-white" id="tools">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rahvana-primary-pale text-rahvana-primary text-sm font-semibold mb-4"
                  >
                    <Icons.Wrench className="w-4 h-4" />
                    Power Tools
                  </motion.span>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                    Quick Tools at Your Fingertips
                  </h2>
                  <p className="text-lg text-slate-600">
                    Powerful tools designed to streamline your immigration
                    process and keep you informed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Icons.Activity,
                      title: "CasePulse AI",
                      desc: "Get AI-powered insights into your case status, processing times, and what to expect next.",
                    },
                    {
                      icon: Icons.ShieldAlert,
                      title: "221(g) Rescue Plan",
                      desc: "Navigate administrative processing with step-by-step guidance and status tracking.",
                    },
                    {
                      icon: Icons.Compass,
                      title: "VisaPath Finder",
                      desc: "Answer a few questions and discover the best visa options for your unique situation.",
                    },
                    {
                      icon: Icons.Calculator,
                      title: "SponsorReady (I-864)",
                      desc: "Calculate financial requirements and determine if you meet the sponsorship threshold.",
                    },
                    {
                      icon: Icons.FileCode,
                      title: "PDF PowerKit",
                      desc: "Merge, split, and organize your immigration documents with ease.",
                    },
                    {
                      icon: Icons.Edit3,
                      title: "FormForge Autofill",
                      desc: "Auto-complete immigration forms with your saved profile data.",
                    },
                  ].map((tool, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      onClick={() => setShowComingSoon(true)}
                      className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 transition-all hover:border-rahvana-primary/30 hover:shadow-xl cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-tr from-rahvana-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-14 h-14 rounded-xl bg-linear-to-br from-rahvana-primary to-rahvana-primary-light flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform">
                        <tool.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {tool.desc}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-rahvana-primary group-hover:gap-3 transition-all">
                        Coming Soon <Icons.ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <HydrationSafeButton
                    onClick={() => handleNavigate("tools")}
                    className="inline-flex items-center gap-2 px-8 py-3 text-base font-bold text-rahvana-primary border-2 border-rahvana-primary rounded-full hover:bg-rahvana-primary hover:text-white transition-all"
                  >
                    Explore all tools <Icons.ArrowRight className="w-5 h-5" />
                  </HydrationSafeButton>
                </div>
              </div>
            </section>

            {/* CONSULTATION BANNER */}
            <section className="py-24 bg-white">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-linear-to-r from-rahvana-primary to-rahvana-primary-light rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-10 lg:p-16 text-white self-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-semibold mb-6">
                        <Icons.MessageSquare className="w-4 h-4" />
                        Expert Guidance
                      </div>
                      <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                        Book a Consultation
                      </h2>
                      <p className="text-lg opacity-90 leading-relaxed mb-8">
                        Get personalized advice from immigration specialists who
                        understand your journey.{" "}
                        <span className="inline-block px-3 py-1 rounded-md bg-white/20 font-bold">
                          First consult is free.
                        </span>
                      </p>
                      <HydrationSafeButton
                        onClick={() => setShowComingSoon(true)}
                        className="inline-flex items-center px-10 py-5 bg-white text-rahvana-primary text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                      >
                        Book a Consultation
                      </HydrationSafeButton>
                    </div>
                    <div className="relative h-64 lg:h-full min-h-[400px] rounded-r-2xl">
                      <Image
                        src="/assets/images/consultation.jpg"
                        alt="Consultation"
                        className="absolute inset-0 w-full h-full object-cover rounded-r-2xl"
                        height={400}
                        width={400}
                      />
                      <div className="absolute inset-0 bg-linear-to-l from-transparent to-rahvana-primary/20 pointer-events-none"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* HOW RAHVANA WORKS SECTION */}
            <section className="py-24 bg-slate-50" id="how-it-works">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rahvana-primary-pale text-rahvana-primary text-sm font-semibold mb-4"
                  >
                    <Icons.TrendingUp className="w-4 h-4" />
                    Your Journey
                  </motion.span>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                    How Rahvana Works
                  </h2>
                  <p className="text-lg text-slate-600">
                    From preparation to arrival, we guide you through every step
                    of your immigration journey.
                    {/* A streamlined, 6-step process designed to remove stress and
                    uncertainty from your journey. */}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-square max-w-[500px] mx-auto w-full"
                  >
                    {/* SVG Layer for all lines */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Background Dashed Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        strokeDasharray="1 2"
                        fill="none"
                        className="text-slate-200"
                      />

                      {/* Animated Drawing Circle */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        fill="none"
                        className="text-rahvana-primary"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </svg>

                    {/* Pulsing beacon in middle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-rahvana-primary/5 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-rahvana-primary animate-ping opacity-75"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-rahvana-primary"></div>
                    </div>

                    {/* Step Nodes with Staggered Entrance */}
                    <motion.div
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.15,
                          },
                        },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const step = i + 1;
                        const isActive = activeStep === step;
                        return (
                          <HydrationSafeButton
                            key={step}
                            onClick={() => setActiveStep(step)}
                            variants={{
                              hidden: { opacity: 0, scale: 0.8 },
                              visible: { opacity: 1, scale: 1 },
                            }}
                            animate={{
                              scale: isActive ? 1.25 : 1,
                            }}
                            className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                              isActive
                                ? "bg-rahvana-primary text-white shadow-xl ring-8 ring-rahvana-primary/10"
                                : "bg-white text-slate-400 border border-slate-200 hover:border-rahvana-primary hover:text-rahvana-primary hover:scale-110 shadow-md"
                            }`}
                            style={{
                              left: `${(50 + 40 * Math.sin((angle * Math.PI) / 180)).toFixed(3)}%`,
                              top: `${(50 - 40 * Math.cos((angle * Math.PI) / 180)).toFixed(3)}%`,
                              translate: "-50% -50%",
                            }}
                          >
                            <span className="sr-only">Step {step}</span>
                            {React.createElement(LIFECYCLE_STEPS[i].icon, {
                              className: "w-6 h-6",
                            })}
                          </HydrationSafeButton>
                        );
                      })}
                    </motion.div>
                  </motion.div>

                  <div className="space-y-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-rahvana-primary text-white flex items-center justify-center text-xl font-bold">
                            0{activeStep}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {LIFECYCLE_STEPS[activeStep - 1].title}
                          </h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                          {LIFECYCLE_STEPS[activeStep - 1].desc}
                        </p>
                        <ul className="space-y-4">
                          {LIFECYCLE_STEPS[activeStep - 1].items.map(
                            (item, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100"
                              >
                                <Icons.Check className="w-5 h-5 text-rahvana-primary" />
                                {item}
                              </li>
                            ),
                          )}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 bg-white" id="faq">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rahvana-primary-pale text-rahvana-primary text-sm font-semibold mb-4"
                  >
                    <Icons.HelpCircle className="w-4 h-4" />
                    Common Questions
                  </motion.span>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  {FAQS.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className={`rounded-2xl border transition-all ${
                        openFAQ === i
                          ? "border-rahvana-primary bg-rahvana-primary-pale/30 shadow-md"
                          : "border-slate-200 bg-white hover:border-rahvana-primary/30"
                      }`}
                    >
                      <HydrationSafeButton
                        onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                        className="w-full px-8 py-6 text-left flex items-center justify-between"
                      >
                        <span className="text-lg font-bold text-slate-900 pr-8">
                          {faq.q}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            openFAQ === i
                              ? "bg-rahvana-primary border-rahvana-primary text-white rotate-45"
                              : "border-slate-200 text-slate-400 group-hover:border-rahvana-primary group-hover:text-rahvana-primary"
                          }`}
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </div>
                      </HydrationSafeButton>
                      <AnimatePresence>
                        {openFAQ === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-rahvana-primary/10 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* GET IN TOUCH */}
            {/* wrap in animation */}
            <motion.div
              id="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className=""
            >
              <GetInTouch />
            </motion.div>

            {/* COMING SOON MODAL */}
            <AnimatePresence>
              {showComingSoon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowComingSoon(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
                  >
                    <HydrationSafeButton
                      onClick={() => setShowComingSoon(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Icons.X className="w-6 h-6" />
                    </HydrationSafeButton>
                    <div className="w-16 h-16 rounded-2xl bg-rahvana-primary-pale text-rahvana-primary flex items-center justify-center mx-auto mb-6">
                      <Icons.Rocket className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
                      Coming Soon!
                    </h3>
                    <p className="text-slate-600 text-center mb-8">
                      Want early access? Join the waitlist and be the first to
                      know when this feature launches.
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setShowComingSoon(false);
                        showToast(
                          "You've been added to the waitlist!",
                          "success",
                        );
                      }}
                      className="space-y-4"
                    >
                      <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-rahvana-primary focus:ring-4 focus:ring-rahvana-primary/10 transition-all font-medium"
                      />
                      <HydrationSafeButton
                        type="submit"
                        className="w-full py-4 bg-rahvana-primary text-white font-bold rounded-xl shadow-lg hover:bg-rahvana-primary-dark transition-all active:scale-95"
                      >
                        Notify Me
                      </HydrationSafeButton>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Toast Container */}
            <div ref={toastContainerRef} className="toast-container" />
          </div>
        )}

        {activeSection === "journeys" && (
          <VisaCategorySection onNavigate={handleNavigate} />
        )}

        {activeSection === "ir1-journey" && (
          <IR1JourneyDetail
            isSignedIn={isSignedIn}
            onToggleAuth={handleToggleAuth}
            onStart={handleStartJourney}
          >
            <Wizard state={state} actions={actions} isLoaded={isLoaded} />
          </IR1JourneyDetail>
        )}

        {activeSection === "tools" && <ToolsSection />}

        {activeSection === "pricing" && <PricingSection />}

        {activeSection === "dashboard" && (
          <Dashboard
            state={state}
            isSignedIn={isSignedIn}
            onContinue={() => handleNavigate("ir1-journey")}
            onNavigate={handleNavigate}
            onToggleAuth={handleToggleAuth}
          />
        )}
      </main>

      {/* <Footer /> */}
    </div>

    // <div className="min-h-screen flex flex-col bg-white text-gray-800">

    //   {/* Main Content */}
    //   <main className="flex-1">
    //     {/* Tagline Section */}
    //     <section className="container mx-auto px-6 py-16 md:py-24">
    //       <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-md rounded-2xl p-8 md:p-12 text-center space-y-4">
    //         <h2 className="text-2xl md:text-3xl font-bold text-primary/90 tracking-wide">
    //           INFORMATION AND SERVICES TO MAKE YOUR GLOBAL TRAVEL CONVENIENT
    //         </h2>
    //         <p className="text-gray-600 leading-relaxed">
    //           Explore step-by-step visa guidance, documentation support, and expert consultancy for your global
    //           journey. Simplify your travel process with Rahvana — your trusted visa partner.
    //         </p>
    //         <div className="flex justify-center pt-4">
    //           <button className="px-6 py-3 rounded-lg bg-primary/90 text-white font-semibold shadow-md hover:bg-primary/100 transition-all">
    //             Get Started
    //           </button>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Additional Info Section (Optional - adds visual balance) */}
    //     <section className="container mx-auto px-6 py-16 md:py-24">
    //       <div className="grid md:grid-cols-3 gap-8">
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Easy Navigation</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             Clean and simple interface designed to help you find visa information quickly.
    //           </p>
    //         </div>
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Verified Data</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             All visa and service details are regularly verified for accuracy and reliability.
    //           </p>
    //         </div>
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Step-by-Step Help</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             Follow simple instructions and video guides to complete your forms with confidence.
    //           </p>
    //         </div>

    //       </div>
    //     </section>
    //   </main>

    //   {/* Footer */}
    //   <footer className="border-t border-blue-200 bg-white/70 backdrop-blur py-8">
    //     <div className="container mx-auto px-6 text-center text-sm text-gray-600">
    //       <p>© {new Date().getFullYear()} <span className="font-semibold text-primary/90">Rahvana</span>. All rights reserved.</p>
    //       <p className="mt-2 text-xs text-gray-500">Designed to simplify your global travel experience.</p>
    //     </div>
    //   </footer>
    // </div>
  );
}
