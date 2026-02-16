"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Heart,
  ShieldCheck,
  FileText,
  Users,
  CheckCircle,
  ChevronRight,
  Home,
  Zap,
  Briefcase,
  History,
  Scale,
  Clock,
  ExternalLink,
  Target,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import { HeroSection } from "./components/hero-section";
import { StrategicIndicators } from "./components/strategic-indicators";

const PILLARS = [
  {
    title: "Bona-Fide Marriage",
    desc: "The primary intent evaluation. Does your marriage exist for reasons beyond a Green Card?",
    icon: Heart,
    color: "from-rose-500/10 to-rose-500/5",
    textColor: "text-rose-600",
  },
  {
    title: "Public Charge Rule",
    desc: "Financial stability of the sponsor. Checking the 125% Federal Poverty Line requirement.",
    icon: Briefcase,
    color: "from-blue-500/10 to-blue-500/5",
    textColor: "text-blue-600",
  },
  {
    title: "Document Accuracy",
    desc: "Consistency across DS-260 and I-130 forms. Even small date misalignments matter.",
    icon: FileText,
    color: "from-emerald-500/10 to-emerald-500/5",
    textColor: "text-emerald-600",
  },
  {
    title: "Social Integration",
    desc: "How integrated is your spouse into your social circles (family, friends, community)?",
    icon: Users,
    color: "from-amber-500/10 to-amber-500/5",
    textColor: "text-amber-600",
  },
];

