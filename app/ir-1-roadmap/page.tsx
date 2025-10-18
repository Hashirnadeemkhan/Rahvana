"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowDown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IR1RoadmapPage() {
  return (
    <section className="container mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
          IR-1 Road Map
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow each step carefully to complete your IR-1 visa process efficiently.  
          This roadmap visually guides you from start to finish.
        </p>
      </div>

      {/* Roadmap */}
      <div className="flex flex-col items-center gap-16">
        {/* Row 1 (→ direction) */}
        <div className="flex justify-center items-center gap-6">
          <Step label="Step 1" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 2" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 3" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 4" />
        </div>

        {/* ↓ under Step 4 */}
        <div className="flex justify-center w-full">
          <div className="flex justify-end w-[640px]">
            <ArrowDown className="text-blue-500 w-7 h-7" />
          </div>
        </div>

        {/* Row 2 (← direction) */}
        <div className="flex justify-center items-center gap-6 flex-row-reverse">
          <Step label="Step 5" />
          <ArrowLeft className="text-blue-500 w-6 h-6" />
          <Step label="Step 6" />
          <ArrowLeft className="text-blue-500 w-6 h-6" />
          <Step label="Step 7" />
          <ArrowLeft className="text-blue-500 w-6 h-6" />
          <Step label="Step 8" />
        </div>

        {/* ↓ under Step 5 */}
        <div className="flex justify-center w-full">
          <div className="flex justify-start w-[640px]">
            <ArrowDown className="text-blue-500 w-7 h-7" />
          </div>
        </div>

        {/* Row 3 (→ direction) */}
        <div className="flex justify-center items-center gap-6">
          <Step label="Step 9" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 10" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 11" />
          <ArrowRight className="text-blue-500 w-6 h-6" />
          <Step label="Step 12" />
        </div>
      </div>

      {/* Back button */}
      <div className="text-center mt-16">
        <Link href="/#ir-category">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md">
            Back to IR Category
          </Button>
        </Link>
      </div>
    </section>
  )
}

/* Reusable Step component */
function Step({ label }: { label: string }) {
  return (
    <Card className="min-w-[120px] bg-white border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center">
      <CardContent className="py-4 px-2 text-center font-medium text-blue-700">
        {label}
      </CardContent>
    </Card>
  )
}
