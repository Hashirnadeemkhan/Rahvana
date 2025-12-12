// app/pdf-processing/page.tsx (updated)

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePDFStore } from "@/lib/store";
// import { PDFMerge } from "../components/pdf/pdf-merge";
import PDFMergeAdvanced from "../components/pdf/pdf-merge";  // ← Naya component

const PDFUpload = dynamic(() => import("../components/pdf-upload").then(mod => mod.PDFUpload), { ssr: false });
const PDFEditor = dynamic(() => import("../components/pdf-editor").then(mod => mod.PDFEditor), { ssr: false });

export default function PDFProcessingPage() {
  const { pdfFile, reset } = usePDFStore();
  const [activeTab, setActiveTab] = useState<"upload" | "merge">("upload");

  const handleCloseEditor = () => reset();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Full Screen Editor */}
      {pdfFile && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button
              onClick={handleCloseEditor}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              ← Back
            </button>
          </div>
          <div className="h-[calc(100vh-64px)] w-full">
            <PDFEditor />
          </div>
        </div>
      )}

      {/* Normal UI */}
      {!pdfFile && (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-8 bg-white shadow-md rounded-full p-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                activeTab === "upload" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Edit PDF
            </button>
            <button
              onClick={() => setActiveTab("merge")}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                activeTab === "merge" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Merge PDFs
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 min-h-[60vh]">
              <PDFUpload />
            </div>
          )}

          {/* Merge Tab */}
          {activeTab === "merge" && <PDFMergeAdvanced />}
        </>
      )}
    </main>
  );
}