"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Shield,
  DollarSign,
  Heart,
  Users,
  Briefcase,
  FileCheck,
  ChevronRight,
  Search,
  BookOpen,
} from "lucide-react";

interface GuideCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  difficulty?: "Easy" | "Medium" | "Complex";
}

const guides: GuideCard[] = [
  // Identity & Civil Documents
  {
    title: "Passport",
    description: "How to obtain, renew, and prepare your passport for US visa application",
    href: "/guides/passport-guide",
    icon: <FileText className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Easy",
  },
  {
    title: "CNIC (National ID Card)",
    description: "Complete guide to obtaining and renewing your NADRA CNIC",
    href: "/guides/cnic",
    icon: <FileText className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Easy",
  },
  {
    title: "Birth Certificate",
    description: "NADRA CRC, B-Form, and alternative birth documentation",
    href: "/guides/birth-certificate",
    icon: <FileText className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Medium",
  },
  {
    title: "Nikahnama & Marriage Certificate",
    description: "Original Nikahnama, MRC, and certified English translation",
    href: "/guides/marriage-certificate",
    icon: <Heart className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Medium",
  },
  {
    title: "Family Registration Certificate (FRC)",
    description: "How to obtain FRC from NADRA for relationship proof",
    href: "/guides/frc",
    icon: <Users className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Easy",
  },
  {
    title: "Divorce & Death Certificates",
    description: "Termination of prior marriages documentation",
    href: "/guides/prior-marriage-termination",
    icon: <FileCheck className="h-6 w-6" />,
    category: "Identity & Civil Documents",
    difficulty: "Medium",
  },

  // Police & Legal Documents
  {
    title: "Police Character Certificate (PCC)",
    description: "Complete guide for all provinces: Sindh, Punjab, KPK, Balochistan",
    href: "/guides/police-certificate",
    icon: <Shield className="h-6 w-6" />,
    category: "Police & Legal Documents",
    difficulty: "Medium",
  },
  {
    title: "Court & Prison Records",
    description: "How to obtain legal records if applicable",
    href: "/guides/court-records",
    icon: <FileCheck className="h-6 w-6" />,
    category: "Police & Legal Documents",
    difficulty: "Complex",
  },

  // Financial Support Documents
  {
    title: "I-864 Affidavit of Support",
    description: "Complete guide to financial sponsorship requirements",
    href: "/guides/affidavit-of-support",
    icon: <DollarSign className="h-6 w-6" />,
    category: "Financial Support Documents",
    difficulty: "Complex",
  },
  {
    title: "Tax Transcripts & W-2 Forms",
    description: "How to obtain IRS tax documents for sponsorship",
    href: "/guides/tax-documents",
    icon: <Briefcase className="h-6 w-6" />,
    category: "Financial Support Documents",
    difficulty: "Medium",
  },
  {
    title: "Employment & Income Verification",
    description: "Employment letters, paystubs, and income proof",
    href: "/guides/employment-verification",
    icon: <Briefcase className="h-6 w-6" />,
    category: "Financial Support Documents",
    difficulty: "Easy",
  },

  // Relationship Evidence
  {
    title: "Bona Fide Marriage Proof",
    description: "Photos, communication records, and relationship evidence",
    href: "/guides/relationship-evidence",
    icon: <Heart className="h-6 w-6" />,
    category: "Relationship Evidence",
    difficulty: "Medium",
  },

  // Medical Examination
  {
    title: "Medical Examination",
    description: "Panel physicians, vaccinations, and medical requirements",
    href: "/guides/medical-exam",
    icon: <FileCheck className="h-6 w-6" />,
    category: "Medical Examination",
    difficulty: "Medium",
  },
  {
    title: "Vaccination Requirements",
    description: "CDC-required vaccinations and polio certificate",
    href: "/guides/vaccinations",
    icon: <FileCheck className="h-6 w-6" />,
    category: "Medical Examination",
    difficulty: "Easy",
  },

  // Visa Process Documents
  {
    title: "DS-260 Form",
    description: "How to complete the immigrant visa application",
    href: "/guides/ds260",
    icon: <FileText className="h-6 w-6" />,
    category: "Visa Process Documents",
    difficulty: "Complex",
  },
  {
    title: "Interview Preparation",
    description: "Required documents and what to bring to the embassy",
    href: "/guides/interview-documents",
    icon: <FileCheck className="h-6 w-6" />,
    category: "Visa Process Documents",
    difficulty: "Medium",
  },
];

const categories = Array.from(new Set(guides.map((g) => g.category)));

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Document Guides</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              Step-by-step guides for every document you need for your US visa journey.
              Clear instructions, timelines, and common pitfalls to avoid.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides... (e.g., 'passport', 'police certificate')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                !selectedCategory
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Guides ({guides.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category} ({guides.filter((g) => g.category === category).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-6 py-12">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No guides found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {categories
              .filter(
                (category) =>
                  !selectedCategory ||
                  category === selectedCategory
              )
              .map((category) => {
                const categoryGuides = filteredGuides.filter((g) => g.category === category);
                if (categoryGuides.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <div className="h-1 w-12 bg-primary rounded-full"></div>
                      {category}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryGuides.map((guide) => (
                        <Link
                          key={guide.href}
                          href={guide.href}
                          className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/30"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                              {guide.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg text-slate-800 group-hover:text-primary transition-colors">
                                  {guide.title}
                                </h3>
                                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{guide.description}</p>
                              {guide.difficulty && (
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    guide.difficulty === "Easy"
                                      ? "bg-green-100 text-green-700"
                                      : guide.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {guide.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Personalized Help?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Our AI tools can analyze your specific case and create a customized document checklist.
          </p>
          <Link
            href="/visa-case-strength-checker"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Try CasePulse AI
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
