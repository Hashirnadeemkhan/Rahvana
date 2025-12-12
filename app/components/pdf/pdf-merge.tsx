import React, { useState, useRef } from 'react';
import { Upload, X, RotateCw, Download, GripVertical, Trash2, Copy, FileText, Grid3x3, List, Eye, FolderOpen } from 'lucide-react';

interface PDFPage {
  id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  totalPages: number;
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
  const [isDragging, setIsDragging] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [organizeMode, setOrganizeMode] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToPDF = async (file: File): Promise<File | null> => {
    try {
      // If already PDF, return as is
      if (file.type === 'application/pdf') {
        return file;
      }

      const pdfLib = await import('pdf-lib');
      const pdfDoc = await pdfLib.PDFDocument.create();

      // Handle Images
      if (file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        let image;

        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Convert other image formats to canvas then to PNG
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

        // Calculate proper A4 dimensions (595 x 842 points)
        const A4_WIDTH = 595;
        const A4_HEIGHT = 842;
        const MARGIN = 40;
        
        const maxWidth = A4_WIDTH - (MARGIN * 2);
        const maxHeight = A4_HEIGHT - (MARGIN * 2);
        
        // Calculate scaling to fit image within A4 with margins
        let width = image.width;
        let height = image.height;
        
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const scale = Math.min(widthRatio, heightRatio, 1); // Don't upscale
        
        width = width * scale;
        height = height * scale;
        
        // Center the image on the page
        const x = (A4_WIDTH - width) / 2;
        const y = (A4_HEIGHT - height) / 2;
        
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        page.drawImage(image, { x, y, width, height });
      }
      // Handle Word documents (.docx)
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        // Clean text - remove special characters that pdf-lib can't handle
        const cleanText = result.value
          .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n');
        
        const A4_WIDTH = 595;
        const A4_HEIGHT = 842;
        const MARGIN = 50;
        const LINE_HEIGHT = 14;
        const FONT_SIZE = 11;
        
        const lines = cleanText.split('\n');
        let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        let yPosition = A4_HEIGHT - MARGIN;
        
        for (const line of lines) {
          if (yPosition < MARGIN + LINE_HEIGHT) {
            currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            yPosition = A4_HEIGHT - MARGIN;
          }
          
          const trimmedLine = line.trim();
          if (trimmedLine) {
            try {
              currentPage.drawText(trimmedLine.substring(0, 100), {
                x: MARGIN,
                y: yPosition,
                size: FONT_SIZE,
                maxWidth: A4_WIDTH - (MARGIN * 2),
              });
            } catch (err) {
              // Skip lines that can't be rendered
              console.warn('Skipping line with encoding issues');
            }
          }
          yPosition -= LINE_HEIGHT;
        }
      }
      // Handle Excel files (.xlsx)
      else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const XLSX = await import('xlsx');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const A4_WIDTH = 595;
        const A4_HEIGHT = 842;
        const MARGIN = 50;
        const LINE_HEIGHT = 12;
        const FONT_SIZE = 9;
        
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          const lines = csv.split('\n').filter(line => line.trim());
          
          let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
          let yPosition = A4_HEIGHT - MARGIN;
          
          // Add sheet name as header
          currentPage.drawText(`Sheet: ${sheetName}`, {
            x: MARGIN,
            y: yPosition,
            size: 12,
          });
          yPosition -= LINE_HEIGHT * 2;
          
          for (const line of lines) {
            if (yPosition < MARGIN + LINE_HEIGHT) {
              currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
              yPosition = A4_HEIGHT - MARGIN;
            }
            
            try {
              const cleanLine = line.replace(/[^\x00-\x7F]/g, '');
              currentPage.drawText(cleanLine.substring(0, 80), {
                x: MARGIN,
                y: yPosition,
                size: FONT_SIZE,
                maxWidth: A4_WIDTH - (MARGIN * 2),
              });
            } catch (err) {
              console.warn('Skipping line with encoding issues');
            }
            yPosition -= LINE_HEIGHT;
          }
        }
      }
      // Handle PowerPoint files (.pptx)
      else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        // PowerPoint conversion not supported - skip this file
        console.warn('PowerPoint files cannot be converted in browser');
        return null;
      }
      else {
        console.warn('Unsupported file type:', file.type);
        return null;
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfFile = new File([pdfBlob], file.name.replace(/\.[^/.]+$/, '') + '.pdf', {
        type: 'application/pdf',
      });

      return pdfFile;
    } catch (error) {
      console.error('Error converting to PDF:', error);
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
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          pages.push({
            id: `${fileId}-page-${i}`,
            fileId,
            fileName: file.name,
            pageNumber: i,
            totalPages: pdf.numPages,
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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const processFiles = async (incomingFiles: File[]) => {
    setLoading(true);
    
    const unsupportedFiles: string[] = [];
    
    for (const file of incomingFiles) {
      try {
        // Check for PowerPoint files and skip them
        if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
            file.name.toLowerCase().endsWith('.pptx') || 
            file.name.toLowerCase().endsWith('.ppt')) {
          unsupportedFiles.push(file.name);
          continue;
        }

        // Convert to PDF if not already
        const pdfFile = await convertToPDF(file);
        
        if (!pdfFile) {
          alert(`Could not convert ${file.name} to PDF. Unsupported format.`);
          continue;
        }

        const fileId = Math.random().toString(36).substr(2, 9) + Date.now();
        const pages = await loadPDFPages(pdfFile, fileId);
        
        if (pages.length > 0) {
          const fileInfo: PDFFileInfo = {
            id: fileId,
            file: pdfFile,
            name: pdfFile.name,
            pages,
          };
          
          setFiles(prev => [...prev, fileInfo]);
          setAllPages(prev => [...prev, ...pages]);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing ${file.name}`);
      }
    }
    
    // Show message for unsupported files
    if (unsupportedFiles.length > 0) {
      alert(
        `PowerPoint files are not supported for browser conversion:\n\n${unsupportedFiles.join('\n')}\n\n` +
        `Please export your PowerPoint as PDF first, then upload the PDF file.`
      );
    }
    
    setLoading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await processFiles(Array.from(e.dataTransfer.files));
  };

  const removePage = (pageId: string) => {
    setAllPages(allPages.filter(p => p.id !== pageId));
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      newSet.delete(pageId);
      return newSet;
    });
  };

  const rotatePage = async (pageId: string) => {
    setAllPages(allPages.map(p => 
      p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
    
    const page = allPages.find(p => p.id === pageId);
    if (page) {
      const file = files.find(f => f.id === page.fileId);
      if (file) {
        try {
          const pdfjs = await import('pdfjs-dist');
          const arrayBuffer = await file.file.arrayBuffer();
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          const pdfPage = await pdf.getPage(page.pageNumber);
          const newRotation = (page.rotation + 90) % 360;
          const viewport = pdfPage.getViewport({ scale: 0.3, rotation: newRotation });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await pdfPage.render({ canvasContext: context, viewport }).promise;
            
            setAllPages(prev => prev.map(p => 
              p.id === pageId 
                ? { ...p, thumbnail: canvas.toDataURL(), rotation: newRotation }
                : p
            ));
          }
        } catch (error) {
          console.error('Error rotating page:', error);
        }
      }
    }
  };

  const duplicatePage = (pageId: string) => {
    const page = allPages.find(p => p.id === pageId);
    if (page) {
      const duplicate = {
        ...page,
        id: `${page.id}-dup-${Date.now()}`,
      };
      const index = allPages.findIndex(p => p.id === pageId);
      const newPages = [...allPages];
      newPages.splice(index + 1, 0, duplicate);
      setAllPages(newPages);
    }
  };

  const rotateAll = () => {
    setAllPages(allPages.map(p => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  };

  const deleteSelected = () => {
    if (selectedPages.size === 0) return;
    if (selectedPages.size >= allPages.length) {
      alert('Cannot delete all pages!');
      return;
    }
    if (confirm(`Delete ${selectedPages.size} selected page(s)?`)) {
      setAllPages(allPages.filter(p => !selectedPages.has(p.id)));
      setSelectedPages(new Set());
    }
  };

  const toggleSelect = (pageId: string) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedPageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedPageIndex === null || draggedPageIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedPageIndex === null || draggedPageIndex === dropIndex) {
      setDraggedPageIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...allPages];
    const [draggedPage] = newPages.splice(draggedPageIndex, 1);
    newPages.splice(dropIndex, 0, draggedPage);
    
    setAllPages(newPages);
    setDraggedPageIndex(null);
    setDragOverIndex(null);
  };

  const handleMerge = async () => {
    if (allPages.length === 0) {
      alert('Please add at least one file');
      return;
    }

    setLoading(true);
    try {
      const pdfLib = await import('pdf-lib');
      const mergedPdf = await pdfLib.PDFDocument.create();

      for (const page of allPages) {
        const file = files.find(f => f.id === page.fileId);
        if (!file) continue;

        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(arrayBuffer);
        const [copiedPage] = await mergedPdf.copyPages(pdf, [page.pageNumber - 1]);

        if (page.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(pdfLib.degrees(currentRotation + page.rotation));
        }

        mergedPdf.addPage(copiedPage);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      setPreviewMode(true);
    } catch (err) {
      console.error(err);
      alert('Error merging files: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedPdfUrl) return;
    const a = document.createElement('a');
    a.href = mergedPdfUrl;
    a.download = 'merged.pdf';
    a.click();
  };

  const resetAll = () => {
    setFiles([]);
    setAllPages([]);
    setPreviewMode(false);
    setOrganizeMode(false);
    setSelectedPages(new Set());
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  if (previewMode && mergedPdfUrl) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between space-x-6 ">
              <h2 className="text-xl font-semibold text-gray-900">Preview Merged PDF</h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadMerged}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Download size={18} />
                  Download PDF
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  <X size={18} />
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <iframe
              src={mergedPdfUrl}
              className="w-full h-[calc(100vh-140px)]"
              title="Merged PDF Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  if (organizeMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Organize Pages</h2>
                <p className="text-sm text-gray-600 mt-1">{allPages.length} pages total</p>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'}`}
                  >
                    <Grid3x3 size={18} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'}`}
                  >
                    <List size={18} className="text-gray-700" />
                  </button>
                </div>
                {selectedPages.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete ({selectedPages.size})
                  </button>
                )}
                <button
                  onClick={rotateAll}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  <RotateCw size={16} />
                  Rotate All
                </button>
                <button
                  onClick={() => setOrganizeMode(false)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Done
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {allPages.map((page, index) => (
                  <div
                    key={page.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDropReorder(e, index)}
                    onClick={() => toggleSelect(page.id)}
                    className={`relative group cursor-move rounded-lg overflow-hidden transition-all hover:shadow-md border-2 ${
                      draggedPageIndex === index ? 'opacity-50' :
                      dragOverIndex === index ? 'border-blue-600 bg-blue-50' :
                      selectedPages.has(page.id) ? 'border-blue-600 shadow-md' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center p-2">
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.pageNumber}`}
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs font-semibold px-2 py-1 rounded">
                      {index + 1}
                    </div>

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePage(page.id);
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                        title="Rotate"
                      >
                        <RotateCw size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicatePage(page.id);
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                        title="Duplicate"
                      >
                        <Copy size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePage(page.id);
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>

                    {selectedPages.has(page.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {allPages.map((page, index) => (
                  <div
                    key={page.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDropReorder(e, index)}
                    className={`flex items-center gap-3 bg-gray-50 rounded-lg p-3 border-2 transition-all cursor-move ${
                      draggedPageIndex === index ? 'opacity-50 border-blue-600' :
                      dragOverIndex === index ? 'border-blue-600 bg-blue-50' :
                      selectedPages.has(page.id) ? 'border-blue-600 bg-blue-50' :
                      'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.id)}
                      onChange={() => toggleSelect(page.id)}
                      className="w-4 h-4"
                    />
                    <GripVertical size={18} className="text-gray-400" />
                    <div className="w-14 h-18 bg-white rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <img src={page.thumbnail} alt="" className="max-w-full max-h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Page {index + 1}</p>
                      <p className="text-xs text-gray-500 truncate">{page.fileName} - {page.pageNumber}/{page.totalPages}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => rotatePage(page.id)}
                        className="p-2 bg-white rounded hover:bg-gray-100 transition border border-gray-200"
                      >
                        <RotateCw size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => duplicatePage(page.id)}
                        className="p-2 bg-white rounded hover:bg-gray-100 transition border border-gray-200"
                      >
                        <Copy size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => removePage(page.id)}
                        className="p-2 bg-white rounded hover:bg-gray-100 transition border border-gray-200"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge Files to PDF</h1>
          <p className="text-gray-600">Combine PDFs, Images, Word & Excel into one document</p>
        </div>

        <div
          className={`bg-white rounded-lg shadow-sm px-52 border-2 border-dashed p-12 mb-6 transition-all ${
            isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-blue-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop files here
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              PDF, Images (JPG, PNG), Word (.docx), Excel (.xlsx)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Select Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp,.webp,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {allPages.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Selected Files</h3>
                  <p className="text-sm text-gray-600">{files.length} files • {allPages.length} pages</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrganizeMode(true)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    <FolderOpen size={18} />
                    Organize Pages
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <Trash2 size={18} />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.pages.length} page{file.pages.length !== 1 ? 's' : ''} • {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleMerge}
                disabled={loading || allPages.length === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Eye size={20} />
                {loading ? 'Processing...' : 'Merge & Preview'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}