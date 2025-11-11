"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle, Download, CheckCircle, X } from "lucide-react";

// **Yahan Par Change Kiya Gaya Hai**
// NEXT_PUBLIC_API_URL ko check karein. Agar woh maujood nahi hai (jaise local development mein),
// toh hardcoded local URL ko fallback ke taur par istemal karein.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function PassportPhoto() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form
  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type
    if (!selected.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    // Validate file size (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setError("Image size must be under 10 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  // Process image with background removal
  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    // API_BASE ab ya toh deployed URL hoga ya localhost URL.
    const API_ENDPOINT = `${API_BASE}/remove-bg`;
    console.log(`Calling API: ${API_ENDPOINT}`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error (${res.status}): ${errorText.substring(0, 100)}...`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An unknown error occurred. API Base: ${API_BASE}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
          Passport Photo Maker
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Upload your photo → Get a compliant passport photo with clean white background
        </p>
      </header>

      {/* Official Guidelines */}
      <section className="w-full max-w-4xl mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-600 mb-6">
          <AlertCircle className="w-6 h-6" />
          Official Passport Photo Requirements
        </h2>

        <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
          {[
            "Submit one color photo",
            "Photo taken in the last 6 months",
            "Clear image of your full face",
            "No editing, filters, or AI alterations",
            "Face the camera straight, no head tilt",
            "Remove eyeglasses",
            "Plain white or off-white background – no shadows, textures, or lines",
          ].map((req, i) => (
            <li key={i} className="flex items-start gap-3 md:col-span-1">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>{i + 1}.</strong> {req}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Upload Section */}
      <section className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Your Photo
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${preview ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg shadow"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="w-10 h-10 mb-2" />
                <p className="text-sm">Click to upload or drag & drop</p>
                <p className="text-xs mt-1">JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>

          {preview && (
            <button
              onClick={reset}
              className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
            >
              <X className="w-4 h-4" /> Remove Photo
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={!file || loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2
            ${
              !file || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
        >
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Generate Passport Photo
            </>
          )}
        </button>
      </section>

      {/* Result */}
      {result && (
        <section className="mt-12 w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-xl font-semibold text-green-600 mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Photo Ready!
            </p>
            <div className="flex justify-center">
              <img
                src={result}
                alt="Passport photo result"
                className="w-64 h-64 object-cover rounded-lg shadow-xl border-4 border-white"
              />
            </div>
            <a
              href={result}
              download="passport-photo.jpg"
              className="mt-6 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Download Photo
            </a>
          </div>
        </section>
      )}
    </div>
  );
}