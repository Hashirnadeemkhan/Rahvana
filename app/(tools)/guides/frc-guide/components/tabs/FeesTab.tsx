import { motion } from "framer-motion";
import { Banknote, Clock, AlertCircle, Building, Smartphone } from "lucide-react";
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
    <div className="space-y-8">
      {/* Fee Structure - 4 in a row */}
      <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-(--guide-card-shadow)">
        <div className="px-8 pt-6 pb-4">
          <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            Fee Structure
          </h3>
        </div>
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Important Notes */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-2xl border border-primary/20 bg-[#e8f6f6]/30 backdrop-blur-sm p-8">
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
              transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
              {note}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Processing Time - Clock Visualization */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Processing Time
        </h3>
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border-3 border-primary/20" />
            
            {/* Minimal hour markers (4 main positions) */}
            <div className="absolute inset-6">
              {/* 12 o'clock */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-primary" />
              {/* 3 o'clock */}
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/60" />
              {/* 6 o'clock */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-primary" />
              {/* 9 o'clock */}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/60" />
            </div>
            
            {/* Rotating processing line */}
            <div className="absolute top-1/3 left-1/2 w-0.5 h-20 origin-bottom animate-rotate-line">
              <div className="w-full h-full bg-gradient-to-t from-primary/80 to-primary/20 rounded-full" />
            </div>
            
            {/* Animated center pulse */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
            
            {/* NRC Label (Top) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30" />
              <div className="text-center">
                <p className="text-sm font-semibold text-card-foreground">NADRA Center</p>
                <p className="text-xs text-muted-foreground">Immediate</p>
              </div>
            </div>
            
            {/* Pak Identity Label (Bottom) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex flex-col items-center gap-1">
              <div className="text-center">
                <p className="text-sm font-semibold text-card-foreground">Pak Identity App</p>
                <p className="text-xs text-muted-foreground">24 Hours</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30" />
            </div>
          </div>
          
          {/* Detailed descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-card-foreground">NADRA Registration Center</h4>
              </div>
              <p className="text-sm text-muted-foreground">{processing_time.nrc}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                <Clock className="w-3 h-3" />
                Real-time Processing
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-card-foreground">Pak Identity App</h4>
              </div>
              <p className="text-sm text-muted-foreground">{processing_time.pak_identity}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                <Clock className="w-3 h-3" />
                24-Hour Window
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
