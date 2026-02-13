"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Syringe,
  Globe,
  FileCheck,
  Activity,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Download,
  CheckCircle2,
  Info,
  Calendar,
  Plane,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuideSectionProps {
  containerVariants: Variants;
  itemVariants: Variants;
}

interface StepItem {
  title: string;
  desc: ReactNode;
  icon: ElementType;
  color: string;
}

export default function PolioVaccinationGuide() {
  const [activeTab, setActiveTab] = useState("overview");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

        {/* Abstract Icons */}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.07] pointer-events-none rotate-12">
          <Syringe className="w-full h-full text-slate-900" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] opacity-[0.07] pointer-events-none -rotate-12">
          <Globe className="w-full h-full text-blue-900" />
        </div> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-bold text-sm">
            <Plane className="w-4 h-4" />
            Travel Essential 2026
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight">
            Polio Vaccination{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              Certificate
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            Your comprehensive guide to obtaining the official government Polio
            Certificate (NIMS). Mandatory for international travel and official
            documentation.
          </p>
        </motion.div>

        {/* Main Interface */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-12"
        >
          {/* Navigation Pills */}
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 rounded-full h-auto shadow-sm">
              {[
                { id: "overview", label: "Overview", icon: Globe },
                { id: "process", label: "Step-by-Step", icon: Activity },
                { id: "provinces", label: "Provinces", icon: MapPin },
                { id: "faq", label: "Common FAQs", icon: FileCheck },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-full px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 gap-2 font-bold"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              <TabsContent value="overview">
                <OverviewSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* PROCESS TAB */}
              <TabsContent value="process">
                <ProcessSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* PROVINCES TAB */}
              <TabsContent value="provinces">
                <ProvincesSection
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              </TabsContent>

              {/* FAQ TAB */}
              <TabsContent value="faq">
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

function OverviewSection({
  containerVariants,
  itemVariants,
}: GuideSectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid md:grid-cols-2 gap-8"
    >
      {/* Why You Need It */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          Why You Need It
        </h2>

        <div className="grid gap-4">
          <Card className=" shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex gap-4">
              <div className="p-3 bg-blue-50 rounded-full h-fit">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  International Travel
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm mt-1">
                  Many countries (e.g., Egypt, Saudi Arabia) strictly require
                  proof of Polio vaccination for travelers from Pakistan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className=" shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex gap-4">
              <div className="p-3 bg-cyan-50 rounded-full h-fit">
                <FileCheck className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Official Documents
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm mt-1">
                  Some provincial services (like in KP) may link essential
                  certificates (Birth/Marriage) to polio proof.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Who Needs It */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Activity className="w-8 h-8 text-cyan-500" />
          Who Needs It?
        </h2>

        <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
          <CardContent className="p-6 space-y-6">
            <ul className="space-y-4">
              {[
                {
                  label: "Pakistani Citizens leaving the country",
                  sub: "Adults & Children",
                  icon: Globe,
                },
                {
                  label: "Long-term Foreign Residents",
                  sub: "Staying > 4 weeks",
                  icon: Calendar,
                },
                {
                  label: "Residents applying for Docs",
                  sub: "Specific provinces",
                  icon: FileCheck,
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <item.icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{item.label}</p>
                    <p className="text-slate-400 text-sm">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-sm text-cyan-300 font-medium">
              <AlertCircle className="w-5 h-5" />
              Valid for ~1 Year after issuance.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function ProcessSection({
  containerVariants,
  itemVariants,
}: GuideSectionProps) {
  const steps: StepItem[] = [
    {
      title: "Get Vaccinated",
      desc: "Visit a Govt Hospital, DHO, or Airport Counter. Receive bOPV (drops) or IPV (injection).",
      icon: Syringe,
      color: "blue",
    },
    {
      title: "NIMS Entry",
      desc: "Ensure health staff enter your data into NIMS. Crucial for online records.",
      icon: Activity,
      color: "cyan",
    },
    {
      title: "Download Online",
      desc: (
        <>
          Visit{" "}
          <a
            href="https://nims.nadra.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline hover:text-emerald-800"
          >
            nims.nadra.gov.pk
          </a>
          , enter CNIC/Passport, pay fee, and download.
        </>
      ),
      icon: Download,
      color: "emerald",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-12"
    >
      {/* Visual Timeline */}
      <div className="max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="relative pl-12 pb-12 last:pb-0 group"
          >
            {/* Connector Line */}
            {i !== steps.length - 1 && (
              <div className="absolute left-[22px] top-12 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-200 transition-colors" />
            )}

            {/* Number Bubble */}
            <div
              className={`
                absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xl font-bold z-10 transition-transform group-hover:scale-110
                bg-${step.color}-100 text-${step.color}-600
             `}
            >
              {i + 1}
            </div>

            {/* Content Card */}
            <Card className="ml-6 border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 md:flex justify-between items-center gap-6">
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold text-${step.color}-700`}>
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
                <div className="hidden md:block p-4 bg-slate-50 rounded-full">
                  <step.icon className={`w-8 h-8 text-${step.color}-500`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center text-white shadow-2xl"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl font-black">Ready to Download?</h3>
          <p className="text-blue-100 text-lg">
            Once vaccinated and registered, the certificate is instant. Cost is
            approx <strong className="text-white">Rs. 100</strong>.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="font-bold gap-2 text-blue-700 hover:text-blue-800"
            asChild
          >
            <a
              href="https://nims.nadra.gov.pk/nims/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit NIMS Portal <ChevronRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProvincesSection({
  containerVariants,
  //   itemVariants,
}: GuideSectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-slate-800">
            Where to Go?
          </CardTitle>
          <CardDescription className="text-lg">
            Vaccination availability by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="punjab" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-slate-100 p-1 rounded-xl mb-8">
              {["Punjab", "Sindh", "KP", "Balochistan", "Islamabad"].map(
                (prov) => (
                  <TabsTrigger
                    key={prov}
                    value={prov.toLowerCase()}
                    className="flex-1 min-w-[100px] py-2.5 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {prov}
                  </TabsTrigger>
                ),
              )}
            </TabsList>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[200px] flex flex-col justify-center">
              {/* Content mapping would ideally be dynamic, simplified here for layout */}
              <TabsContent value="punjab" className="mt-0">
                <LocationInfo
                  title="Punjab"
                  points={[
                    "Major Hospitals (DHQ/THQ)",
                    "District Health Offices",
                    "International Airports (Lahore, Islamabad, Multan)",
                  ]}
                />
              </TabsContent>
              <TabsContent value="sindh" className="mt-0">
                <LocationInfo
                  title="Sindh (Karachi)"
                  points={[
                    "Govt Hospitals (Jinnah, Civil)",
                    "DHO Offices (Nazimabad, South, Korangi)",
                    "NADRA-linked Mega Centers (Select)",
                  ]}
                />
              </TabsContent>
              <TabsContent value="kp" className="mt-0">
                <LocationInfo
                  title="Khyber Pakhtunkhwa"
                  points={[
                    "DHO Offices & EPI Centers",
                    "Govt Vaccination Units",
                    "Mandatory for some local docs",
                  ]}
                />
              </TabsContent>
              <TabsContent value="balochistan" className="mt-0">
                <LocationInfo
                  title="Balochistan"
                  points={[
                    "DHO Offices (Quetta)",
                    "Provincial EPI Headquarters",
                    "Availability may vary - check locally",
                  ]}
                />
              </TabsContent>
              <TabsContent value="islamabad" className="mt-0">
                <LocationInfo
                  title="Islamabad (ICT)"
                  points={[
                    "NIH (National Institute of Health)",
                    "PIMS Hospital",
                    "Polyclinic Hospital",
                  ]}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LocationInfo({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {points.map((p, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-slate-700 font-medium">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQSection({ containerVariants, itemVariants }: GuideSectionProps) {
  const faqs = [
    {
      q: "Can I get a certificate without vaccination?",
      a: "No. The certificate is issued only after valid vaccination data is entered into NIMS by authorized health workers.",
    },
    {
      q: "Do private hospitals provide this?",
      a: "They can administer the vaccine, but ONLY government or recognized EPI teams can record it in NIMS. Ensure they have NIMS access.",
    },
    {
      q: "What if I lose my certificate?",
      a: "Simply visit the NIMS portal again. Since your data is online, you can re-download/re-print it anytime.",
    },
    {
      q: "Data missing on NIMS?",
      a: "Go back to the center where you were vaccinated with your passport/CNIC and ask them to upload the data.",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-3xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Common Questions
        </h2>
        <p className="text-slate-500">
          Everything you need to know about the process
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-white border border-slate-200 rounded-xl px-4 shadow-sm"
            >
              <AccordionTrigger className="font-bold text-slate-800 hover:text-blue-600 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start"
      >
        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-blue-900 text-lg">Pro Tip</h4>
          <p className="text-blue-800 text-sm mt-1 leading-relaxed">
            Always verify your NIMS record <strong>before</strong> leaving the
            vaccination center. Ask the staff to show you the entry confirmation
            on their tab/system.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
