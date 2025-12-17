"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Download, X, CheckCircle2 } from "lucide-react";

export default function PDFConverterApp() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      alert("File too large. Maximum size is 50MB");
      return;
    }

    setFile(selectedFile);
    setSuccess(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    setSuccess(false);

    try {
      const fileName = file.name.toLowerCase();
      let format: "text" | "html" | "markdown" | "image" | "docx" = "text";

      if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
        format = "html";
      } else if (fileName.endsWith(".md") || fileName.endsWith(".markdown")) {
        format = "markdown";
      } else if (/\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(fileName)) {
        format = "image";
      } else if (fileName.endsWith(".docx")) {
        format = "docx";
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", format);

      const response = await fetch("/api/convert-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `converted_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Conversion failed";
      alert(message);
    } finally {
      setConverting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            PDF Converter
          </h1>
          <p className="text-slate-600 text-lg">
            Upload any file and convert it to PDF instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Upload Area */}
          <div
            onClick={() => !converting && fileInputRef.current?.click()}
            className={`p-12 border-b border-slate-200 cursor-pointer transition-all ${
              !file && !converting ? "hover:bg-slate-50" : ""
            } ${converting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.html,.htm,.md,.markdown,.jpg,.jpeg,.png,.webp,.gif,.bmp,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={converting}
            />

            {!file ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                  <Upload className="w-10 h-10 text-primary/90" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Drop your file here
                </h3>
                <p className="text-slate-500 mb-4">
                  or click to browse
                </p>
                <p className="text-sm text-slate-400">
                  Supports: Text, HTML, Markdown, Images, Word (DOCX)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!converting && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setSuccess(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status Messages */}
          {converting && (
            <div className="px-12 py-6 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary/90 animate-spin" />
                <div>
                  <p className="font-medium text-blue-900">Converting to PDF...</p>
                  <p className="text-sm text-primary/90">This may take a moment</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="px-12 py-6 bg-green-50 border-b border-green-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">PDF downloaded successfully!</p>
                  <p className="text-sm text-green-700">Ready for next file</p>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <div className="p-8">
            <button
              onClick={handleConvert}
              disabled={!file || converting}
              className="w-full bg-primary/90 hover:bg-primary/100 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20 disabled:shadow-none"
            >
              {converting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Convert to PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          {["Fast", "Secure", "Free"].map((feature) => (
            <div key={feature} className="text-center">
              <div className="text-3xl font-bold text-primary/90 mb-1">{feature}</div>
              <p className="text-sm text-slate-600">
                {feature === "Fast" && "Instant conversion"}
                {feature === "Secure" && "Server-side processing"}
                {feature === "Free" && "No limits or signup"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}