import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import cv from "opencv-ts";

export const detectFields = async (canvas: HTMLCanvasElement) => {
  // 1. OCR text detection
  const { data } = await Tesseract.recognize(canvas, "eng");

  // 2. Get blank areas (very simple, can be improved)
  const blanks: any[] = [];

  data.words.forEach((word: any) => {
    if (word.text.trim() === "") {
      blanks.push({
        x: word.bbox.x0,
        y: word.bbox.y0,
        width: word.bbox.x1 - word.bbox.x0,
        height: word.bbox.y1 - word.bbox.y0,
      });
    }
  });

  // 3. OpenCV box detection (lines / form fields)
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  for (let i = 0; i < contours.size(); i++) {
    const rect = cv.boundingRect(contours.get(i));
    blanks.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
  }

  src.delete(); gray.delete(); edges.delete(); contours.delete(); hierarchy.delete();

  return blanks;
};

export const savePdfWithInputs = async (pdfBytes: Uint8Array) => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    const rect = input.getBoundingClientRect();
    page.drawText((input as HTMLInputElement).value, {
      x: rect.left,
      y: page.getHeight() - rect.top - 20,
      size: 12,
    });
  });

  const newPdfBytes = await pdfDoc.save();
  const blob = new Blob([newPdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "filled.pdf";
  a.click();
};
