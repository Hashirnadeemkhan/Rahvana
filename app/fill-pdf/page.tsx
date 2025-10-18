"use client";

import React, { useState } from "react";

import PdfViewer from "../components/pdf-viewer";


export default function Page() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPdfFile(e.target.files[0]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Next.js PDF Form Editor</h1>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      {pdfFile && <PdfViewer pdfFile={pdfFile} />}
    </div>
  );
}
