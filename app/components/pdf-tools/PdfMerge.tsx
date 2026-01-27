'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import { Upload, X, RotateCw, Download, Trash2, Copy, Plus, Eye, GripHorizontal, AlertCircle, FileCheck } from 'lucide-react';

interface PDFPage {
  id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  rotation: number;
  thumbnail: string;
}

interface PDFFileInfo {
  id: string;
  file: File;
  name: string;
  pages: PDFPage[];
}

interface MergeResult {
  originalSize: number;
  mergedSize: number;
  filesCount: number;
}

export default function PDFMergeAdvanced() {
  const [files, setFiles] = useState<PDFFileInfo[]>([]);
  const [allPages, setAllPages] = useState<PDFPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MergeResult | null>(null);
  const [apiUrl] = useState('http://localhost:8000');

  const [draggedFileId, setDraggedFileId] = useState<string | null>(null); // For dragging files in main mode
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null); // For dragging pages in preview mode
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-merge with debounce when in preview mode
  useEffect(() => {
    if (!previewMode || allPages.length === 0 || loading) return;

    const timer = setTimeout(() => {
      handleMerge(true); // true = auto mode (no need to set previewMode again)
    }, 800); // 800ms delay — feels real-time but prevents too many merges

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPages, previewMode]);

  // --- File Conversion Logic ---
  const convertToPDF = async (file: File): Promise<File | null> => {
    try {
      if (file.type === 'application/pdf') return file;

      const pdfLib = await import('pdf-lib');
      const pdfDoc = await pdfLib.PDFDocument.create();

      if (file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        let image;

        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          const img = new Image();
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const pngBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/png');
          });

          const pngBuffer = await pngBlob.arrayBuffer();
          image = await pdfDoc.embedPng(pngBuffer);
          URL.revokeObjectURL(url);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      // Word & Excel conversion (same as before)
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const cleanText = result.value.replace(/[^\x00-\x7F]/g, '').replace(/\r\n/g, '\n');

        const A4_WIDTH = 595, A4_HEIGHT = 842, MARGIN = 50, FONT_SIZE = 12;
        const lines = cleanText.split('\n');
        let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        let yPosition = A4_HEIGHT - MARGIN;

        for (const line of lines) {
          if (yPosition < MARGIN) {
            currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            yPosition = A4_HEIGHT - MARGIN;
          }
          currentPage.drawText(line.substring(0, 90), { x: MARGIN, y: yPosition, size: FONT_SIZE });
          yPosition -= 16;
        }
      }
      else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const XLSX = await import('xlsx');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const A4_WIDTH = 595, A4_HEIGHT = 842, MARGIN = 50;

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          const lines = csv.split('\n').filter((l: string) => l.trim());

          let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
          let yPosition = A4_HEIGHT - MARGIN;

          currentPage.drawText(`Sheet: ${sheetName}`, { x: MARGIN, y: yPosition, size: 14 });
          yPosition -= 30;

          for (const line of lines) {
            if (yPosition < MARGIN) {
              currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
              yPosition = A4_HEIGHT - MARGIN;
            }
            currentPage.drawText(line.substring(0, 80), { x: MARGIN, y: yPosition, size: 10 });
            yPosition -= 14;
          }
        }
      }
      else return null;

      const pdfBytes = await pdfDoc.save();
      return new File([new Blob([new Uint8Array(pdfBytes)])], file.name.replace(/\.[^/.]+$/, "") + '.pdf', { type: 'application/pdf' });
    } catch (error) {
      console.error('Conversion Error:', error);
      return null;
    }
  };

  const loadPDFPages = async (file: File, fileId: string): Promise<PDFPage[]> => {
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const pages: PDFPage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          pages.push({
            id: `${fileId}-page-${i}-${Date.now()}`,
            fileId,
            fileName: file.name,
            pageNumber: i,
            rotation: 0,
            thumbnail: canvas.toDataURL(),
          });
        }
      }
      return pages;
    } catch (error) {
      console.error('Error loading PDF:', error);
      return [];
    }
  };

  const processFiles = async (incomingFiles: File[]) => {
    setLoading(true);
    for (const file of incomingFiles) {
      if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        alert(`Skipping ${file.name}: PowerPoint not supported.`);
        continue;
      }

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select PDF files only');
        setLoading(false);
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError('File is too large. Maximum size is 100MB');
        setLoading(false);
        return;
      }

      const pdfFile = await convertToPDF(file);
      if (pdfFile) {
        const fileId = Math.random().toString(36).substr(2, 9);
        const pages = await loadPDFPages(pdfFile, fileId);
        if (pages.length > 0) {
          setFiles(prev => [...prev, { id: fileId, file: pdfFile, name: pdfFile.name, pages }]);
          setAllPages(prev => [...prev, ...pages]);
        }
      }
    }
    setLoading(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError('');
    setResult(null);
    await processFiles(Array.from(e.target.files));
    if (e.target.value) e.target.value = '';
  };

  const removePage = (pageId: string) => setAllPages(prev => prev.filter(p => p.id !== pageId));

  // Function to rotate a single page (used in Preview Mode)
  const rotateSinglePage = (pageId: string) => {
    setAllPages(prev =>
      prev.map(page =>
        page.id === pageId
          ? { ...page, rotation: (page.rotation + 90) % 360 }
          : page
      )
    );
  };

  // Function to rotate all pages of a file (used in Main Mode)
  const rotateFilePages = (fileId: string) => {
    setAllPages(prev =>
      prev.map(page =>
        page.fileId === fileId
          ? { ...page, rotation: (page.rotation + 90) % 360 }
          : page
      )
    );
  };

  const duplicatePage = (pageId: string) => {
    const index = allPages.findIndex(p => p.id === pageId);
    if (index !== -1) {
      const newPage = { ...allPages[index], id: `${allPages[index].id}-copy-${Date.now()}` };
      setAllPages(prev => {
        const newPages = [...prev];
        newPages.splice(index + 1, 0, newPage);
        return newPages;
      });
    }
  };

  // Main Mode: Drag/Drop Files
  const handleFileDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedFileId(fileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFileDragOver = (e: React.DragEvent, targetFileId: string) => {
    e.preventDefault();
    if (draggedFileId === targetFileId) return;
  };

  const handleFileDrop = (e: React.DragEvent, dropFileId: string) => {
    e.preventDefault();
    if (draggedFileId === null || draggedFileId === dropFileId) return;

    const draggedIndex = files.findIndex(f => f.id === draggedFileId);
    const dropIndex = files.findIndex(f => f.id === dropFileId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    const newFiles = [...files];
    const [moved] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, moved);
    setFiles(newFiles);

    // Rebuild allPages in the new order
    const newAllPages: PDFPage[] = [];
    newFiles.forEach(file => {
      newAllPages.push(...file.pages);
    });
    setAllPages(newAllPages);

    setDraggedFileId(null);
  };

  // Preview Mode: Drag/Drop Pages
  const handlePageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedPageIndex === index) return;
    setDragOverIndex(index);
  };

  const handlePageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedPageIndex === null || draggedPageIndex === dropIndex) return;

    const newPages = [...allPages];
    const [moved] = newPages.splice(draggedPageIndex, 1);
    newPages.splice(dropIndex, 0, moved);
    setAllPages(newPages);

    setDraggedPageIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedPageIndex(null);
    setDragOverIndex(null);
    setDraggedFileId(null);
  };

  const handleMerge = async (auto = false) => {
    if (allPages.length === 0) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const pdfLib = await import('pdf-lib');
      const mergedPdf = await pdfLib.PDFDocument.create();

      for (const page of allPages) {
        const fileInfo = files.find(f => f.id === page.fileId);
        if (!fileInfo) continue;

        const arrayBuffer = await fileInfo.file.arrayBuffer();
        const sourcePdf = await pdfLib.PDFDocument.load(arrayBuffer);
        const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [page.pageNumber - 1]);

        const existingRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation(pdfLib.degrees(existingRotation + page.rotation));

        mergedPdf.addPage(copiedPage);
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
      const newUrl = URL.createObjectURL(blob);

      if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(newUrl);

      // Calculate result stats
      const totalOriginalSize = files.reduce((sum, file) => sum + file.file.size, 0);
      const mergedSize = blob.size;

      setResult({
        originalSize: totalOriginalSize,
        mergedSize,
        filesCount: files.length
      });

      if (!auto) setPreviewMode(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Merging failed. Please try again.';
      setError(message);
      console.error(err);
    }
    setLoading(false);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const mb = bytes / 1024 / 1024;
    if (mb < 1) {
      const kb = bytes / 1024;
      return kb.toFixed(2) + ' KB';
    }
    return mb.toFixed(2) + ' MB';
  };

  // File Card Component (for Main Mode) - Now with working visual rotation
  const FileCard = ({ file }: { file: PDFFileInfo }) => {
    // Find the first page of this file from allPages (so we get updated rotation)
    const firstPage = allPages.find(page => page.fileId === file.id);

    return (
      <div
        draggable
        onDragStart={(e) => handleFileDragStart(e, file.id)}
        onDragOver={(e) => handleFileDragOver(e, file.id)}
        onDrop={(e) => handleFileDrop(e, file.id)}
        onDragEnd={handleDragEnd}
        className={`
          relative bg-white rounded-xl shadow-sm border transition-all duration-200 group select-none cursor-move
          ${draggedFileId === file.id ? 'opacity-40 scale-95' : ''}
          hover:border-blue-300
        `}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-xl">
          <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded border">{file.pages.length} Pages</span>
          <GripHorizontal className="text-gray-300 cursor-grab active:cursor-grabbing" size={16} />
        </div>

        {/* Thumbnail Section */}
        <div className="relative aspect-[3/4] p-3 flex items-center justify-center overflow-hidden bg-white">
          {/* Show first page's thumbnail with rotation */}
          {firstPage?.thumbnail && (
            <NextImage
              src={firstPage.thumbnail}
              alt=""
              fill
              style={{ transform: `rotate(${firstPage?.rotation || 0}deg)` }}
              className="object-contain pointer-events-none"
              unoptimized
            />
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
            <button
              onClick={() => rotateFilePages(file.id)} // Rotate ALL pages of this file
              className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white shadow-lg"
            >
              <RotateCw size={18} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Duplicate the entire file
                  const newFileId = Math.random().toString(36).substr(2, 9);
                  const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}_copy.pdf`;
                  const newPages = file.pages.map(page => ({
                    ...page,
                    id: `${newFileId}-page-${page.pageNumber}-${Date.now()}`,
                    fileId: newFileId,
                    fileName: newFileName,
                  }));

                  setFiles(prev => [
                    ...prev,
                    {
                      id: newFileId,
                      file: file.file, // Same file object
                      name: newFileName,
                      pages: newPages,
                    },
                  ]);
                  setAllPages(prev => [...prev, ...newPages]);
                }}
                className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white shadow-lg"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => {
                  // Remove the entire file and its pages
                  setFiles(prev => prev.filter(f => f.id !== file.id));
                  setAllPages(prev => prev.filter(p => p.fileId !== file.id));
                }}
                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-gray-50 rounded-b-xl text-xs truncate" title={file.name}>
          {file.name}
        </div>
      </div>
    );
  };

  // Page Thumbnail Card Component (for Preview Mode) - Matches your screenshot
  const ThumbnailCard = ({ page, index }: { page: PDFPage; index: number }) => (
    <div
      draggable
      onDragStart={(e) => handlePageDragStart(e, index)}
      onDragOver={(e) => handlePageDragOver(e, index)}
      onDrop={(e) => handlePageDrop(e, index)}
      onDragEnd={handleDragEnd}
      className={`
        relative bg-white rounded-xl shadow-sm border transition-all duration-200 group select-none
        ${draggedPageIndex === index ? 'opacity-40 scale-95' : ''}
        ${dragOverIndex === index ? 'border-blue-500 border-2 scale-105 shadow-xl' : 'border-gray-200 hover:border-blue-300'}
      `}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-xl">
        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded border">{index + 1}</span>
        <GripHorizontal className="text-gray-300 cursor-grab active:cursor-grabbing" size={16} />
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[3/4] p-3 flex items-center justify-center overflow-hidden bg-white">
        <NextImage src={page.thumbnail} alt="" fill style={{ transform: `rotate(${page.rotation}deg)` }} className="object-contain pointer-events-none" unoptimized />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
          <button onClick={() => rotateSinglePage(page.id)} className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white shadow-lg">
            <RotateCw size={18} />
          </button>
          <div className="flex gap-2">
            <button onClick={() => duplicatePage(page.id)} className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white shadow-lg">
              <Copy size={16} />
            </button>
            <button onClick={() => removePage(page.id)} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white shadow-lg">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-gray-50 rounded-b-xl text-[10px] text-gray-500 truncate text-center" title={page.fileName}>
        {page.fileName}
      </div>
    </div>
  );

  // PREVIEW MODE - Real-time editing + auto update
  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-5 rounded-xl shadow-md mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Live Edit & Preview</h2>
              {loading ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <RotateCw className="animate-spin" size={18} />
                  <span>Updating preview...</span>
                </div>
              ) : (
                <span className="text-sm text-green-600">✓ Real-time updates</span>
              )}
            </div>
            <div className="flex gap-3">
              {mergedPdfUrl && (
                <a href={mergedPdfUrl} download="merged.pdf" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                  <Download size={20} /> Download
                </a>
              )}
              <button onClick={() => setPreviewMode(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Area - Increased Width */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden h-[80vh]">
              {mergedPdfUrl ? (
                <iframe src={mergedPdfUrl} className="w-full h-full border-0" title="Live PDF Preview" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <p>Organize pages → preview will appear automatically</p>
                </div>
              )}
            </div>

            {/* Pages Sidebar - Increased Width */}
            <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-md"> {/* <-- Increased width */}
              <h3 className="text-lg font-semibold mb-4">Pages ({allPages.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                {allPages.map((page, i) => <ThumbnailCard key={page.id} page={page} index={i} />)}
                {/* Add More Button REMOVED in Preview Mode */}
                {/* <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                >
                  <Plus size={32} className="text-gray-400" />
                  <p className="text-sm mt-2">Add More</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN MODE: Show Files for Organization (Now with visual rotation)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary/90 p-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
              PDF Merger
            </h1>
            <p className="text-center text-white/90 text-lg">
              Merge multiple PDF files into one
            </p>
          </div>

          <div className="p-8 md:p-12">
            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select PDF Files
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className={`block border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  loading
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-primary/90 hover:border-primary/100 hover:bg-primary/10 cursor-pointer'
                }`}
              >
                <Upload className={`mx-auto h-16 w-16 mb-3 ${files.length > 0 ? 'text-primary/90' : 'text-gray-400'}`} />
                {files.length > 0 ? (
                  <div>
                    <p className="text-primary/90 font-semibold text-lg mb-1">
                      {files.length} file{files.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-gray-500">
                      {files.reduce((total, file) => total + file.file.size, 0) > 0
                        ? formatBytes(files.reduce((total, file) => total + file.file.size, 0))
                        : '0 Bytes'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Click to add more files
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only • Max 100MB each
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Merge Button */}
            <button
              onClick={() => handleMerge()}
              disabled={files.length === 0 || loading}
              className="w-full bg-primary/90 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Merging...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-6 w-6" />
                  Merge Now
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-sm">
                <div className="flex items-center text-green-700 mb-4">
                  <FileCheck className="h-6 w-6 mr-3" />
                  <span className="font-bold text-lg">Merge Successful!</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-xs font-medium mb-1">Files Merged</p>
                    <p className="text-gray-800 font-bold text-xl">{result.filesCount}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-xs font-medium mb-1">Original Size</p>
                    <p className="text-gray-800 font-bold text-xl">{formatBytes(result.originalSize)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-xs font-medium mb-1">Merged Size</p>
                    <p className="text-gray-800 font-bold text-xl">{formatBytes(result.mergedSize)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}