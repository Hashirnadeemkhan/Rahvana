"use client"

import type React from "react"
import { useState, useRef } from "react"
import { usePDFStore } from "@/lib/store"
import { loadPDF } from "@/lib/pdf-utils"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

let pdfjsLib: any = null

async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  pdfjsLib = pdfjs
  return pdfjs
}

export function PDFUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setPdfFile, setPdfDoc, setTotalPages } = usePDFStore()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    try {
      const pdfDoc = await loadPDF(file)

      const pdfjs = await initPdfJs()
      const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise

      setPdfFile(file)
      setPdfDoc(pdfDoc)
      setTotalPages(pdf.numPages)
    } catch (error) {
      console.error("Error loading PDF:", error)
      setError("Error loading PDF file. Please try another file.")
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type === "application/pdf") {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files
        const event = new Event("change", { bubbles: true })
        fileInputRef.current.dispatchEvent(event)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-12"
    >
      <div className="rounded-full bg-blue-100 p-4">
        <Upload className="h-8 w-8 text-blue-600" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">Upload PDF</h3>
        <p className="mt-2 text-gray-600">Drag and drop your PDF here or click to browse</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />
      <Button onClick={handleButtonClick} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        {loading ? "Loading..." : "Choose File"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