export default function VisaStrengthGuidePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
        
        {/* Navigation / Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-12 bg-white/50 backdrop-blur-md w-fit px-6 py-3 rounded-full border border-slate-200/50 shadow-sm mx-auto">
          <Link href="/" className="hover:text-cyan-500 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Adjudication Strategy Guide</span>
        </nav>

        {/* Section 1: The Four Pillars */}
        <section className="mb-20 mt-10">
          <div className="text-center mb-2 mt-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif italic mt-20">The Strategic Pillars</h2>
            <p className="text-slate-500 max-w-xl mx-auto">These four metrics determine the majority of interview outcomes. Mastering them is key to a smooth approval.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative group p-8 rounded-[2.5rem] border border-slate-200 bg-linear-to-br transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden",
                  pillar.color
                )}
              >
                <div className="relative z-10">
                  <div className={cn("p-4 rounded-2xl bg-white shadow-sm w-fit mb-6", pillar.textColor)}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Link to Tracker Tool */}
        <section className="mb-32">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-3xl group"
          >
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-cyan-500/30" />
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl text-center lg:text-left">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-500/20">
                      <Zap className="w-4 h-4" /> Recommended Tool
                   </div>
                   <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to check your <br/> <span className="text-cyan-400">Actual Case Score?</span></h2>
                   <p className="text-slate-400 text-lg mb-0 leading-relaxed font-medium">
                     While this guide teaches you the logic, our interactive checker actually calculates your strength based on your real data.
                   </p>
                </div>
                <Link 
                  href="/visa-case-strength-checker" 
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-cyan-400 hover:text-white transition-all shadow-xl flex items-center gap-3 active:scale-95"
                >
                  GO TO STRENGTH CHECKER
                  <ArrowRight className="w-6 h-6" />
                </Link>
             </div>
          </motion.div>
        </section>

        {/* Section 3: Indicators Grid */}
        <section className="mb-32">
          <div className="text-center mb-4">
             <span className="text-sm font-bold text-cyan-600 uppercase tracking-widest">Scrutiny Metrics</span>
             <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif italic">What Officers Look For</h2>
          </div>
          <StrategicIndicators />
        </section>

        {/* Section 4: Vertical Timeline / Roadmap */}
        <section className="mb-32 px-4">
           <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center mb-20">
                 <div className="p-3 bg-slate-900 rounded-2xl text-white mb-6">
                    <History className="w-8 h-8" />
                 </div>
                 <h2 className="text-4xl font-bold text-slate-900 font-serif italic">The Adjudication Lifecycle</h2>
                 <p className="text-slate-500 mt-4">Follow the strategic flow from initial filing to the final handshake.</p>
              </div>

              <div className="space-y-24 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />

                 {[
                   {
                     stage: "Stage 01",
                     title: "Document Hardening",
                     desc: "Before filing I-130, ensure all certificates are certified and translations are accurate. Inconsistent addresses at this stage create RFEs.",
                     icon: ShieldCheck,
                     side: "left"
                   },
                   {
                     stage: "Stage 02",
                     title: "Financial Scrutiny",
                     desc: "Your sponsor&#39;s income must meet the 125% line. If using a joint sponsor, ensure their paperwork is as robust as the primary sponsor&#39;s.",
                     icon: Scale,
                     side: "right"
                   },
                   {
                     stage: "Stage 03",
                     title: "Evidence Accumulation",
                     desc: "Crucial period during the 12-18 month wait. Continue gathering joint bank statements, photos, and flight tickets to show a continuing marriage.",
                     icon: Clock,
                     side: "left"
                   },
                   {
                     stage: "Stage 04",
                     title: "The Interview Lab",
                     desc: "The final 30 minutes. The officer is looking for natural interaction, consistency, and &#39;bona-fide&#39; intent through your answers.",
                     icon: Target,
                     side: "right"
                   }
                 ].map((step, idx) => (
                   <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "flex flex-col md:flex-row gap-8 md:gap-24 items-center relative",
                      step.side === "right" ? "md:flex-row-reverse" : ""
                    )}
                   >
                     {/* Number bubble */}
                     <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex w-12 h-12 rounded-full bg-white border-2 border-slate-100 items-center justify-center font-bold text-slate-400 z-10 shadow-sm group-hover:border-cyan-500 transition-colors">
                        {idx + 1}
                     </div>

                     <div className="flex-1 w-full">
                        <div className={cn(
                          "p-8 rounded-4xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all",
                          step.side === "right" ? "text-left" : "md:text-right"
                        )}>
                           <span className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-4 block">{step.stage}</span>
                           <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                           <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                     <div className="flex-1 hidden md:block" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Section 5: Tips & Common Pitfalls */}
        <section className="mb-32">
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                 <h2 className="text-4xl font-bold text-slate-900 font-serif italic mb-6">Expert <br/> <span className="text-cyan-600">Best Practices</span></h2>
                 <p className="text-slate-500 leading-relaxed">Small tactical adjustments that can significantly impact the interviewer&#39;s perception of your case.</p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                 <div className="p-8 rounded-4xl bg-white border border-slate-200">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-6">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-xl mb-3">Be Specific, Not Vague</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">When asked about wedding details, give names and specific funny moments rather than generic &#39;it was good&#39; answers.</p>
                 </div>
                 <div className="p-8 rounded-4xl bg-white border border-slate-200">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-6">
                       <HelpCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-xl mb-3">Declare Everything</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Previous overstays or minor legal issues (FIRs) must be declared. Omission is considered fraud and is often a permanent bar.</p>
                 </div>
              </div>
           </div>
        </section>

        <footer className="text-center text-sm text-slate-400 py-12 border-t border-slate-200 mt-20">
          <div className="flex items-center justify-center gap-6 mb-4">
             <Link href="https://uscis.gov" className="hover:text-cyan-500 transition-colors uppercase font-bold tracking-tighter flex items-center gap-1">USCIS.GOV <ExternalLink className="w-3 h-3"/></Link>
             <Link href="https://travel.state.gov" className="hover:text-cyan-500 transition-colors uppercase font-bold tracking-tighter flex items-center gap-1">STATE.GOV <ExternalLink className="w-3 h-3"/></Link>
          </div>
          <p>© 2026 Rahvana Documentation Hub. All rights reserved.</p>
          <p className="mt-2">IR-1/CR-1 Spousal Visa Adjudication Strategy • Revision 5.0</p>
        </footer>
      </div>
    </div>
  );
}

