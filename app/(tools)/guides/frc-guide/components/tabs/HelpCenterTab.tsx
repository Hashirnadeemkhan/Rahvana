import { motion } from "framer-motion";
import { HelpCircle, Headphones, ExternalLink, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import frcData from "@/data/frc-guide-data.json";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const FaqTab = () => {
  const { faq, help_and_support } = frcData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* FAQ */}
      <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow)">
      <h3 className="text-lg font-bold text-card-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="space-y-2">
          {faq.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-xl px-5 data-[state=open]:border-primary/30 data-[state=open]:shadow-(--guide-card-shadow) transition-all"
            >
              <AccordionTrigger className="text-sm font-semibold text-card-foreground hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Help & Support */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow)">
          <h3 className="text-lg font-bold text-card-foreground mb-2 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Help & Support
          </h3>
          {"description" in help_and_support && (
            <p className="text-sm text-muted-foreground mb-5">{(help_and_support as { description: string }).description}</p>
          )}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Support Channels</p>
              <ul className="space-y-2">
                {help_and_support.support_channels.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Assistance Scope</p>
              <ul className="space-y-2">
                {help_and_support.assistance_scope.map((scope, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {scope}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Contact links */}
        {"contact_options" in help_and_support && (
          <div className="rounded-2xl border border-primary/20 bg-[#e8f6f6]/30 backdrop-blur-sm p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Quick Contact
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${(help_and_support as { contact_options: { helpline: string } }).contact_options.helpline}`}
                className="flex items-center gap-2 text-sm text-foreground font-semibold hover:text-primary transition-colors"
              >
                Helpline: {(help_and_support as { contact_options: { helpline: string } }).contact_options.helpline}
              </a>
              <a
                href={(help_and_support as { contact_options: { nrc_centers: string } }).contact_options.nrc_centers}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Find Nearest NRC Center
              </a>
            </div>
            {"important_note" in help_and_support && (
              <p className="text-xs text-muted-foreground italic mt-3">{(help_and_support as { important_note: string }).important_note}</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FaqTab;
