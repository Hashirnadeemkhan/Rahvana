"use client";

import { useState } from "react";

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length < 2) {
      alert("Please select at least two PDF files to merge.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setLoading(true);

    try {
      const res = await fetch("/api/merge", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to merge PDFs.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error merging PDFs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">📄 Combine PDFs</h1>
        <p className="text-center text-gray-600 mb-4">
          Upload <b>two or more</b> PDF files to merge them into one.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => setFiles(e.target.files)}
            className="border border-gray-300 rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Merging..." : "Merge PDFs"}
          </button>
        </form>

        {files && files.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <p className="font-semibold mb-1">Selected Files:</p>
            <ul className="list-disc pl-6">
              {Array.from(files).map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
