"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePDFStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, X, Type } from "lucide-react";
import Image from "next/image";
import { addTextToPDF, addImageToPDF, savePDF } from "@/lib/pdf-utils";
import SignatureTool from "./signature-tool/SignatureTool";


const PDFViewer = dynamic(() => import("./pdf-viewer").then(m => m.PDFViewer), { ssr: false });
const PDFThumbnails = dynamic(() => import("./pdf-thumbnails").then(m => m.PDFThumbnails), { ssr: false });

export function PDFEditor() {
  const [activeTool, setActiveTool] = useState<"text" | "signature" | null>(null);
  const [inputText, setInputText] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const { pdfDoc, annotations, signatureAnnotations, reset } = usePDFStore();

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
    for (const signature of signatureAnnotations) {
      modifiedPdf = await addImageToPDF(
        modifiedPdf,
        signature.pageIndex,
        signature.image,
        signature.x,
        signature.y,
        signature.width,
        signature.height
      );
    }

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
          {/* Text Tool */}
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
            {activeTool === "text" && (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type text..."
                className="border border-gray-300 rounded px-3 py-1 w-32 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputText.trim()) {
                    setActiveTool(null);
                  }
                }}
              />
            )}
          </div>
          {/* Signature Tool */}
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <Button
              onClick={() => setActiveTool(activeTool === "signature" ? null : "signature")}
              variant={activeTool === "signature" ? "default" : "outline"}
              size="sm"
              className="gap-2 h-8"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              {activeTool === "signature" ? "Cancel" : "Sign"}
            </Button>
            {signature && (
              <div className="flex items-center gap-2">
                <Image height={10} width={10} src={signature} alt="Signature" className="h-8 w-auto border rounded" />
                <Button
                  onClick={() => setSignature(null)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  aria-label="Delete signature"
                >
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            )}
            <SignatureTool onSignature={setSignature} />
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
            inputText={inputText}
            setInputText={setInputText}
            signature={signature}
          />
        </div>
      </div>
    </div>
  );
}