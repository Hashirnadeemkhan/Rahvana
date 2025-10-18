"use client";

import { useEffect, useRef, useState } from "react";
import { usePDFStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

let pdfjsLib: any = null;

// 🧠 Initialize pdf.js (only once)
async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const pdfjs = await import("pdfjs-dist/build/pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjsLib = pdfjs;
  return pdfjs;
}

export function PDFViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null); // store PDF once
  const { currentPage, setCurrentPage, pdfFile, totalPages } = usePDFStore();

  // 📦 Load the PDF only once when file changes
  useEffect(() => {
    if (!pdfFile) return;

    const loadPdf = async () => {
      const pdfjs = await initPdfJs();
      const loadedPdf = await pdfjs.getDocument(await pdfFile.arrayBuffer()).promise;
      setPdfDoc(loadedPdf);
    };

    loadPdf();
  }, [pdfFile]);

  // 🖼️ Render a specific page when page/scale changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        setIsLoading(true);
        const page = await pdfDoc.getPage(currentPage + 1);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (isCancelled) return;
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("Error rendering PDF page:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    renderPage();

    // 🧹 Cancel ongoing render if component unmounts or dependencies change
    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale]);

  if (!pdfFile || totalPages === 0) return null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-3">
        {/* Page navigation */}
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

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <Button onClick={() => setScale(Math.max(0.5, scale - 0.2))} variant="ghost" size="sm">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium min-w-fit">{Math.round(scale * 100)}%</span>
          <Button onClick={() => setScale(Math.min(3, scale + 0.2))} variant="ghost" size="sm">
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-100 p-4">
        {isLoading && <div className="text-gray-500">Loading page...</div>}
        <canvas ref={canvasRef} className="shadow-lg bg-white" />
      </div>
    </div>
  );
}
