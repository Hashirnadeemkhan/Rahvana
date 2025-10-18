"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePDFStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { addTextToPDF, savePDF } from "@/lib/pdf-utils";

// ⚙️ Dynamically import child components
const PDFViewer = dynamic(() => import("./pdf-viewer").then((mod) => mod.PDFViewer), { ssr: false });
const PDFThumbnails = dynamic(() => import("./pdf-thumbnails").then((mod) => mod.PDFThumbnails), { ssr: false });
const EditToolbar = dynamic(() => import("./edit-toolbar").then((mod) => mod.EditToolbar), { ssr: false });


export function PDFEditor() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { pdfDoc, annotations, reset } = usePDFStore();

  const handleDownload = async () => {
    if (!pdfDoc) return;

    try {
      let modifiedPdf = pdfDoc;

      for (const annotation of annotations) {
        modifiedPdf = await addTextToPDF(
          modifiedPdf,
          annotation.pageIndex,
          annotation.text,
          annotation.x,
          annotation.y,
          annotation.fontSize,
          annotation.color
        );
      }

      const pdfBytes = await savePDF(modifiedPdf);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "edited-document.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">PDF Editor</h1>
        <div className="flex items-center gap-3">
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={reset} variant="outline" className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Finish
          </Button>
        </div>
      </div>

      <EditToolbar activeTool={activeTool} onToolChange={setActiveTool} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Thumbnails */}
        <div className="w-32 border-r bg-white overflow-hidden">
          <PDFThumbnails />
        </div>

        {/* Center - PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer />
        </div>

      
      
      </div>
    </div>
  );
}
