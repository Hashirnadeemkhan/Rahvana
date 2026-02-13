"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Baby,
  FileText,
  MapPin,
  HelpCircle,
  CheckSquare,
  ChevronRight,
  ExternalLink,
  Info,
  Building2,
  Smartphone,
  CreditCard,
  FileCheck,
  Globe,
  Home,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BirthCertificateGuide() {
  const [activeStep, setActiveStep] = useState(1);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
            <Baby className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Pakistan <span className="text-teal-600">Birth Certificate</span>{" "}
            Guide
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A complete, step-by-step updated guide (2026) for obtaining your
            official birth records. Navigate through the latest procedures for
            NADRA CRCs and Union Council registration.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge
              variant="secondary"
              className="px-4 py-1 text-sm bg-teal-50 text-teal-700 border-teal-200"
            >
              Updated 2026
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200"
            >
              PakID App Compatible
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-1 text-sm bg-purple-50 text-purple-700 border-purple-200"
            >
              Nationwide Coverage
            </Badge>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="process" className="w-full">
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <TabsList className="bg-white p-1.5 rounded-2xl shadow-lg border border-slate-100 h-auto inline-flex">
              {[
                { id: "process", icon: FileText, label: "Step-by-Step" },
                { id: "documents", icon: FileCheck, label: "Documents" },
                { id: "provinces", icon: MapPin, label: "Provinces" },
                { id: "faq", icon: HelpCircle, label: "FAQs & Cases" },
                { id: "summary", icon: CheckSquare, label: "Checklist" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-8">
            <div className="grid md:grid-cols-12 gap-8">
              {/* Sidebar Navigation for Steps */}
              <div className="md:col-span-4 lg:col-span-3 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 px-2">
                  Navigation
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={activeStep === 1 ? "default" : "ghost"}
                    className={`w-full justify-start text-left font-bold ${activeStep === 1 ? "bg-teal-600 hover:bg-teal-700 shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setActiveStep(1)}
                  >
                    1. Union Council Registration
                  </Button>
                  <Button
                    variant={activeStep === 2 ? "default" : "ghost"}
                    className={`w-full justify-start text-left font-bold ${activeStep === 2 ? "bg-teal-600 hover:bg-teal-700 shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setActiveStep(2)}
                  >
                    2. NADRA CRC (B-Form)
                  </Button>
                  <Button
                    variant={activeStep === 3 ? "default" : "ghost"}
                    className={`w-full justify-start text-left font-bold ${activeStep === 3 ? "bg-teal-600 hover:bg-teal-700 shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setActiveStep(3)}
                  >
                    3. Online Option (PakID)
                  </Button>
                </div>

                <Card className="bg-indigo-50 border-indigo-100 shadow-sm mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Important Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-indigo-700 leading-relaxed">
                    NADRA itself does not directly issue the initial birth
                    certificate — that must first be registered with the local
                    authority (Union Council).
                  </CardContent>
                </Card>
              </div>

              {/* Step Content */}
              <div className="md:col-span-8 lg:col-span-9">
                <AnimatePresence mode="wait">
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="h-2 bg-teal-500 w-full" />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge className="mb-2 bg-teal-100 text-teal-700 hover:bg-teal-200 border-none">
                                Step 1
                              </Badge>
                              <CardTitle className="text-2xl font-bold text-slate-900">
                                Union Council Registration
                              </CardTitle>
                              <CardDescription>
                                Mandatory first step before NADRA records
                              </CardDescription>
                            </div>
                            <Building2 className="w-12 h-12 text-teal-100" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-teal-500" />{" "}
                                Where to Go
                              </h4>
                              <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                  Your local Union Council (UC)
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                  Cantonment Board Office (Cantt areas)
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                  CDA Office (Islamabad residents)
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                  TMA Office (Some smaller towns)
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-teal-500" />{" "}
                                What to Bring
                              </h4>
                              <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                  <CheckSquare className="w-4 h-4 text-green-500 shrink-0" />
                                  Hospital birth notification slip
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckSquare className="w-4 h-4 text-green-500 shrink-0" />
                                  Parents&apos; CNIC/NICOP copies
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckSquare className="w-4 h-4 text-green-500 shrink-0" />
                                  Proof of residence (Bill/Rent agreement)
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                              <Home className="w-4 h-4" /> Home Births
                            </h4>
                            <p className="text-sm text-amber-700">
                              If born at home, provide a notarized affidavit
                              from parents and CNICs of two witnesses instead of
                              a hospital slip.
                            </p>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={() => setActiveStep(2)}
                              className="gap-2 font-bold group"
                            >
                              Next: NADRA Registration{" "}
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="h-2 bg-blue-500 w-full" />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                Step 2
                              </Badge>
                              <CardTitle className="text-2xl font-bold text-slate-900">
                                NADRA Processing (CRC)
                              </CardTitle>
                              <CardDescription>
                                Getting the computerized record (B-Form)
                              </CardDescription>
                            </div>
                            <Building2 className="w-12 h-12 text-blue-100" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-slate-600">
                            Once you have the UC slip, visit any NADRA
                            Registration Center (NRC) to get the official Child
                            Registration Certificate (CRC/B-Form).
                          </p>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-slate-50 border-slate-100">
                              <CardContent className="p-4 space-y-2">
                                <h4 className="font-bold text-slate-800">
                                  What Happens
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Officials verify the UC record in the central
                                  database and capture data.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-slate-50 border-slate-100">
                              <CardContent className="p-4 space-y-2">
                                <h4 className="font-bold text-slate-800">
                                  What You Get
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Either a CRC (B-Form) with identity number OR
                                  a computerized birth certificate.
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-blue-500" />{" "}
                              Fees & Timelines
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="block text-slate-500 text-xs mb-1">
                                  Fee (Normal)
                                </span>
                                <span className="font-bold text-slate-900">
                                  ~ Rs. 50 – 200
                                </span>
                              </div>
                              <div>
                                <span className="block text-slate-500 text-xs mb-1">
                                  Fee (Executive)
                                </span>
                                <span className="font-bold text-slate-900">
                                  ~ Rs. 500 – 700
                                </span>
                              </div>
                              <div>
                                <span className="block text-slate-500 text-xs mb-1">
                                  Time (Start)
                                </span>
                                <span className="font-bold text-slate-900">
                                  Same Day (Urgent)
                                </span>
                              </div>
                              <div>
                                <span className="block text-slate-500 text-xs mb-1">
                                  Time (Normal)
                                </span>
                                <span className="font-bold text-slate-900">
                                  3 – 7 Days
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              variant="ghost"
                              onClick={() => setActiveStep(1)}
                              className="text-slate-500"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={() => setActiveStep(3)}
                              className="gap-2 font-bold group"
                            >
                              Next: Online Options{" "}
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="h-2 bg-green-500 w-full" />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge className="mb-2 bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                Step 3
                              </Badge>
                              <CardTitle className="text-2xl font-bold text-slate-900">
                                PakID Mobile App
                              </CardTitle>
                              <CardDescription>
                                Digital registration options (Limited
                                Availability)
                              </CardDescription>
                            </div>
                            <Smartphone className="w-12 h-12 text-green-100" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                            <Globe className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                              <h4 className="font-bold text-green-800 text-sm">
                                Expanding Service
                              </h4>
                              <p className="text-sm text-green-700">
                                This service is currently expanding, with
                                primary availability in Punjab and selected
                                districts. Always check the app for your
                                specific area.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-bold text-slate-800">
                              How it Works
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {[
                                "Download PakID App (Android/iOS)",
                                "Register Account & Login",
                                "Select 'Birth Registration'",
                                "Upload Documents (UC slip, parents' CNIC)",
                                "Submit & Track Application",
                                "Download Digital Certificate",
                              ].map((step, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                                >
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                    {i + 1}
                                  </span>
                                  <span className="text-sm font-medium text-slate-700">
                                    {step}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              variant="ghost"
                              onClick={() => setActiveStep(2)}
                              className="text-slate-500"
                            >
                              Back
                            </Button>
                            <Button variant="outline" className="gap-2" asChild>
                              <a
                                href="https://id.nadra.gov.pk/e-id/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit PakID Website{" "}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-none shadow-xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Required Documents
                </CardTitle>
                <CardDescription>
                  Checklist for both stages of the process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                      <h3 className="font-bold text-teal-900 text-lg mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5" /> For Union Council
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Child’s hospital birth slip (Original + Copy)",
                          "Parents’ CNIC/NICOP copies",
                          "Grandparents' CNIC copies (sometimes required)",
                          "Proof of Residence (Utility Bill/Rent Agreement)",
                          "Affidavit (if home birth, notarized)",
                          "Passport copies (if applicable)",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-teal-800"
                          >
                            <CheckSquare className="w-4 h-4 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <h3 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5" /> For NADRA / CRC
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Union Council Acknowledgment Slip / Certificate",
                          "Parents’ Original CNIC/NICOP + Copies",
                          "Child’s Photo (Required for some age groups)",
                          "Application Fee Payment Receipt",
                          "Presence of one applicant parent (bio-metric)",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-blue-800"
                          >
                            <CheckSquare className="w-4 h-4 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center text-slate-600 text-sm">
                  <Info className="w-4 h-4 inline-block mr-2 mb-0.5" />
                  <strong>Pro Tip:</strong> Always carry a set of photocopies
                  and the original documents. Keep digital scans on your phone.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Provinces Tab */}
          <TabsContent value="provinces">
            <Card className="border-none shadow-xl shadow-slate-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">
                  Provincial Differences
                </CardTitle>
                <CardDescription>
                  Select your province to see specific rules, fees, and
                  procedures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="punjab" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 mb-6 bg-slate-100/50 rounded-xl">
                    <TabsTrigger
                      value="punjab"
                      className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold data-[state=active]:text-green-700"
                    >
                      Punjab
                    </TabsTrigger>
                    <TabsTrigger
                      value="sindh"
                      className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold data-[state=active]:text-indigo-700"
                    >
                      Sindh
                    </TabsTrigger>
                    <TabsTrigger
                      value="kp"
                      className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold data-[state=active]:text-emerald-700"
                    >
                      Khyber Pakhtunkhwa
                    </TabsTrigger>
                    <TabsTrigger
                      value="balochistan"
                      className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold data-[state=active]:text-orange-700"
                    >
                      Balochistan & Others
                    </TabsTrigger>
                  </TabsList>

                  {/* Punjab Content */}
                  <TabsContent value="punjab" className="space-y-4">
                    <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                          P
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            Punjab
                          </h3>
                          <Badge className="bg-green-200 text-green-800 hover:bg-green-300 border-none">
                            Highly Digital
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-green-600" />{" "}
                            The Process
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                              1. <strong>Hospital Births:</strong> Many major
                              hospitals in Punjab now have counters to issue
                              birth slips immediately.
                            </li>
                            <li className="flex items-start gap-2">
                              2. <strong>Union Council:</strong> Visit your
                              local UC with the hospital slip and parents&apos;
                              CNICs.
                            </li>
                            <li className="flex items-start gap-2">
                              3. <strong>Digital Option:</strong> The
                              &apos;PakID&apos; app pilot is most active here,
                              allowing direct digital application in selected
                              districts.
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-green-600" />{" "}
                            Fees & Policies
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                            <div className="flex justify-between items-center border-b border-green-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Registration Fee
                              </span>
                              <span className="font-bold text-green-700">
                                FREE
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-green-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Late Registration
                              </span>
                              <span className="font-bold text-slate-700">
                                Minimal Penalty
                              </span>
                            </div>
                            <div className="text-xs text-green-600 mt-2">
                              *Punjab leads in &apos;Digital Birth
                              Registration&apos; initiatives.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Sindh Content */}
                  <TabsContent value="sindh" className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                          S
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            Sindh
                          </h3>
                          <Badge className="bg-indigo-200 text-indigo-800 hover:bg-indigo-300 border-none">
                            Fee Waived
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-indigo-600" />{" "}
                            The Process
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                              1. <strong>Collection:</strong> Collect the birth
                              slip from the hospital or affidavit for home
                              births.
                            </li>
                            <li className="flex items-start gap-2">
                              2. <strong>Submission:</strong> Submit documents
                              to the Secretary of the Union Council (or Town
                              Committee).
                            </li>
                            <li className="flex items-start gap-2">
                              3. <strong>CRMS:</strong> Sindh uses the Civil
                              Registration Management System (CRMS) linked with
                              NADRA.
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-indigo-600" />{" "}
                            Fees & Policies
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                            <div className="flex justify-between items-center border-b border-indigo-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Registration Fee
                              </span>
                              <span className="font-bold text-green-600">
                                FREE (Govt Policy)
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-indigo-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Processing Time
                              </span>
                              <span className="font-bold text-slate-700">
                                3-7 Days
                              </span>
                            </div>
                            <div className="text-xs text-indigo-600 mt-2">
                              *Efforts are ongoing to ensure 100% free
                              registration across all districts.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* KP Content */}
                  <TabsContent value="kp" className="space-y-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                          K
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            Khyber Pakhtunkhwa
                          </h3>
                          <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-300 border-none">
                            Integrated
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-emerald-600" />{" "}
                            The Process
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                              1. <strong>Local Government:</strong> Process is
                              managed by the Local Government & Rural
                              Development Department (LG&RDD).
                            </li>
                            <li className="flex items-start gap-2">
                              2. <strong>Village Council:</strong> Visit your
                              Village or Neighborhood Council Secretary.
                            </li>
                            <li className="flex items-start gap-2">
                              3. <strong>Integration:</strong> KP has deeply
                              integrated local councils with NADRA&apos;s
                              database for faster B-Form issuance.
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-600" />{" "}
                            Fees & Policies
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                            <div className="flex justify-between items-center border-b border-emerald-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Standard Fee
                              </span>
                              <span className="font-bold text-slate-900">
                                ~ Rs. 100
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-emerald-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Late Fee
                              </span>
                              <span className="font-bold text-slate-700">
                                Varies by District
                              </span>
                            </div>
                            <div className="text-xs text-emerald-600 mt-2">
                              *Generally efficient due to local council
                              integration.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Balochistan & Others Content */}
                  <TabsContent value="balochistan" className="space-y-4">
                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold">
                          B
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            Balochistan, GB, AJK & ICT
                          </h3>
                          <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300 border-none">
                            Standard Federal
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-orange-600" />{" "}
                            The Process
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                              1. <strong>Islamabad (ICT):</strong> Residents
                              must go to the Capital Development Authority (CDA)
                              Facilitation Center or relevant UC.
                            </li>
                            <li className="flex items-start gap-2">
                              2. <strong>Balochistan/GB/AJK:</strong> Strictly
                              follow the User Council/Municipal Committee route.
                              Manual submission is still more common than visual
                              app usage in remote areas.
                            </li>
                            <li className="flex items-start gap-2">
                              3. <strong>NADRA Visit:</strong> Getting the UC
                              certificate is the primary step, followed by the
                              standard NADRA center visit.
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-orange-600" />{" "}
                            Fees & Policies
                          </h4>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                            <div className="flex justify-between items-center border-b border-orange-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Registration Fee
                              </span>
                              <span className="font-bold text-slate-900">
                                Standard (Rs. 100-300)
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-orange-50 pb-2 mb-2">
                              <span className="text-sm text-slate-500">
                                Accessibility
                              </span>
                              <span className="font-bold text-slate-700">
                                In-Person Preferred
                              </span>
                            </div>
                            <div className="text-xs text-orange-600 mt-2">
                              *Online services are less prevalent; physical
                              visits are recommended.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faq">
            <Card className="border-none shadow-xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Special Cases & FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "What if the birth occurred at home?",
                      answer:
                        "You must provide a sworn affidavit from a notary public along with the CNIC copies of at least two adult witnesses confirming the birth details.",
                    },
                    {
                      question: "How to correct a name spelling mistake?",
                      answer:
                        "Corrections can be lengthy. You must visit the UC for the initial correction, providing proof (like educational certs if older), then update the record at NADRA.",
                    },
                    {
                      question: "Can I get a certificate for an adult?",
                      answer:
                        "Yes. If the original is lost, you effectively apply for a duplicate or late entry. You will need your CNIC and parents' CNIC copies. The process usually involves verification from the UC first.",
                    },
                    {
                      question: "I am an Overseas Pakistani, how do I apply?",
                      answer:
                        "You can try the PakID mobile app for online services. Alternatively, birth registration can often be facilitated through the nearest Pakistan Embassy or Consulate (Form S-1).",
                    },
                    {
                      question: "Is the 'Old' manual certificate still valid?",
                      answer:
                        "For most official purposes (Passport, CNIC, Schools), the computerized NADRA CRC (B-Form) or Certificate is now required. It is highly recommended to digitize your record.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b-slate-100"
                    >
                      <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-teal-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Checklist Tab */}
          <TabsContent value="summary">
            <Card className="border-none bg-slate-900 text-white shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl font-black mb-6">
                    Quick Summary Checklist
                  </h2>

                  <div className="grid gap-4 text-left max-w-xl mx-auto">
                    {[
                      "Collect Hospital Slip & Parents' CNICs",
                      "Visit Local Union Council for Registration",
                      "Receive UC Birth Acknowledgment",
                      "Visit NADRA Center or use PakID App",
                      "Verify Details (Name Spellings/Dates)",
                      "Pay Fee & Collect CRC/Certificate",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-default"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="font-semibold text-lg">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* <div className="pt-8">
                    <Button
                      size="lg"
                      className="bg-teal-500 hover:bg-teal-400 text-white border-none font-bold rounded-full px-8 shadow-lg shadow-teal-500/30"
                    >
                      Ready to Start?
                    </Button>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
