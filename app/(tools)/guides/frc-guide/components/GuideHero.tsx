import { motion } from "framer-motion";
import { FileText, CalendarDays, Building2 } from "lucide-react";

const GuideHero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-20">
      {/* Grid background */}
      <div className="absolute inset-0 guide-grid-bg pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsl(168_70%_42%/0.1)] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[hsl(168_70%_42%/0.08)] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(168_70%_42%/0.15)] text-[hsl(168_70%_42%)] text-sm font-semibold mb-5"
          >
            <CalendarDays className="w-4 h-4" />
            Updated Guide — 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5"
          >
            Family Registration{" "}
            <span className="text-gradient-primary">Certificate (FRC)</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Your complete guide to obtaining the FRC from NADRA — covering eligibility,
            application methods, required documents, fees, and everything you need for
            embassy and immigration purposes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: FileText, label: "Official NADRA Document" },
              { icon: Building2, label: "Embassy & Immigration Use" },
              { icon: CalendarDays, label: "Real-time Issuance" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#e8f6f6] text-primary">
                  <item.icon className="w-4 h-4" />
                </div>
                {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GuideHero;
