"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Compare } from "../../../../../components/ui/compare";
import { Lens } from "../../../../../components/ui/lens";
import Image from "next/image";
import Link from "next/link";
import { Camera, CheckCircle, XCircle, Search, Sparkles, ArrowRight } from "lucide-react";

export function PhotoGuideSection() {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Lens Section (Zoom & Inspect) */}
      <div className="bg-white rounded-4xl overflow-hidden">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#0d7377]/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-[#0d7377]" />
          </div>
          Zoom & Inspect Details
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-slate-900 rounded-3xl p-6 lg:p-10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#14a0a6]/10 blur-[100px] rounded-full" />
          
          {/* Left: Image with Lens */}
          <div className="relative z-10 group">
            <Lens
              hovering={hovering}
              setHovering={setHovering}
              zoomFactor={2}
              lensSize={180}
            >
              <Image
                src="/passport-good.jpg"
                alt="Correct passport photo example - hover to zoom in"
                width={600}
                height={600}
                className="rounded-2xl w-full object-cover aspect-4/5 shadow-2xl"
              />
            </Lens>
            <div className="absolute -bottom-4 -right-4 bg-[#14a0a6] text-white p-3 rounded-2xl shadow-xl">
              <Search className="w-5 h-5" />
            </div>
          </div>

          {/* Right: Specifications */}
          <div className="relative z-10 space-y-8">
            <motion.div
              animate={{
                opacity: hovering ? 0.5 : 1,
              }}
            >
              <h4 className="text-white text-3xl font-black tracking-tight">
                The Perfect <span className="text-[#14a0a6]">Passport Photo</span>
              </h4>
              <p className="text-slate-400 mt-4 text-lg leading-relaxed">
                Your photo must meet strict NADRA standards to avoid application rejection. 
                Hover over the image to inspect the level of detail required.
              </p>
            </motion.div>

            <div className="grid gap-3">
              {[
                { title: "Standard Size", text: "45mm x 35mm (2 x 1.375 inches) exactly." },
                { title: "Paper & Color", text: "Matte finish paper. White background only." },
                { title: "Face Rules", text: "Full face, looking straight. No smile, neutral expression." },
                { title: "Attire", text: "Regular clothes; no uniforms or tinted glasses allowed." },
                { title: "Head Covering", text: "Allowed for religious reasons, but face & ears must be clear." },
                { title: "Face Zoom", text: "Face must cover 70-80% of the photo area (600 DPI)." },
              ].map((req, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#14a0a6]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#14a0a6]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{req.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{req.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Card for Passport Photo Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-4xl bg-linear-to-br from-[#0d7377] to-[#14a0a6] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h5 className="text-lg font-bold">Need a Perfect Photo?</h5>
                </div>
                <p className="text-white/80 text-xs mb-4 leading-relaxed">
                  Don&apos;t risk rejection due to poor lighting or background. Create a 100% compliant passport photo in seconds using our AI-powered tool.
                </p>
                <Link 
                  href="/passport"
                  className="inline-flex items-center gap-2 bg-white text-[#0d7377] px-6 py-3 rounded-xl font-bold text-sm hover:translate-x-1 transition-all shadow-lg"
                >
                  Start Photo Maker
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Compare Section (moved to bottom) */}
      <div className="pt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Camera className="w-6 h-6 text-[#0d7377]" />
              Visual Compliance Check
            </h3>
            <p className="text-slate-500 mt-1">Slide to compare common mistakes vs. correct standards.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100 italic">
              Common Rejection
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 italic">
              Standard Approved
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 p-4 border rounded-3xl bg-slate-50 border-slate-200 shadow-inner">
            <Compare
              firstImage="/testing.jpg"
              secondImage="/passport-photo.jpg"
              firstImageClassName="object-cover"
              secondImageClassname="object-cover"
              className="h-100 w-full rounded-4xl"
              slideMode="hover"
              initialSliderPercentage={50}
            />
          </div>
          
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-3">
                <XCircle className="w-5 h-5" />
                Common Pitfalls
              </div>
              <ul className="space-y-2 text-sm text-red-600 font-medium">
                <li>• Colored backgrounds (Blue/Red)</li>
                <li>• Reflective eyewear/glasses</li>
                <li>• Harsh shadows on face/neck</li>
                <li>• Low resolution or blurry print</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                <CheckCircle className="w-5 h-5" />
                The Gold Standard
              </div>
              <ul className="space-y-2 text-sm text-emerald-600 font-medium">
                <li>• Bright white, flat background</li>
                <li>• Soft, even lighting on face</li>
                <li>• High contrast, clear features</li>
                <li>• Correct 35x45mm sizing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
