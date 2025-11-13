"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePDFStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, X, Type } from "lucide-react";
import Image from "next/image";
import { loadPDF, addTextToPDF, addImageToPDF, downloadPDF } from "@/lib/pdf-utils";
import SignatureTool from "./signature-tool/SignatureTool";

const PDFViewer = dynamic(() => import("./pdf-viewer").then(m => m.PDFViewer), { ssr: false });
const PDFThumbnails = dynamic(() => import("./pdf-thumbnails").then(m => m.PDFThumbnails), { ssr: false });

export function PDFEditor() {
  const [activeTool, setActiveTool] = useState<"text" | "signature" | null>(null);
  const [inputText, setInputText] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSignatureFloating, setIsSignatureFloating] = useState(false); // New state for floating signature

  const { 
    pdfFile,
    annotations, 
    signatureAnnotations, 
    reset 
  } = usePDFStore();

  // Handle signature creation
  const handleSignature = (sig: string) => {
    setSignature(sig);
    setActiveTool("signature");
    setIsSignatureFloating(true); // Enable floating mode when signature is created
  };

  const handleDownload = async () => {
    if (!pdfFile) {
      alert("No PDF file loaded");
      return;
    }

    if (signatureAnnotations.length === 0 && annotations.length === 0) {
      alert("Please add at least one signature or text annotation");
      return;
    }

    setIsDownloading(true);

    try {
      const pdfDoc = await loadPDF(pdfFile);
      
      if (!pdfDoc || !pdfDoc.getPages) {
        throw new Error("Failed to load PDF document properly");
      }

      // Add text annotations
      for (const annotation of annotations) {
        await addTextToPDF(
          pdfDoc,
          annotation.pageIndex,
          annotation.text,
          annotation.x,
          annotation.y,
          annotation.fontSize,
          annotation.color
        );
      }

      // Add signature annotations
      for (const sig of signatureAnnotations) {
        await addImageToPDF(
          pdfDoc,
          sig.pageIndex,
          sig.image,
          sig.x,
          sig.y,
          sig.width,
          sig.height,
          sig.rotation || 0
        );
      }
      
      await downloadPDF(pdfDoc, "signed-document.pdf");
      alert("✅ PDF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      alert(`❌ Failed to download PDF: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📄 PDF Editor Pro
        </h1>
        <div className="flex items-center gap-3">
          {/* Text Tool */}
          <Button
            onClick={() => {
              setActiveTool(activeTool === "text" ? null : "text");
              setIsSignatureFloating(false); // Disable floating signature when switching tools
            }}
            variant={activeTool === "text" ? "default" : "outline"}
            size="sm"
            className={`gap-2 h-9 transition-all ${
              activeTool === "text" 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                : "hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            <Type className="h-4 w-4" />
            {activeTool === "text" ? "✓ Text Mode Active" : "Add Text"}
          </Button>

          {/* Active Text Mode Indicator */}
          {activeTool === "text" && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-blue-700 font-medium">Click anywhere to add text</span>
            </div>
          )}

          {/* Signature Tool */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            {signature && (
              <div className="flex items-center gap-2 bg-white rounded-lg p-1.5 border border-gray-200">
                <Image 
                  height={32} 
                  width={60} 
                  src={signature} 
                  alt="Current signature" 
                  className="h-8 w-auto object-contain" 
                />
                <span className="text-xs text-green-600 font-semibold">✓ Active</span>
                <Button
                  onClick={() => {
                    setSignature(null);
                    setIsSignatureFloating(false); // Clear floating state
                    setActiveTool(null);
                  }}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-red-50"
                  aria-label="Remove signature"
                >
                  <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            )}
            <SignatureTool onSignature={handleSignature} />
          </div>

          {/* Download Button */}
          <Button 
            onClick={handleDownload}
            disabled={isDownloading || (signatureAnnotations.length === 0 && annotations.length === 0)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>

          {/* Close Button */}
          <Button onClick={reset} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails Sidebar */}
        <div className="w-32 border-r bg-white overflow-hidden shadow-sm">
          <PDFThumbnails />
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden relative">
          <PDFViewer
            activeTool={activeTool}
            inputText={inputText}
            setInputText={setInputText}
            signature={signature}
            isSignatureFloating={isSignatureFloating} // Pass floating state
            setIsSignatureFloating={setIsSignatureFloating} // Pass setter
          />
        </div>
      </div>
    </div>
  );
}