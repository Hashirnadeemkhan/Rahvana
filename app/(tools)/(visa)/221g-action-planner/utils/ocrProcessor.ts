import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Convert PDF page to canvas image data
 */
async function pdfPageToImageData(pdfPage: any): Promise<string> {
  const viewport = pdfPage.getViewport({ scale: 2.0 }); // Higher scale for better OCR
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await pdfPage.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  // Convert canvas to data URL (image)
  return canvas.toDataURL('image/png');
}

/**
 * Extract text from PDF using OCR
 * Converts each PDF page to an image and processes with Tesseract
 */
async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: { page: number; totalPages: number; ocrProgress: number }) => void
): Promise<string> {
  // Read file as array buffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Load PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const totalPages = pdf.numPages;
  let fullText = '';

  // Process each page
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const imageData = await pdfPageToImageData(page);
    
    // Run OCR on the page image
    const { data: { text } } = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress({
              page: pageNum,
              totalPages,
              ocrProgress: m.progress
            });
          }
        }
      }
    );
    
    fullText += text + '\n\n';
  }

  return fullText;
}

/**
 * Extract text from image using OCR
 */
async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  //Create object URL from file
  const imageUrl = URL.createObjectURL(file);
  
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress);
          }
        }
      }
    );
    
    // Clean up URL
    URL.revokeObjectURL(imageUrl);
    return text;
  } catch (error) {
    // Clean up URL even on error
    URL.revokeObjectURL(imageUrl);
    throw error;
  }
}

/**
 * Main OCR processor - automatically handles both images and PDFs
 * 
 * @param file - The file to process (image or PDF)
 * @param onProgress - Optional callback for progress updates
 * @returns Extracted text from the document
 */
export async function processDocumentOCR(
  file: File,
  onProgress?: (progress: { current: number; total: number; status: string }) => void
): Promise<string> {
  const fileType = file.type;
  
  // Validate file type
  if (!fileType.startsWith('image/') && fileType !== 'application/pdf') {
    throw new Error(`Unsupported file type: ${fileType}. Please upload an image (JPG, PNG) or PDF.`);
  }
  
  try {
    if (fileType === 'application/pdf') {
      // Process PDF
      if (onProgress) {
        onProgress({ current: 0, total: 100, status: 'Processing PDF...' });
      }
      
      const text = await extractTextFromPDF(file, (pdfProgress) => {
        if (onProgress) {
          const overallProgress = ((pdfProgress.page - 1) / pdfProgress.totalPages * 100) +
                                 (pdfProgress.ocrProgress / pdfProgress.totalPages * 100);
          onProgress({
            current: Math.round(overallProgress),
            total: 100,
            status: `Processing page ${pdfProgress.page} of ${pdfProgress.totalPages}...`
          });
        }
      });
      
      return text;
    } else {
      // Process image
      if (onProgress) {
        onProgress({ current: 0, total: 100, status: 'Processing image...' });
      }
      
      const text = await extractTextFromImage(file, (imageProgress) => {
        if (onProgress) {
          onProgress({
            current: Math.round(imageProgress * 100),
            total: 100,
            status: 'Extracting text...'
          });
        }
      });
      
      return text;
    }
  } catch (error: any) {
    console.error('OCR processing failed:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('fetch')) {
      throw new Error('Failed to load document. Please try again or use a different file.');
    } else if (error.message?.includes('PDF')) {
      throw new Error('Failed to process PDF. The file may be corrupted or password-protected.');
    } else if (error.message?.includes('image')) {
      throw new Error('Failed to process image. The file may be corrupted or in an unsupported format.');
    } else {
      throw new Error(`OCR processing failed: ${error.message || 'Unknown error'}`);
    }
  }
}
