"use client";

import { useState, type ElementType } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  IdCard,
  Smartphone,
  Building2,
  FileText,
  CreditCard,
  HelpCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Fingerprint,
  Download,
  ExternalLink,
  Phone,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuideSectionProps {
  containerVariants: Variants;
  itemVariants: Variants;
}

interface StepItem {
  title: string;
  desc: string;
  icon: ElementType;
}

export default function CnicGuide() {
  const [activeTab, setActiveTab] = useState("overview");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-br from-emerald-900 via-emerald-800 to-slate-900 -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Updated for 2026
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl text-slate-800 font-black tracking-tight">
            Your Identity,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-200">
              Your Power
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
            The complete, modern guide to obtaining your CNIC in Pakistan.
            Navigate the NADRA process with confidence, whether online or
            in-person.
          </p>

          {/* <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full px-8 shadow-lg shadow-emerald-500/25 border-t border-emerald-400"
            >
              Start Guide
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-500 bg-transparent rounded-full px-8 backdrop-blur-sm"
            >
              Download App
              <Smartphone className="w-5 h-5 ml-2" />
            </Button>
          </div> */}
        </motion.div>

        {/* Main Interface */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          {/* Custom Tab Navigation */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-full inline-flex shadow-2xl">
              {[
                { id: "overview", label: "Overview", icon: IdCard },
                { id: "process", label: "The Journey", icon: MapPin },
                { id: "documents", label: "Documents", icon: FileText },
                { id: "fees", label: "Fees & Info", icon: CreditCard },
                { id: "faq", label: "Help Center", icon: HelpCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                    ${
                      activeTab === tab.id
                        ? "bg-white text-emerald-900 shadow-lg scale-105"
                        : "text-slate-400 hover:text-white hover:bg-emerald-300"
                    }
                  `}
                >
                  <tab.icon
                    className={`w-4 h-4 ${activeTab === tab.id ? "text-emerald-600" : ""}`}
                  />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {/* Bento Grid Layout */}
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="h-full border-none shadow-xl shadow-slate-200/50 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-teal-800 opacity-100 transition-opacity group-hover:opacity-95" />
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                      <CardHeader className="relative z-10">
                        <Badge className="w-fit bg-emerald-400/20 text-emerald-100 border-emerald-400/30 mb-2">
                          Essential
                        </Badge>
                        <CardTitle className="text-3xl font-bold text-white">
                          What is a CNIC?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 text-emerald-50 space-y-6">
                        <p className="text-lg leading-relaxed font-light opacity-90">
                          The{" "}
                          <strong className="text-white font-bold">
                            Computerized National Identity Card
                          </strong>{" "}
                          is your official digital identity as a Pakistani
                          citizen. It&apos;s not just an ID card; it&apos;s your
                          gateway to rights, services, and legal standing.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                            <span className="block text-3xl font-bold text-white mb-1">
                              13
                            </span>
                            <span className="text-emerald-200 text-sm font-medium">
                              Digit Unique ID
                            </span>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                            <span className="block text-3xl font-bold text-white mb-1">
                              10+
                            </span>
                            <span className="text-emerald-200 text-sm font-medium">
                              Core Uses
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <Fingerprint className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-900/20 rotate-12" />
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <Card className="bg-white border-none shadow-lg shadow-slate-200/50 h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Am I Eligible?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {[
                            {
                              label: "Citizenship",
                              val: "Pakistani",
                              icon: Globe,
                            },
                            {
                              label: "Minimum Age",
                              val: "18 Years",
                              icon: Clock,
                            },
                            {
                              label: "Status",
                              val: "Unregistered",
                              icon: AlertCircle,
                            },
                            {
                              label: "Gender",
                              val: "All Eligible",
                              icon: Fingerprint,
                            },
                          ].map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-md shadow-sm text-slate-400">
                                  <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-600">
                                  {item.label}
                                </span>
                              </div>
                              <span className="text-sm font-bold  bg-emerald-50 px-2 py-1 rounded text-emerald-700">
                                {item.val}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="md:col-span-3">
                    <div className="grid md:grid-cols-4 gap-4">
                      {[
                        "Passport",
                        "Driving License",
                        "Bank Accounts",
                        "Voter Registration",
                      ].map((use, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-3 text-slate-700 font-bold hover:shadow-md transition-shadow"
                        >
                          <Check className="w-5 h-5 text-emerald-500" />
                          {use}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* PROCESS TAB */}
              <TabsContent value="process" className="mt-0">
                <ProcessSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="mt-0">
                <DocumentsSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* FEES TAB */}
              <TabsContent value="fees" className="mt-0">
                <FeesSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* FAQ TAB */}
              <TabsContent value="faq" className="mt-0">
                <FAQSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProcessSection({
  containerVariants,
//   itemVariants,
}: GuideSectionProps) {
  const [mode, setMode] = useState<"online" | "offline">("online");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-2xl shadow-lg border border-slate-100 inline-flex">
          <button
            onClick={() => setMode("online")}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-all ${
              mode === "online"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Smartphone className="w-5 h-5" />
            Online App
            <Badge
              className={`ml-2 ${mode === "online" ? "bg-white text-emerald-700" : "bg-slate-200 text-slate-600"}`}
            >
              Recommended
            </Badge>
          </button>
          <button
            onClick={() => setMode("offline")}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-all ${
              mode === "offline"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-5 h-5" />
            In-Person Center
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Timeline */}
        <div className="md:col-span-7 space-y-6">
          {mode === "online" ? (
            <StepsList
              steps={[
                {
                  title: "Download PakID App",
                  desc: "Available on iOS and Android. Register your account.",
                  icon: Download,
                },
                {
                  title: "Start Application",
                  desc: "Select 'New CNIC' from the dashboard categories.",
                  icon: IdCard,
                },
                {
                  title: "Details & Uploads",
                  desc: "Enter personal info and upload scanned documents.",
                  icon: FileText,
                },
                {
                  title: "Fingerprints",
                  desc: "Use the app's camera to capture your fingerprints.",
                  icon: Fingerprint,
                },
                {
                  title: "Payment & Submit",
                  desc: "Pay online via credit/debit card and track status.",
                  icon: CreditCard,
                },
              ]}
              color="emerald"
            />
          ) : (
            <StepsList
              steps={[
                {
                  title: "Locate Center",
                  desc: "Find your nearest NADRA Registration Center (NRC).",
                  icon: MapPin,
                },
                {
                  title: "Token & Photo",
                  desc: "Get a token, go to the counter for photo capture.",
                  icon: IdCard,
                },
                {
                  title: "Data Entry",
                  desc: "Provide details and documents to the operator.",
                  icon: FileText,
                },
                {
                  title: "Biometrics",
                  desc: "Provide fingerprints and sign the form.",
                  icon: Fingerprint,
                },
                {
                  title: "Review & Submit",
                  desc: "Verify the printed form data and collect receipt.",
                  icon: CheckCircle2,
                },
              ]}
              color="slate"
            />
          )}
        </div>

        {/* Info Card */}
        <div className="md:col-span-5 sticky top-8">
          <Card
            className={`border-none shadow-2xl overflow-hidden ${mode === "online" ? "bg-emerald-900 text-white" : "bg-slate-900 text-white"}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader>
              <CardTitle className="text-2xl">
                {mode === "online"
                  ? "Why choose Online?"
                  : "Why choose In-Person?"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <ul className="space-y-4">
                {(mode === "online"
                  ? [
                      "Apply from the comfort of your home",
                      "Home delivery of your CNIC",
                      "No waiting in long queues",
                      "24/7 Application availability",
                    ]
                  : [
                      "Immediate biometric verification",
                      "Staff assistance for form filling",
                      "Better for complex/special cases",
                      "Instant photo capture",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-full ${mode === "online" ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="font-medium opacity-90">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Mock Phone/Center Visual */}
              <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/10 text-center">
                <p className="text-sm opacity-75 mb-2">Estimated Time</p>
                <p className="text-2xl font-bold">
                  {mode === "online" ? "15-20 Mins" : "1-2 Hours"}
                </p>
                <p className="text-xs opacity-50">(Application Process)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function StepsList({
  steps,
  color,
}: {
  steps: StepItem[];
  color: "emerald" | "slate";
}) {
  return (
    <div className="relative pl-8 border-l-2 border-slate-200 space-y-12 py-4">
      {steps.map((step, i) => (
        <div key={i} className="relative group">
          <div
            className={`
            absolute -left-[41px] top-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center
            transition-all duration-300 group-hover:scale-110
            ${color === "emerald" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-800"}
          `}
          >
            <step.icon className="w-5 h-5" />
          </div>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-5 flex gap-4 items-start">
              <div className="space-y-1">
                <h3
                  className={`text-lg font-bold ${color === "emerald" ? "text-emerald-900" : "text-slate-900"}`}
                >
                  {i + 1}. {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function DocumentsSection({
  containerVariants,
//   itemVariants,
}: GuideSectionProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docs = [
    "Original Birth Certificate or B-Form (CRC)",
    "Copies of Parents' CNICs",
    "Proof of Residence (Utility Bill/Domicile)",
    "Biometric Verification (Done at office)",
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid md:grid-cols-2 gap-8"
    >
      {/* Main Requirement Card */}
      <Card className="border-none shadow-xl bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                First-Time Applicants
              </CardTitle>
              <CardDescription>
                Most common requirements for age 18+
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="text-slate-400 hover:text-emerald-600"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-default"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-700 font-medium">{doc}</span>
            </div>
          ))}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              Ensure you bring <strong>Original Documents</strong>. Photocopies
              alone are often rejected.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Special Cases */}
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              No Blood Relative?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>If parents&apos; CNICs are unavailable (e.g. orphans), provide:</p>
            <ul className="space-y-2">
              {[
                "Birth Certificate",
                "School Leaving Certificate",
                "Guardian Verification (Court/Inst)",
                "Police/UC Verification",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-emerald-400" />
            Biometrics
          </h4>
          <p className="text-slate-300 text-sm opacity-90">
            Your fingerprints and photo will be captured on-site (or via app).
            Ensure your fingers are clean and dry for best results.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeesSection({ containerVariants, itemVariants }: GuideSectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-4xl mx-auto"
    >
      {/* Free Initiative Banner */}
      <motion.div
        variants={itemVariants}
        className="mb-8 p-1 rounded-2xl bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600"
      >
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Is the First CNIC Free?
              </h3>
              <p className="text-slate-600">
                Government initiatives often waive fees for first-time
                applicants.
              </p>
            </div>
          </div>
          {/* <Badge className="bg-emerald-600 text-white px-4 py-2 text-md">
            Limited Time Offer
          </Badge> */}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { type: "Normal", days: "30-31 Days", price: "~750", color: "blue" },
          {
            type: "Urgent",
            days: "12-15 Days",
            price: "~1,500",
            color: "purple",
          },
          {
            type: "Executive",
            days: "6-9 Days",
            price: "~2,500",
            color: "orange",
          },
        ].map((tier, i) => (
          <motion.div key={i} variants={itemVariants} className="group">
            <Card
              className={`h-full border-t-4 transition-all hover:-translate-y-2 hover:shadow-2xl ${
                tier.color === "blue"
                  ? "border-t-blue-500"
                  : tier.color === "purple"
                    ? "border-t-purple-500"
                    : "border-t-orange-500"
              }`}
            >
              <CardHeader className="text-center pb-2">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm">
                  {tier.type} Processing
                </h4>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-black text-slate-900">
                  <span className="text-lg align-top text-slate-400 font-normal mr-1">
                    Rs.
                  </span>
                  {tier.price}
                </div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${tier.color}-50 text-${tier.color}-700`}
                >
                  {tier.days}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function FAQSection({ containerVariants }: GuideSectionProps) {
  const faqs = [
    {
      q: "What age is CNIC mandatory?",
      a: "At age 18, Pakistani law entitles (and requires) you to obtain a CNIC for voting and other legal rights.",
    },
    {
      q: "Can I apply completely online?",
      a: "Yes, via the Pak ID app! However, first-time applicants may sometimes still need to visit a center for biometric verification if the app fails to capture it properly.",
    },
    {
      q: "What if I lose my CNIC?",
      a: "You can apply for a reprint (Lost ID) via the app or center. You may need a text of the FIR/NC number in some cases, but rules have relaxed recently.",
    },
    {
      q: "Is the process different for each province?",
      a: "NADRA is a federal authority, so the process is uniform nationwide (Punjab, Sindh, KP, Balochistan, etc.). Center timings and crowds may vary.",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-8 space-y-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b-slate-100"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-emerald-700">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4 space-y-6">
        <Card className="bg-slate-900 text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/10">
                <span className="text-2xl font-bold">1777</span>
              </div>
              <div>
                <p className="font-bold">NADRA Helpline</p>
                <p className="text-sm text-slate-400">For mobile users</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                asChild
              >
                <a
                  href="https://www.nadra.gov.pk"
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Website <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              {/* <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Track Application
                <Search className="w-4 h-4 ml-2" />
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
