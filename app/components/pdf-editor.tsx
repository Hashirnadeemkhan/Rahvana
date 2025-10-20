"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePDFStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, X, Type } from "lucide-react";
import { addTextToPDF, savePDF } from "@/lib/pdf-utils";

const PDFViewer = dynamic(() => import("./pdf-viewer").then(m => m.PDFViewer), { ssr: false });
const PDFThumbnails = dynamic(() => import("./pdf-thumbnails").then(m => m.PDFThumbnails), { ssr: false });

export function PDFEditor() {
  const [activeTool, setActiveTool] = useState<"text" | null>(null);
  const [inputText, setInputText] = useState(""); // 🆕 NEW: Text Input
  const { pdfDoc, annotations, reset } = usePDFStore();

const handleDownload = async () => {
  if (!pdfDoc) return;

  let modifiedPdf = pdfDoc;
  for (const annotation of annotations) {
    modifiedPdf = await addTextToPDF(
      modifiedPdf,
      annotation.pageIndex,
      annotation.text,
      annotation.x,
      annotation.y,
      12,
      "#000000"
    );
  }

  // ✅ SAFEST conversion for TypeScript
  const pdfBytes = await savePDF(modifiedPdf);
  const safeBuffer = new Uint8Array(pdfBytes).buffer;

  const blob = new Blob([safeBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "edited.pdf";
  link.click();

  URL.revokeObjectURL(url);
};



  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">PDF Editor</h1>
        <div className="flex items-center gap-3">
          {/* 🆕 SIMPLE TEXT TOOL */}
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <Button
              onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              className="gap-2 h-8"
            >
              <Type className="h-4 w-4" />
              {activeTool === "text" ? "Cancel" : "Text"}
            </Button>
            
            {/* 🆕 TEXT INPUT */}
            {activeTool === "text" && (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type text..."
                className="border border-gray-300 rounded px-3 py-1 w-32 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputText.trim()) {
                    // 🆕 Auto place text on click
                  }
                }}
              />
            )}
          </div>

          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={reset} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Finish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-32 border-r bg-white overflow-hidden">
          <PDFThumbnails />
        </div>
        <div className="flex-1 overflow-hidden relative">
          <PDFViewer 
            activeTool={activeTool} 
            inputText={inputText}  // 🆕 PASS TEXT
            setInputText={setInputText}
          />
        </div>
      </div>
    </div>
  );
}