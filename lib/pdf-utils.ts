import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function loadPDF(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  return PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
}

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

  // ✅ Convert HEX → RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbColor = hexToRgb(color);

  // ✅ Draw text on PDF
  page.drawText(text, {
    x,
    y: height - y - fontSize,
    size: fontSize,
    font,
    color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
  });

  return pdfDoc;
}

// ✅ PURE FUNCTION THAT RETURNS SAFE BYTES
export async function savePDF(pdfDoc: PDFDocument): Promise<Uint8Array> {
  const pdfBytes = await pdfDoc.save();
  // 👇 Convert into a plain Uint8Array (detaches from SharedArrayBuffer)
  return new Uint8Array(pdfBytes);
}

// ✅ DOWNLOAD HELPER (OPTIONAL)
export async function downloadPDF(pdfDoc: PDFDocument): Promise<void> {
  const pdfBytes = await pdfDoc.save();
  const safeBytes = new Uint8Array(pdfBytes); // ✅ Fix type conflict
  const blob = new Blob([safeBytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "edited.pdf";
  link.click();

  URL.revokeObjectURL(url);
}
