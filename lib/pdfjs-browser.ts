// src/lib/pdfjs-browser.ts
// ✅ Works in browser and Webpack (Next 15)

export async function loadPdfJs() {
  // Import the browser/ESM build of PDF.js
  const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");

  // ✅ Use official CDN worker to avoid local worker issues
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  return pdfjsLib;
}
