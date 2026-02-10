"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "../../../../../components/ui/lamp";
import { Globe2, Clock, DollarSign, FileText, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section>
      <LampContainer className="min-h-130 md:min-h-140">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0d7377]/20 border border-[#14a0a6]/30 rounded-full mb-6">
            <Globe2 className="w-4 h-4 text-[#14a0a6]" />
            <span className="text-sm font-medium text-[#14a0a6]">
              Complete Guide 2026
            </span>
          </div>
          <h1 className="bg-linear-to-br from-[#e8f6f6] via-white to-[#14a0a6] py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl">
            Pakistani Passport
          </h1>
          <p className="text-center text-slate-400 max-w-2xl mt-4 text-base md:text-lg leading-relaxed">
            Everything you need to know about applying for or renewing a
            Pakistani passport - eligibility, fees, documents, offices, and
            step-by-step process.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 w-full max-w-3xl">
            {[
              {
                icon: Clock,
                label: "Processing",
                value: "2-21 days",
              },
              {
                icon: DollarSign,
                label: "Starting Fee",
                value: "Rs. 5,500",
              },
              {
                icon: FileText,
                label: "Validity",
                value: "5 or 10 yrs",
              },
              {
                icon: Shield,
                label: "For Travel",
                value: "6+ months",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center"
              >
                <stat.icon className="w-4 h-4 text-[#14a0a6] mx-auto mb-1" />
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-sm font-semibold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </LampContainer>
    </section>
  );
}
