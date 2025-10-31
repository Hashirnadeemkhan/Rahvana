"use client"

import { Check, X } from "lucide-react"

interface PhotoExampleProps {
  example: {
    type: "good" | "bad"
    title: string
    description: string
    image: string
  }
}

export default function PhotoExample({ example }: PhotoExampleProps) {
  const isGood = example.type === "good"

  return (
    <div className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] bg-slate-800 overflow-hidden">
        <img src={example.image || "/placeholder.svg"} alt={example.title} className="w-full h-full object-cover" />
        {/* Badge */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${
            isGood ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isGood ? (
            <>
              <Check className="w-4 h-4" />
              Acceptable
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Not Acceptable
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-white mb-1">{example.title}</h4>
        <p className="text-slate-400 text-sm">{example.description}</p>
      </div>
    </div>
  )
}
