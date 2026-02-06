"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Brain,
  LifeBuoy,
  Compass,
  MessageSquare,
  Calculator,
  Clock,
  Calendar,
  Camera,
  Files,
  PenTool,
  Wand2,
  FolderLock,
  ArrowRight,
} from "lucide-react";

// --- Data & Types ---

type ToolCategory =
  | "AI & Planning"
  | "Money & Sponsorship"
  | "Tracking"
  | "Docs & PDFs"
  | "Forms & Automation"
  | "Storage & Organization";

interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: React.ElementType;
  badge?: "Live" | "Soon" | "Beta";
  disabled?: boolean;
  comingSoon?: boolean;
}

const TOOLS: Tool[] = [
  // AI & Planning
  {
    id: "casepulse",
    title: "CasePulse AI",
    description:
      "Instant AI case strength score + gaps to fix before NVC/Interview.",
    category: "AI & Planning",
    href: "/visa-case-strength-checker",
    icon: Brain,
    badge: "Live",
  },
  {
    id: "221g-planner",
    title: "221(g) Rescue Planner",
    description:
      "Step-by-step next moves after 221(g) or Administrative Processing.",
    category: "AI & Planning",
    href: "/221g-action-planner",
    icon: LifeBuoy,
    badge: "Live",
  },
  {
    id: "visapath",
    title: "VisaPath Finder",
    description:
      "Quick quiz that points you to the right visa path + next steps.",
    category: "AI & Planning",
    href: "/visa-eligibility",
    icon: Compass,
    badge: "Live",
  },
  {
    id: "interviewiq",
    title: "InterviewIQ",
    description:
      "Prepare smarter and deliver confident answers when it matters most.",
    category: "AI & Planning",
    href: "/interview-prep",
    icon: MessageSquare,
    badge: "Live",
  },

  // Money & Sponsorship
  {
    id: "sponsorready",
    title: "SponsorReady",
    description: "Auto-check income/assets and tell you what you still need.",
    category: "Money & Sponsorship",
    href: "/affidavit-support-calculator",
    icon: Calculator,
    badge: "Live",
  },

  // Tracking
  {
    id: "queuewatch",
    title: "QueueWatch",
    description: "Track interview scheduling movement and trends by category.",
    category: "Tracking",
    href: "#",
    icon: Clock,
    disabled: true,
    badge: "Soon",
  },
  {
    id: "bulletinbuddy",
    title: "BulletinBuddy",
    description: "Check your priority date progress against the Visa Bulletin.",
    category: "Tracking",
    href: "/visa-checker",
    icon: Calendar,
    badge: "Live",
    disabled: false,
    comingSoon: false,
  },

  // Docs & PDFs
  {
    id: "photopass",
    title: "PhotoPass",
    description: "Make a compliant passport/visa photo in minutes.",
    category: "Docs & PDFs",
    href: "/passport",
    icon: Camera,
    badge: "Live",
  },
  {
    id: "pdftoolkit",
    title: "PDF ToolKit",
    description: "Merge • compress • convert • edit — all in one toolkit.",
    category: "Docs & PDFs",
    href: "/pdf-processing",
    icon: Files,
    badge: "Live",
  },
  {
    id: "signsnap",
    title: "SignSnap",
    description: "Create a clean digital signature for your forms.",
    category: "Docs & PDFs",
    href: "/signature-image-processing",
    icon: PenTool,
    badge: "Live",
  },

  // Forms & Automation
  {
    id: "formforge",
    title: "FormForge Autofill",
    description:
      "Auto-fills your official form and generates a ready-to-upload PDF.",
    category: "Forms & Automation",
    href: "/visa-forms",
    icon: Wand2,
    badge: "Live",
  },

  // Storage & Organization
  {
    id: "docvault",
    title: "Document Vault",
    description:
      "Organize docs + build shareable packets when the embassy asks.",
    category: "Storage & Organization",
    href: "/document-vault",
    icon: FolderLock,
    badge: "Live",
  },
];

const CATEGORIES: ("All" | ToolCategory)[] = [
  "All",
  "AI & Planning",
  "Money & Sponsorship",
  "Tracking",
  "Docs & PDFs",
  "Forms & Automation",
  "Storage & Organization",
];

