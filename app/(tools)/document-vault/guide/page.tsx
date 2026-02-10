"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Download,
  Clock,
  Briefcase,
  Heart,
  Landmark,
  Stethoscope,
  Camera,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 20 },
  },
};

const cardHoverVariants = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  hover: {
    y: -8,
    boxShadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

// Data for Sections
const features = [
  {
    icon: Zap,
    title: "Smart Personalization",
    description:
      "Generates a custom checklist based on your visa category (IR-1, CR-1, etc.) and personal history.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Clock,
    title: "Expiration Tracking",
    description:
      "Automatically tracks validity for documents like Police Certificate, Passport etc. Never miss a renewal.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Download,
    title: "NVC-Ready Exports",
    description:
      "One-click export creates perfectly organized files, simplifying the individual upload of each document to CEAC.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const categories = [
  {
    id: "civil",
    title: "Civil Documents",
    icon: Landmark,
    items: ["Birth Certificates", "Nikah Nama", "Passports", "CNIC"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "financial",
    title: "Financial Support",
    icon: Briefcase,
    items: ["Form I-864", "Tax Transcripts", "Employment Letters", "Pay Stubs"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "relationship",
    title: "Relationship Evidence",
    icon: Heart,
    items: ["Wedding Photos", "Joint Accounts", "Chat Logs", "Family Pictures"],
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "police",
    title: "Police & Court",
    icon: Shield,
    items: ["Police Certificates", "Court Records", "Military Records"],
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "medical",
    title: "Medical & Health",
    icon: Stethoscope,
    items: ["Medical Exam (DS-2019)", "Vaccination Records"],
    color: "from-red-500 to-orange-500",
  },
  {
    id: "photos",
    title: "Visa Photos",
    icon: Camera,
    items: ["2x2 Inch Validated Photos", "Digital Copies"],
    color: "from-violet-500 to-purple-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Personalize",
    description:
      "Tell the Vault your visa type and background (e.g., prior marriages). It instantly builds your required document list.",
  },
  {
    number: "02",
    title: "Collect & Upload",
    description:
      "Use our built-in wizards to learn how to get documents like NADRA Birth Certificates, then upload scans directly.",
  },
  {
    number: "03",
    title: "Review Progress",
    description:
      "The system checks your progress and alerts you to missing items or expiring certificates.",
  },
  {
    number: "04",
    title: "Export Package",
    description:
      "When ready, download a ZIP file containing all your documents, renamed and organized for easy upload.",
  },
];

const faqs = [
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We prioritize your privacy. All your documents are securely stored in our database using advanced encryption protocols. Your sensitive data remains protected and accessible only to you.",
  },
  {
    question: "What if I don't have a document yet?",
    answer:
      "No problem. You can mark it as 'Missing' or leave the slot empty. The progress bar will reflect your current status, helping you focus on what's left to do.",
  },
  {
    question: "Why does it say my Police Certificate is expiring?",
    answer:
      "For U.S. immigration, Pakistani Police Certificates are generally considered valid for only 1 year from the date of issuance to the interview date. We track this automatically to prevent delays.",
  },
  {
    question: "Does this submit documents to NVC for me?",
    answer:
      "No. The Document Vault is a preparation and organization tool. It helps you organize and prepare your documents efficiently. You will still need to upload the final files to the CEAC portal yourself.",
  },
];

export default function DocumentVaultGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-linear-to-b from-blue-50/80 to-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px]" />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-24 max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm bg-white/80 backdrop-blur-md border-blue-200 text-blue-700 shadow-xs rounded-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              Secure Document Management
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            Your Intelligent <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Immigration Vault
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Secure, personalized, and NVC-ready. Managing your case files has
            never been this smart.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/document-vault">
                Open My Vault{" "}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-full text-lg bg-white/80 hover:bg-white border-blue-200 text-slate-700 hover:text-blue-700"
            >
              <Link href="#features">How It Works</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* About / Purpose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-32 max-w-4xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center">
              What is the Document Vault?
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 text-center">
              The Document Vault is your{" "}
              <span className="text-blue-600 font-semibold">
                secure, intelligent workspace
              </span>{" "}
              for managing the complex documentation required for U.S.
              immigration (Family-Based Visas like IR-1, CR-1, IR-5).
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">
                    VS
                  </span>
                  Standard Folder
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start text-slate-500 text-sm">
                    <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" />
                    <span>Just basic file storage</span>
                  </li>
                  <li className="flex items-start text-slate-500 text-sm">
                    <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" />
                    <span>No expiration alerts</span>
                  </li>
                  <li className="flex items-start text-slate-500 text-sm">
                    <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" />
                    <span>You must figure out what&apos;s needed</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm font-bold">
                    ✓
                  </span>
                  Document Vault
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start text-slate-700 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                    <span className="flex-1">
                      <strong className="block mb-1 text-slate-900">
                        Smart Scenarios:
                      </strong>{" "}
                      Automatically adjusts your checklist for prior marriages,
                      military service, and joint sponsors.
                    </span>
                  </li>
                  <li className="flex items-start text-slate-700 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                    <span className="flex-1">
                      <strong className="block mb-1 text-slate-900">
                        Active Tracking:
                      </strong>{" "}
                      Alerts you before certificates get expired.
                    </span>
                  </li>
                  <li className="flex items-start text-slate-700 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                    <span className="flex-1">
                      <strong className="block mb-1 text-slate-900">
                        NVC Standard:
                      </strong>{" "}
                      Organizes your files in an easy, readable format by
                      automatically renaming each document for clarity.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="h-full border-none shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:translate-y-[-5px] transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-start h-full">
                  <div className={`p-4 rounded-2xl ${feature.color} mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comprehensive Coverage Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Complete Coverage
            </h2>
            <p className="text-xl text-slate-600">
              The Vault organizes every document according to your case
              category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={cardHoverVariants}
                initial="initial"
                whileHover="hover"
                className="group cursor-default rounded-3xl bg-white"
              >
                <div className="relative overflow-hidden rounded-3xl border border-slate-100 p-8 h-full">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${cat.color} opacity-10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${cat.color} flex items-center justify-center text-white mb-6 shadow-md`}
                    >
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {cat.title}
                    </h3>
                    <ul className="space-y-2">
                      {cat.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-slate-600 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Steps */}
        <div className="mb-32 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-0 right-0 h-1 bg-linear-to-r from-blue-100 via-blue-200 to-blue-100 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative z-10 h-full">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-lg mx-auto md:mx-0">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-center md:text-left">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">
              Common questions about security and submissions.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-white border text-left border-slate-100 rounded-xl px-2 shadow-xs"
              >
                <AccordionTrigger className="px-4 text-slate-900 hover:text-blue-600 hover:no-underline font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-slate-600 pb-4 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] overflow-hidden bg-slate-900 text-white text-center py-20 px-6 shadow-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-900 to-slate-900 z-0" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to organize your case?
            </h2>
            <p className="text-blue-100 text-xl mb-10">
              Stop guessing. Start building your perfect application package
              today.
            </p>
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-full text-lg bg-white text-slate-900 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-white/20"
            >
              <Link href="/document-vault">
                Launch Document Vault <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
