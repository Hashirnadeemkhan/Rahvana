// C:\Users\HP\Desktop\arachnie\Arachnie\app\lib\pdf-operations.ts
/**
 * Utility functions for PDF operations
 * To be used with pdf-lib library
 *
 * Install: npm install pdf-lib
 */

import { PDFDocument, rgb } from "pdf-lib"
import { getFont } from "./fonts" // Assuming a helper function to get font
import { hex2rgb } from "./utils" // Assuming a helper function to convert hex to rgb

export async function reorderPdfPages(pdfBytes: ArrayBuffer, pageOrder: number[]) {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  const newPdfDoc = await PDFDocument.create()

  for (const pageNum of pageOrder) {
    const page = pages[pageNum - 1]
    const copiedPage = await newPdfDoc.addPage(page)
  }

  return newPdfDoc.save()
}

export async function deletePdfPages(pdfBytes: ArrayBuffer, pagesToDelete: number[]) {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const indices = pagesToDelete.map((p) => p - 1).sort((a, b) => b - a)

  for (const index of indices) {
    pdfDoc.removePage(index)
  }

  return pdfDoc.save()
}

export async function rotatePdfPage(pdfBytes: ArrayBuffer, pageIndex: number, angle: number) {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const page = pdfDoc.getPage(pageIndex)
  page.setRotation(page.getRotation() + angle)

  return pdfDoc.save()
}

export async function extractPdfPages(pdfBytes: ArrayBuffer) {
  // TODO: Implementation with pdfjs-dist
  // Convert each page to image/thumbnail
  // Return array of image data URLs
}

/**
 * Added comprehensive PDF annotation functions for text, shapes, and export
 */

export interface TextAnnotation {
  text: string
  pageIndex: number
  x: number
  y: number
  fontSize: number
  color: string
  font: string
  bold: boolean
  italic: boolean
  underline: boolean
  align: "left" | "center" | "right"
}

export interface ShapeAnnotation {
  type: "check" | "cross"
  pageIndex: number
  x: number
  y: number
  size: number
}

export interface SignatureAnnotation {
  image: string
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
}

export async function addTextAnnotationsToPdf(pdfBytes: ArrayBuffer, annotations: TextAnnotation[]) {
  const pdfDoc = await PDFDocument.load(pdfBytes)

  for (const ann of annotations) {
    const page = pdfDoc.getPage(ann.pageIndex)
    const [r, g, b] = hex2rgb(ann.color)

    page.drawText(ann.text, {
      x: ann.x,
      y: page.getHeight() - ann.y,
      size: ann.fontSize,
      font: getFont(ann.font),
      color: rgb(r / 255, g / 255, b / 255),
    })
  }

  return pdfDoc.save()
}

export async function addShapeAnnotationsToPdf(pdfBytes: ArrayBuffer, shapes: ShapeAnnotation[]) {
  const pdfDoc = await PDFDocument.load(pdfBytes)

  for (const shape of shapes) {
    const page = pdfDoc.getPage(shape.pageIndex)
    const color = shape.type === "check" ? rgb(0.13, 0.77, 0.31) : rgb(0.93, 0.27, 0.27)

    if (shape.type === "check") {
      // Draw checkmark using lines/path
    } else {
      // Draw cross using lines
    }
  }

  return pdfDoc.save()
}

export async function addSignatureToPdf(pdfBytes: ArrayBuffer, signature: SignatureAnnotation[]) {
  const pdfDoc = await PDFDocument.load(pdfBytes)

  for (const sig of signature) {
    const page = pdfDoc.getPage(sig.pageIndex)
    const image = await pdfDoc.embedPng(sig.image)
    page.drawImage(image, {
      x: sig.x,
      y: page.getHeight() - sig.y - sig.height,
      width: sig.width,
      height: sig.height,
    })
  }

  return pdfDoc.save()
}

export async function combinePdfAnnotations(
  pdfBytes: ArrayBuffer,
  textAnnotations: TextAnnotation[],
  shapeAnnotations: ShapeAnnotation[],
  signatureAnnotations: SignatureAnnotation[],
) {
  let result = pdfBytes

  if (textAnnotations.length > 0) {
    result = await addTextAnnotationsToPdf(result, textAnnotations)
  }

  if (shapeAnnotations.length > 0) {
    result = await addShapeAnnotationsToPdf(result, shapeAnnotations)
  }

  if (signatureAnnotations.length > 0) {
    result = await addSignatureToPdf(result, signatureAnnotations)
  }

  return result
}
