import { motion } from "framer-motion";
import {
  User,
  Users,
  AlertTriangle,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import frcData from "@/data/frc-guide-data.json";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function RequirementsTab() {
  const { required_documents, data_correction_rules } = frcData;

  const sections = [
    {
      icon: User,
      title: "Applicant Documents",
      items: required_documents.applicant,
    },
    {
      icon: Users,
      title: "Family Members",
      items: required_documents.family_members,
    },
    {
      icon: Upload,
      title: "Online Application",
      items: required_documents.online_application,
    },
  ];

  const specialCases = [
    {
      label: "Minor Children",
      text: required_documents.special_cases.minor_children,
    },
    {
      label: "Deceased Family Member",
      text: required_documents.special_cases.deceased_family_member,
    },
    { label: "POC Holder", text: required_documents.special_cases.poc_holder },
  ];

  return (
    <div className="space-y-8">
      {/* Document sections - 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {sections.map((sec, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-(--guide-card-shadow) hover:shadow-(--guide-card-hover-shadow) transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#e8f6f6] text-primary">
                  <sec.icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-card-foreground text-sm">
                  {sec.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {sec.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Special cases */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Special Cases
          </h3>
          <div className="space-y-3">
            {specialCases.map((sc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:border-primary/20 transition-colors"
              >
                <span className="text-sm font-bold text-card-foreground">
                  {sc.label}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{sc.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data correction rules */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-(--guide-card-shadow)"
      >
        <h3 className="font-bold text-card-foreground mb-4">
          Data Correction Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="rounded-xl bg-[#e8f6f6]/50 p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Allowed
            </p>
            <ul className="space-y-1.5">
              {data_correction_rules.allowed.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-destructive/5 p-5">
            <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Not Allowed
            </p>
            <ul className="space-y-1.5">
              {data_correction_rules.not_allowed.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">
          {data_correction_rules.incomplete_records}
        </p>
      </motion.div>
    </div>
  );
}
