"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

/**
 * PDFConverter Component
 * - Handles text input and PDF generation
 * - Uses the /api/create-pdf endpoint to generate PDFs
 * - Supports real-time validation and error handling
 */
export function PDFConverter() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Validates and generates PDF from input text
  const handleDownloadPDF = async () => {
    // Validate input
    if (!text.trim()) {
      toast.error("Please enter some text to convert to PDF")
      return
    }

    if (text.length > 50000) {
      toast.error("Text exceeds maximum length of 50,000 characters")
      return
    }

    setIsLoading(true)

    try {
      // Call the API route to generate PDF
      const response = await fetch("/api/create-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate PDF")
      }

      // Get the PDF blob and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `document-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast.success("PDF downloaded successfully")
      setText("") // Clear textarea after success
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      toast.error(message)
      console.error("[PDF Converter Error]", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate character count for real-time feedback
  const charCount = text.length
  const maxChars = 50000
  const percentUsed = (charCount / maxChars) * 100

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Convert to PDF</h1>
        <p className="text-base text-muted-foreground">
          Enter your text below and generate a professional PDF document
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        {/* Textarea Input */}
        <div className="space-y-3 mb-6">
          <label htmlFor="text-input" className="block text-sm font-medium text-foreground">
            Your Text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your content here..."
            disabled={isLoading}
            className="w-full h-64 p-4 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Character Count */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{charCount.toLocaleString()} characters</span>
            <span>{maxChars.toLocaleString()} max</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${percentUsed > 90 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownloadPDF}
          disabled={isLoading || !text.trim()}
          size="lg"
          className="w-full font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-5 w-5" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">Instant</div>
          <p className="text-sm text-muted-foreground">Generated in seconds</p>
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">Secure</div>
          <p className="text-sm text-muted-foreground">Processed on server</p>
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">Free</div>
          <p className="text-sm text-muted-foreground">No limits or trials</p>
        </div>
      </div>
    </div>
  )
}
