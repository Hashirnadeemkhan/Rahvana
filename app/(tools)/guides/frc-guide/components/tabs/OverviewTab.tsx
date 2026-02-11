import { motion } from "framer-motion";
import { Shield, Users, Info, ChevronRight } from "lucide-react";
import frcData from "@/data/frc-guide-data.json";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function OverviewTab() {
  const { overview, categories, eligibility } = frcData;

  return (
    <div className="space-y-10">
      {/* What is FRC */}
      <motion.div
        {...fadeUp}
        className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow)"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#e8f6f6] text-primary shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-card-foreground mb-1">
              {overview.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {overview.legal_basis}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {overview.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {overview.primary_use.map((use, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f6f6] text-primary text-xs font-semibold"
            >
              <Info className="w-3 h-3" />
              {use}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground italic">
          Issuing Authority: {overview.issuing_authority} ·{" "}
          {overview.validity_note}
        </p>
      </motion.div>

      {/* Categories & Eligibility side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            FRC Categories
          </h3>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                className="group rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-(--guide-card-hover-shadow) transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-card-foreground">{cat.type}</h4>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">{cat.includes}</p>
                {"when_to_choose" in cat && (
                  <p className="text-xs text-primary/80 mt-2 font-medium">
                    {cat.when_to_choose as string}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Eligibility */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow) h-fit"
        >
          <h3 className="text-lg font-bold text-card-foreground mb-3">
            Eligibility
          </h3>
          <p className="text-muted-foreground mb-4">
            {eligibility.basic_requirement}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-card-foreground">
              Allowed Exceptions:
            </p>
            <ul className="space-y-1.5">
              {eligibility.allowed_exceptions.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic mt-3">
              {"important_note" in eligibility
                ? (eligibility as { important_note?: string }).important_note
                : (eligibility as { data_source?: string }).data_source}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
