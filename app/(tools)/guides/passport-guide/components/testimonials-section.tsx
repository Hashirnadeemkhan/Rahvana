"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The guide made my first passport application super smooth. I knew exactly what documents to bring and how much fee to pay. Got my passport in 12 days!",
    name: "Ahmed Raza",
    designation: "Student, Lahore",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
  },
  {
    quote:
      "I was confused about the Fast Track process. This guide explained everything clearly. Applied for urgent and got it in 3 days. Highly recommended!",
    name: "Fatima Noor",
    designation: "Business Owner, Karachi",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "Renewed my expired passport from abroad. The online process section was very helpful. Saved me a lot of time and stress.",
    name: "Usman Ali",
    designation: "Overseas Pakistani, Dubai",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "The fee calculator is a lifesaver! I calculated exact costs before going to the office. No surprises. The photo guide also helped me avoid rejection.",
    name: "Sara Khan",
    designation: "Teacher, Islamabad",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const isActive = (index: number) => index === active;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0d7377]/10 text-[#0d7377] rounded-full text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            User Experiences
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
            What Others Say About{" "}
            <span className="text-[#0d7377]">The Process</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image Stack */}
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: Math.random() * 20 - 10,
                  }}
                  animate={{
                    opacity: isActive(idx) ? 1 : 0.7,
                    scale: isActive(idx) ? 1 : 0.95,
                    z: isActive(idx) ? 0 : -100,
                    rotate: isActive(idx) ? 0 : Math.random() * 20 - 10,
                    zIndex: isActive(idx) ? 40 : testimonials.length - idx,
                    y: isActive(idx) ? [0, -60, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: Math.random() * 20 - 10,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={t.src || "/placeholder.svg"}
                    alt={t.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-xl border-2 border-white"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-between">
            <motion.div key={active} className="min-h-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Quote className="w-8 h-8 text-[#0d7377]/20 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900">
                    {testimonials[active].name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {testimonials[active].designation}
                  </p>
                  <motion.p className="text-lg text-slate-600 mt-4 leading-relaxed">
                    {testimonials[active].quote.split(" ").map((word, idx) => (
                      <motion.span
                        key={idx}
                        initial={{
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          filter: "blur(0px)",
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                          delay: 0.02 * idx,
                        }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#0d7377]/10 transition-colors group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#0d7377] transition-colors" />
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#0d7377]/10 transition-colors group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-[#0d7377] transition-colors" />
              </button>
              <div className="flex gap-1.5 ml-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === active
                        ? "w-8 bg-[#0d7377]"
                        : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
