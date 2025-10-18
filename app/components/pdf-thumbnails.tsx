"use client";

import { useEffect, useState } from "react";
import { usePDFStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";

let pdfjsLib: any = null;

async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const pdfjs = await import("pdfjs-dist/build/pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjsLib = pdfjs;
  return pdfjs;
}

export function PDFThumbnails() {
  const { currentPage, setCurrentPage, pdfFile, totalPages } = usePDFStore();
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pdfFile || totalPages === 0) return;

    const generateThumbnails = async () => {
      try {
        setIsLoading(true);
        const pdfjs = await initPdfJs();
        const pdf = await pdfjs.getDocument(await pdfFile.arrayBuffer()).promise;
        const thumbs: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          thumbs.push(canvas.toDataURL());
        }

        setThumbnails(thumbs);
      } catch (error) {
        console.error("Error generating thumbnails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnails();
  }, [pdfFile, totalPages]);

  if (!pdfFile || totalPages === 0 || thumbnails.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 bg-white border-r p-3 overflow-y-auto h-full">
      {thumbnails.map((thumb, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index)}
          className={cn(
            "relative rounded border-2 overflow-hidden transition-all hover:border-blue-400",
            currentPage === index ? "border-blue-600 shadow-md" : "border-gray-200"
          )}
        >
          <Image src={thumb || "/placeholder.svg"} alt={`Page ${index + 1}`} className="w-full" width={120} height={160} />
          <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
