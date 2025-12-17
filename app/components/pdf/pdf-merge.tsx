import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import { Upload, X, RotateCw, Download, Trash2, Copy, Plus, Eye, GripHorizontal } from 'lucide-react';

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

export default function PDFMergeAdvanced() {
  const [files, setFiles] = useState<PDFFileInfo[]>([]);
  const [allPages, setAllPages] = useState<PDFPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

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

      if (!auto) setPreviewMode(true);
    } catch (err) {
      alert('Error merging PDF');
      console.error(err);
    }
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">PDF Merger</h1>
        <p className="text-gray-600">Merge, Organize, Rotate & Convert — All in Browser</p>
      </div>

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
        <span className="text-gray-600">{files.length} files • {allPages.length} pages</span>
        <div className="flex gap-3">
          {files.length > 0 && (
            <>
              <button onClick={() => { setAllPages([]); setFiles([]); }} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded flex items-center gap-2">
                <Trash2 size={18} /> Clear
              </button>
              <button onClick={() => handleMerge()} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                {loading ? <RotateCw className="animate-spin" /> : <Eye size={18} />}
                Merge & Edit Live
              </button>
            </>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.webp" onChange={handleFileInput} className="hidden" />

      {files.length === 0 ? (
        <div
          className="border-4 border-dashed border-gray-300 rounded-3xl p-32 cursor-pointer hover:border-blue-500 flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); processFiles(Array.from(e.dataTransfer.files)); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload size={64} className="mx-auto text-blue-600 mb-6" />
          <h3 className="text-2xl font-bold text-center">Drop files here</h3>
          <p className="text-gray-500 text-center">PDF, Images, Word, Excel</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 pb-20">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
          {/* Add More Button in Main Mode */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
          >
            <Plus size={32} className="text-gray-400" />
            <p className="text-sm mt-2">Add More</p>
          </div>
        </div>
      )}
    </div>
  );
}