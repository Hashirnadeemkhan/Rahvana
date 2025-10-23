"use client";

import { useEffect, useRef, useState } from "react";
import { usePDFStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import DraggableText from "./DraggableText";
import DraggableSignature from "./signature-tool/DraggableSignature";

import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const pdfjs = await import("pdfjs-dist");
  // Using cdn worker path - ensure internet available or provide local worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjsLib = pdfjs;
  return pdfjs;
}

type Annotation = {
  id: string;
  pageIndex: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
};

type SignatureAnnotation = {
  id: string;
  pageIndex: number;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function PDFViewer({
  activeTool,
  inputText,
  setInputText,
  signature,
}: {
  activeTool: "text" | "signature" | null;
  inputText: string;
  setInputText: (text: string) => void;
  signature: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  const {
    currentPage,
    setCurrentPage,
    pdfFile,
    totalPages,
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    signatureAnnotations,
    addSignatureAnnotation,
    updateSignatureAnnotation,
    deleteSignatureAnnotation,
  } = usePDFStore();

  // Keep track of last auto-inserted signature dataURL to avoid duplicates
  const lastAutoSigRef = useRef<string | null>(null);

  // Load the PDF
  useEffect(() => {
    if (!pdfFile) return;

    const loadPdf = async () => {
      const pdfjs = await initPdfJs();
      const loadedPdf = await pdfjs.getDocument(await pdfFile.arrayBuffer()).promise as PDFDocumentProxy;
      setPdfDoc(loadedPdf);
    };

    loadPdf();
  }, [pdfFile]);

  // Render a specific page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: RenderTask | null = null;
    let cancelled = false;

    const renderPage = async () => {
      try {
        setIsLoading(true);
        const page: PDFPageProxy = await pdfDoc.getPage(currentPage + 1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        if (renderTask) renderTask.cancel();

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
      } catch (error) {
        if ((error as Error).name === "RenderingCancelledException") {
          console.warn("Render canceled (harmless).");
          return;
        }
        console.error("Error rendering PDF page:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, scale]);

  // Auto-insert signature when `signature` changes (and activeTool is signature)
  useEffect(() => {
    if (!signature || activeTool !== "signature" || !canvasRef.current) return;

    // Avoid re-adding the same data URL multiple times
    if (lastAutoSigRef.current === signature) return;

    const canvas = canvasRef.current;
    const pagePixelWidth = canvas.width;
    const pagePixelHeight = canvas.height;

    // Convert pixel dims to PDF coordinate space by dividing by current scale
    const pageWidth = pagePixelWidth / scale;
    const pageHeight = pagePixelHeight / scale;

    // Default signature size in PDF units
    const sigWidth = Math.min(200, pageWidth * 0.4); // at most 40% of page width or 200 PDF units
    const sigHeight = sigWidth * 0.4;

    // Place centered near bottom
    const x = (pageWidth - sigWidth) / 2;
    const y = pageHeight - sigHeight - 40;

    addSignatureAnnotation({
      id: Date.now().toString(),
      image: signature,
      x,
      y,
      width: sigWidth,
      height: sigHeight,
      pageIndex: currentPage,
    });

    lastAutoSigRef.current = signature;
  }, [signature, activeTool, currentPage, scale, addSignatureAnnotation]);

  // Handle click to place text or signature (manual placement)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (activeTool === "text" && inputText.trim()) {
      addAnnotation({
        id: Date.now().toString(),
        text: inputText,
        x,
        y,
        fontSize: 12,
        pageIndex: currentPage,
        color: "#000000",
      });
      setInputText("");
    } else if (activeTool === "signature" && signature) {
      // Manual placement also supported
      addSignatureAnnotation({
        id: Date.now().toString(),
        image: signature,
        x,
        y,
        width: 80,
        height: 40,
        pageIndex: currentPage,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium min-w-fit">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            variant="ghost"
            size="sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            variant="ghost"
            size="sm"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium min-w-fit">
            {Math.round(scale * 100)}%
          </span>
          <Button
            onClick={() => setScale(Math.min(3, scale + 0.2))}
            variant="ghost"
            size="sm"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* PDF + Overlay Container */}
      <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-100 p-4">
        {isLoading && <div className="text-gray-500">Loading page...</div>}

        <div className="relative" ref={overlayRef}>
          <canvas
            ref={canvasRef}
            className="shadow-lg bg-white z-0"
            style={{ display: "block" }}
          />

          <div
            className="absolute inset-0 z-10"
            style={{ pointerEvents: activeTool === "text" || activeTool === "signature" ? "auto" : "none" }}
            onClick={handleOverlayClick}
          >
            {annotations
              .filter((ann: Annotation) => ann.pageIndex === currentPage)
              .map((annotation: Annotation) => (
                <DraggableText
                  key={annotation.id}
                  data={annotation}
                  onUpdate={updateAnnotation}
                  onDelete={deleteAnnotation}
                  scale={scale}
                />
              ))}

            {signatureAnnotations
              .filter((sig: SignatureAnnotation) => sig.pageIndex === currentPage)
              .map((signature: SignatureAnnotation) => (
                <DraggableSignature
                  key={signature.id}
                  data={signature}
                  onUpdate={(id, patch) => updateSignatureAnnotation(id, patch)}
                  onDelete={deleteSignatureAnnotation}
                  scale={scale}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
