"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePDFStore } from "@/lib/store";

// Dynamically import editor/upload with SSR disabled
const PDFUpload = dynamic(() => import("../components/pdf-upload").then(mod => mod.PDFUpload), { ssr: false });
const PDFEditor = dynamic(() => import("../components/pdf-editor").then(mod => mod.PDFEditor), { ssr: false });

export default function PDFProcessingPage() {
  const { pdfDoc, setPdfDoc } = usePDFStore();
  const [activeTab, setActiveTab] = useState<"upload" | "merge">("upload");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Merge PDFs
  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length < 2) {
      alert("Please select at least two PDF files to merge.");
      return;
    }
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("files", file));
    setLoading(true);
    try {
      const res = await fetch("/api/merge", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to merge PDFs.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs.");
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type === "application/pdf");
    setFiles(prev => {
      const existing = prev ? Array.from(prev) : [];
      const merged = [...existing, ...droppedFiles.filter(f => !existing.find(e => e.name === f.name))];
      const dt = new DataTransfer();
      merged.forEach(f => dt.items.add(f));
      return dt.files;
    });
  };

  // Manual File Input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files);
      setFiles(prev => {
        const existing = prev ? Array.from(prev) : [];
        const newOnes = incoming;
        const merged = [...existing, ...newOnes.filter(f => !existing.find(e => e.name === f.name))];
        const dt = new DataTransfer();
        merged.forEach(f => dt.items.add(f));
        return dt.files;
      });
    }
  };

  // Close Editor
  const handleCloseEditor = () => {
    setPdfDoc(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* ===== FULL SCREEN PDF EDITOR ===== */}
      {pdfDoc && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button
              onClick={handleCloseEditor}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Back
            </button>
          </div>
          <div className="h-[calc(100vh-64px)] w-full">
            <PDFEditor />
          </div>
        </div>
      )}

      {/* ===== NORMAL UI ===== */}
      {!pdfDoc && (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-6 bg-white shadow-md rounded-full p-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeTab === "upload" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upload / Edit PDF
            </button>
            <button
              onClick={() => setActiveTab("merge")}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeTab === "merge" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Merge PDFs
            </button>
          </div>

          {/* Upload Section */}
          {activeTab === "upload" && (
            <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6 min-h-[60vh]">
              <PDFUpload />
            </div>
          )}

          {/* Merge Section */}
          {activeTab === "merge" && (
            <div
              className={`bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border-2 border-dashed transition ${
                isDragging ? "border-primary bg-primary/5" : "border-gray-300"
              }`}
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <h2 className="text-2xl font-bold text-center mb-4 text-primary">Merge PDFs</h2>
              <p className="text-center text-gray-600 mb-6">
                Drag & drop or upload <b>two or more</b> PDF files to merge them into one.
              </p>

              <form onSubmit={handleMerge} className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileInput}
                  className="border border-gray-300 rounded-lg p-2"
                />

                <button
                  type="submit"
                  disabled={loading || !files || files.length < 2}
                  className="bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "Merging..." : "Merge PDFs"}
                </button>
              </form>

              {files && files.length > 0 && (
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-semibold mb-1">Selected Files:</p>
                  <ul className="list-disc pl-6 max-h-32 overflow-y-auto">
                    {Array.from(files).map((file, i) => (
                      <li key={i}>{file.name}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setFiles(null)}
                    className="mt-3 text-sm text-red-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
