import { motion } from "framer-motion";
import { useState } from "react";
import { Building, Smartphone, Clock, CheckCircle2, Download, Apple, Chrome } from "lucide-react";
import frcData from "@/data/frc-guide-data.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function HowToApplyTab() {
  const { application_methods, help_and_support } = frcData;
  const [isOpen, setIsOpen] = useState(false);

  const methods = [
    {
      key: "in_person" as const,
      icon: Building,
      title: application_methods.in_person.method,
      subtitle: application_methods.in_person.availability,
      steps: application_methods.in_person.steps,
      delivery: application_methods.in_person.delivery_time,
      format: null as string | null,
    },
    {
      key: "online" as const,
      icon: Smartphone,
      title: application_methods.online.method,
      subtitle: (
        <div className="flex items-center gap-2">
          <span>{application_methods.online.platform}</span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button 
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                onClick={() => setIsOpen(true)}
              >
                <Smartphone className="w-3 h-3" />
                Download App
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Download Pak Identity App
                </DialogTitle>
                <DialogDescription>
                  Choose your platform to download the official Pak Identity Mobile Application
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href={help_and_support.contact_options.pak_identity_google_play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 text-white">
                    <Chrome className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-card-foreground">Google Play</p>
                    <p className="text-xs text-muted-foreground mt-1">Android</p>
                  </div>
                </a>
                <a
                  href={help_and_support.contact_options.pak_identity_apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black text-white">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-card-foreground">App Store</p>
                    <p className="text-xs text-muted-foreground mt-1">iOS</p>
                  </div>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
      steps: application_methods.online.steps,
      delivery: application_methods.online.delivery_time,
      format: application_methods.online.output_format,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {methods.map((method, idx) => (
        <motion.div
          key={method.key}
          {...fadeUp}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow) hover:shadow-(--guide-card-hover-shadow) transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#e8f6f6] text-primary">
              <method.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground">
                {method.title}
              </h3>
              <div className="text-xs text-muted-foreground">
                {typeof method.subtitle === 'string' ? (
                  method.subtitle
                ) : (
                  method.subtitle
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {method.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.2 + i * 0.04 }}
                className="flex items-start gap-3 group"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f6f6] text-primary text-xs font-semibold">
              <Clock className="w-3 h-3" />
              {method.delivery}
            </span>
            {method.format && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {method.format}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
