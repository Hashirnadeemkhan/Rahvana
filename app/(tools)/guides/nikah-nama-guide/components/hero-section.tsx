"use client";
import React from "react";
import { motion } from "motion/react";
import { Globe2, Heart, FileText, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-[#e8f6f6] to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14a0a6]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-[#0d7377]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#14a0a6]/20 rounded-full mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#0d7377]" />
            <span className="text-sm font-bold text-[#0d7377] uppercase tracking-wider">
              Marriage Registration 2026
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            NADRA MRC <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0d7377] to-[#14a0a6]">Registration Guide</span>
          </h1>
          
          <p className="max-w-2xl text-slate-600 text-base md:text-lg leading-relaxed mb-10">
            A simplified, step-by-step roadmap for Union Council registration and obtaining your NADRA-issued computerized Marriage Registration Certificate (MRC).
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {[
              {
                icon: FileText,
                label: "Digital Era",
                value: "Pak-ID Integrated",
              },
              {
                icon: Shield,
                label: "Compliance",
                value: "NADRA Mandatory",
              },
              {
                icon: Globe2,
                label: "Validation",
                value: "Global Acceptance",
              },
              {
                icon: CheckCircle2,
                label: "Timeline",
                value: "15-30 Day Window",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-5 h-5 text-[#0d7377]" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-sm font-black text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

