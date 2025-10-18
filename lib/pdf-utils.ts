import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function loadPDF(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer()
  return PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
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
  const pages = pdfDoc.getPages()
  const page = pages[pageIndex]
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { height } = page.getSize()

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16) / 255,
          g: Number.parseInt(result[2], 16) / 255,
          b: Number.parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 }
  }

  const rgbColor = hexToRgb(color)

  page.drawText(text, {
    x,
    y: height - y - fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
  })

  return pdfDoc
}

export async function savePDF(pdfDoc: PDFDocument): Promise<void> {
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "edited.pdf"
  link.click()
  URL.revokeObjectURL(url)
}