// --- Components ---

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | ToolCategory
  >("All");

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#24292e] font-sans overflow-x-hidden selection:bg-[#0d7377] selection:text-white">
      {/* Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#0d7377]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#32e0c4]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        {/* <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-[#0d7377] tracking-tighter">
            Arachnie.Tools
          </div>
        </header> */}

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-[#24292e] to-[#586069] animate-fade-up">
            Create. Check. Comply.
          </h1>
          <p className="text-[#586069] text-lg max-w-2xl mx-auto animate-fade-up [animation-delay:100ms]">
            A suite of powerful tools designed to simplify complex processes and
            boost your productivity.
          </p>
        </section>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-10 animate-scale-in [animation-delay:200ms]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a737d] w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-[#e1e4e8] pl-11 pr-4 py-3 rounded-full text-[#24292e] focus:outline-none focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10 transition-all shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar animate-fade-in [animation-delay:300ms]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#0d7377] text-white border-[#0d7377] shadow-md"
                  : "bg-white text-[#586069] border-[#e1e4e8] hover:border-[#0d7377] hover:bg-[#e8f6f6] hover:text-[#0d7377]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 pt-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-[#586069]">
              No tools found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Tool Card Component ---

const CATEGORY_STYLES: Record<
  ToolCategory,
  {
    iconBox: string;
    innerBox: string;
    link: string;
    borderGradient: string;
  }
> = {
  "AI & Planning": {
    iconBox: "bg-[#7c3aed] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#7c3aed]",
    borderGradient: "from-[#a78bfa] to-[#c4b5fd]", // Violet 400-300
  },
  "Money & Sponsorship": {
    iconBox: "bg-[#059669] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#059669]",
    borderGradient: "from-[#34d399] to-[#6ee7b7]", // Emerald 400-300
  },
  Tracking: {
    iconBox: "bg-[#d97706] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#d97706]",
    borderGradient: "from-[#fcd34d] to-[#fde68a]", // Amber 300-200
  },
  "Docs & PDFs": {
    iconBox: "bg-[#e11d48] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#e11d48]",
    borderGradient: "from-[#fb7185] to-[#fda4af]", // Rose 400-300
  },
  "Forms & Automation": {
    iconBox: "bg-[#0891b2] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#0891b2]",
    borderGradient: "from-[#67e8f9] to-[#a5f3fc]", // Cyan 300-200
  },
  "Storage & Organization": {
    iconBox: "bg-[#4f46e5] text-white border-transparent",
    innerBox: "bg-white/20",
    link: "text-[#4f46e5]",
    borderGradient: "from-[#818cf8] to-[#a5b4fc]", // Indigo 400-300
  },
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = tool.icon;
  const isClickable = !tool.disabled;
  const CardWrapper = isClickable ? Link : "div";
  const styles = CATEGORY_STYLES[tool.category];

  return (
    <CardWrapper
      href={tool.href}
      className={`group relative flex flex-col bg-white border border-[#e1e4e8] rounded-[30px] p-6 pt-7 mt-6 
      transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] 
      ${
        isClickable
          ? "hover:-translate-y-2 hover:shadow-xl cursor-pointer"
          : "opacity-80 cursor-not-allowed grayscale-[0.5]"
      }
      animate-fade-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Floating Icon Box */}
      <div
        className={`absolute -top-6 left-6 w-14 h-14 rounded-2xl border flex items-center justify-center shadow-md transition-all duration-400 z-10 
        group-hover:-translate-y-1 group-hover:-rotate-3 group-hover:shadow-lg 
        ${styles.iconBox}`}
      >
        {/* Inner colored box for depth */}
        <div
          className={`absolute inset-1 rounded-[10px] -z-10 transition-colors duration-300 ${styles.innerBox}`}
        />
        <Icon className="w-6 h-6 stroke-2" />
      </div>

      {/* Floating Border Gradient (Pseudo-element emulation) */}
      <div
        className={`absolute inset-0 rounded-[30px] p-[2px] bg-linear-to-br ${styles.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-exclude`}
      />
      {/* //from-[#0d7377] to-[#32e0c4] */}
      {/* Radial Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(13,115,119,0.04),transparent_40%)]" />

      {/* Header (Badge) */}
      <div className="flex justify-end items-start mb-2 min-h-[24px] relative z-10">
        {tool.badge && (
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border 
            ${
              tool.badge === "Live"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {tool.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col grow pt-2">
        <h3 className="text-xl font-bold text-[#24292e] mb-1 transition-colors">
          {tool.title}
        </h3>
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#6a737d]/80 bg-[#f6f8fa] px-2 py-0.5 rounded">
            {tool.category}
          </span>
        </div>
        <p className="text-[#586069] text-sm leading-relaxed mb-6 grow">
          {tool.description}
        </p>
      </div>

      {/* Footer / Action */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#f0f2f4] mt-auto">
        <span className="text-xs font-medium text-[#6a737d] flex items-center gap-1">
          {/* Placeholder for stats or extra info if needed */}
        </span>

        {isClickable ? (
          <span
            className={`text-sm font-semibold flex items-center gap-1.5 group-hover:underline decoration-2 underline-offset-2 ${styles.link}`}
          >
            Open Tool <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          <span className="text-sm font-semibold text-[#9ca3af] flex items-center gap-1.5 cursor-not-allowed">
            Coming Soon
          </span>
        )}
      </div>
    </CardWrapper>
  );
}
