import { motion } from "framer-motion";
import { Banknote, Clock, AlertCircle } from "lucide-react";
import frcData from "@/data/frc-guide-data.json";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function FeesTab() {
  const { fees, processing_time, important_notes } = frcData;

  const feeItems = [
    { label: "By Birth", ...fees.by_birth },
    { label: "By Marriage", ...fees.by_marriage },
    { label: "By Adoption", ...fees.by_adoption },
    { label: "By All", ...fees.by_all },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: Fees + Processing */}
      <div className="space-y-6">
        {/* Fee table */}
        <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-(--guide-card-shadow)">
          <div className="px-8 pt-6 pb-4">
            <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" />
              Fee Structure
            </h3>
          </div>
          <div className="px-8 pb-6">
            <div className="grid grid-cols-2 gap-4">
              {feeItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  className={`rounded-xl p-5 text-center border hover:scale-[1.02] transition-transform ${
                    item.label === "By All"
                      ? "bg-[#e8f6f6] border-primary/20 ring-1 ring-primary/10"
                      : "bg-muted/50 border-border"
                  }`}
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{item.label}</p>
                  <p className="text-2xl font-extrabold text-foreground">
                    {item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.currency}</p>
                  {"note" in item && (
                    <p className="text-[10px] text-muted-foreground/70 mt-2">{(item as { note?: string }).note}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Processing time */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Processing Time
          </h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors">
              <p className="text-sm font-bold text-card-foreground mb-1">NADRA Registration Center</p>
              <p className="text-sm text-muted-foreground">{processing_time.nrc}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors">
              <p className="text-sm font-bold text-card-foreground mb-1">Pak Identity App</p>
              <p className="text-sm text-muted-foreground">{processing_time.pak_identity}</p>
            </div>
          </div>
      </motion.div>
      </div>

      {/* Right column: Important notes */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl border border-primary/20 bg-[#e8f6f6]/30 backdrop-blur-sm p-8 h-fit">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Important Notes
        </h3>
        <ul className="space-y-4">
          {important_notes.map((note, i) => (
            <motion.li
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.06 }}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
            {note}
          </motion.li>
        ))}
        </ul>
      </motion.div>
    </div>
  );
};
