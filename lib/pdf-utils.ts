import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

/**
 * ✅ Load a PDF file into pdf-lib
 */
export async function loadPDF(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  return PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
}

/**
 * ✅ Add text annotation to a specific page
 */
export async function addTextToPDF(
  pdfDoc: PDFDocument,
  pageIndex: number,
  text: string,
  x: number,
  y: number,
  fontSize = 12,
  color = "#000000"
): Promise<PDFDocument> {
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  // Convert HEX → RGB
  const rgbColor = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };

  // Draw text on the PDF
  page.drawText(text, {
    x,
    y: height - y - fontSize,
    size: fontSize,
    font,
    color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
  });

  return pdfDoc;
}

/**
 * ✅ Add image (signature) annotation to a specific page
 */
export async function addImageToPDF(
  pdfDoc: PDFDocument,
  pageIndex: number,
  imageData: string, // Base64 or DataURL (e.g. PNG signature)
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0
): Promise<PDFDocument> {
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];
  const { height: pageHeight } = page.getSize();

  let embeddedImage;
  if (imageData.startsWith("data:image/png")) {
    embeddedImage = await pdfDoc.embedPng(imageData);
  } else if (imageData.startsWith("data:image/jpeg") || imageData.startsWith("data:image/jpg")) {
    embeddedImage = await pdfDoc.embedJpg(imageData);
  } else {
    throw new Error("Unsupported image format (only PNG or JPEG allowed)");
  }

  page.drawImage(embeddedImage, {
    x,
    y: pageHeight - y - height,
    width,
    height,
    rotate: degrees(rotation),
  });

  return pdfDoc;
}

/**
 * ✅ Save and return a Uint8Array of PDF bytes
 */
export async function savePDF(pdfDoc: PDFDocument): Promise<Uint8Array> {
  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

/**
 * ✅ Helper to download the edited PDF
 */
export async function downloadPDF(pdfDoc: PDFDocument, filename = "edited.pdf"): Promise<void> {
  const pdfBytes = await pdfDoc.save();
  const safeBytes = new Uint8Array(pdfBytes);
  const blob = new Blob([safeBytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * ✅ Utility: Convert HEX to normalized RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}