"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Compare } from "../../../../../components/ui/compare";
import { Lens } from "../../../../../components/ui/lens";
import Image from "next/image";
import { Camera, CheckCircle, XCircle, Search } from "lucide-react";

export function PhotoGuideSection() {
  const [hovering, setHovering] = useState(false);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0d7377]/10 text-[#0d7377] rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            Passport Photo Guide
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
            Get Your Photo{" "}
            <span className="text-[#0d7377]">Right First Time</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Most passport rejections happen due to incorrect photos. Use our
            comparison tool and zoom lens to understand the requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Compare Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0d7377]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#0d7377]" />
              </div>
              Before & After Comparison
            </h3>
            <div className="p-4 border rounded-3xl bg-slate-50 border-slate-200">
              <Compare
                firstImage="/testing.jpg"
                secondImage="/passport-photo.jpg"
                firstImageClassName="object-cover"
                secondImageClassname="object-cover"
                className="h-75 w-full md:h-100 rounded-2xl"
                slideMode="hover"
                initialSliderPercentage={50}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Wrong
                  </p>
                  <p className="text-xs text-red-600">
                    Colored background, glasses, shadows on face
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    Correct
                  </p>
                  <p className="text-xs text-emerald-600">
                    White background, centered, proper lighting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lens Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0d7377]/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-[#0d7377]" />
              </div>
              Zoom & Inspect Details
            </h3>
            <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#0e3d3e] to-[#0a2a2b] p-6">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-75 h-25 bg-[#14a0a6]/20 blur-3xl rounded-full" />

              <div className="relative z-10">
                <Lens
                  hovering={hovering}
                  setHovering={setHovering}
                  zoomFactor={2}
                  lensSize={150}
                >
                  <Image
                    src="/passport-good.jpg"
                    alt="Correct passport photo example - hover to zoom in"
                    width={500}
                    height={500}
                    className="rounded-2xl w-full object-cover aspect-4/5"
                  />
                </Lens>
                <motion.div
                  animate={{
                    filter: hovering ? "blur(2px)" : "blur(0px)",
                  }}
                  className="pt-5 relative z-20"
                >
                  <h4 className="text-white text-xl font-bold">
                    Perfect Passport Photo
                  </h4>
                  <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                    Hover over the photo to zoom in and inspect the details.
                    White background, neutral expression, no glasses, proper
                    lighting, face centered.
                  </p>
                </motion.div>
              </div>

              {/* Photo requirements checklist */}
              <div className="relative z-10 mt-5 space-y-2">
                {[
                  "White or off-white background",
                  "Face centered, looking directly at camera",
                  "No glasses, hats, or head coverings",
                  "Neutral expression, mouth closed",
                  "Recent photo (within 6 months)",
                ].map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#14a0a6] shrink-0" />
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
