"use client";

import dynamic from "next/dynamic";
import { usePDFStore } from "@/lib/store";

// ⚙️ Dynamically import components with SSR disabled
const PDFUpload = dynamic(() => import("../components/pdf-upload").then(mod => mod.PDFUpload), { ssr: false });
const PDFEditor = dynamic(() => import("../components/pdf-editor").then(mod => mod.PDFEditor), { ssr: false });

export default function Home() {
  const { pdfDoc } = usePDFStore();

  return (
    <main className="h-screen bg-gray-50">
      {!pdfDoc ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl">
            <PDFUpload />
          </div>
        </div>
      ) : (
        <PDFEditor />
      )}
    </main>
  );
}
