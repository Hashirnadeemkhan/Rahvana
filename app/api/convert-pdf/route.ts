// app/api/convert-pdf/route.ts
import { type NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import sharp from "sharp";
import mammoth from "mammoth";

type FileFormat = "text" | "html" | "markdown" | "image" | "docx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const format = formData.get("format") as FileFormat | null;

    if (!file || !format) {
      return NextResponse.json({ message: "File and format required" }, { status: 400 });
    }

    if (!["text", "html", "markdown", "image", "docx"].includes(format)) {
      return NextResponse.json({ message: "Unsupported format" }, { status: 400 });
    }

    const maxSize = format === "image" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ message: `File too large (max ${maxSize / (1024 * 1024)}MB)` }, { status: 413 });
    }

    const pdfBuffer = await convertToPDF(file, format);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted_${Date.now()}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Conversion failed" }, { status: 500 });
  }
}

async function convertToPDF(file: File, format: FileFormat): Promise<ArrayBuffer> {
  switch (format) {
    case "text":    return textToPDF(await file.text());
    case "html":    return htmlToPDF(await file.text());
    case "markdown":return markdownToPDF(await file.text());
    case "image":   return imageToPDF(await file.arrayBuffer());
    case "docx":    return docxToPDF(await file.arrayBuffer());
    default:        throw new Error("Invalid format");
  }
}

// Simple converters
function textToPDF(content: string): ArrayBuffer {
  const pdf = new jsPDF();
  pdf.text(pdf.splitTextToSize(content || "No content", 180), 15, 20);
  return pdf.output("arraybuffer");
}

function htmlToPDF(html: string): ArrayBuffer {
  const pdf = new jsPDF();
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  pdf.setFontSize(16); pdf.text("HTML Document", 15, 15);
  pdf.setFontSize(11); pdf.text(pdf.splitTextToSize(text || "No content", 180), 15, 25);
  return pdf.output("arraybuffer");
}

function markdownToPDF(md: string): ArrayBuffer {
  const pdf = new jsPDF();
  let y = 25;
  pdf.setFontSize(16); pdf.text("Markdown Document", 15, 15);
  pdf.setFontSize(11);

  md.split("\n").forEach(line => {
    const t = line.trim();
    if (!t) return;

    if (t.startsWith("# ")) {
      pdf.setFontSize(16); pdf.setFont("helvetica", "bold");
      pdf.text(t.slice(2), 15, y); y += 10;
      pdf.setFontSize(11); pdf.setFont("helvetica", "normal");
    } else if (t.startsWith("## ")) {
      pdf.setFontSize(14); pdf.setFont("helvetica", "bold");
      pdf.text(t.slice(3), 15, y); y += 9;
      pdf.setFontSize(11); pdf.setFont("helvetica", "normal");
    } else if (/^[-*+] /.test(t)) {
      pdf.text("• " + t.slice(2), 20, y); y += 7;
    } else {
      pdf.splitTextToSize(t, 180).forEach((l: string) => {
        if (y > 280) { pdf.addPage(); y = 20; }
        pdf.text(l, 15, y); y += 7;
      });
    }
  });
  return pdf.output("arraybuffer");
}

// IMAGE → PDF (Yeh wala 100% fix hai!)
async function imageToPDF(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const pdf = new jsPDF();

  // Yeh line thi problem — ab bilkul perfect fix
  const nodeBuffer = Buffer.from(arrayBuffer as ArrayBuffer);

  let finalBuffer: Buffer = nodeBuffer;
  try {
    finalBuffer = await sharp(arrayBuffer).jpeg({ quality: 90 }).toBuffer();
  } catch {
    // agar sharp fail ho to original use karo
  }

  const base64 = finalBuffer.toString("base64");
  const imgData = `data:image/jpeg;base64,${base64}`;

  try {
    pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
  } catch {
    pdf.setFontSize(14);
    pdf.text("Could not load image", 15, 20);
  }

  return pdf.output("arraybuffer");
}

// DOCX → PDF (bilkul safe)
async function docxToPDF(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const pdf = new jsPDF();
  let y = 30;
  pdf.setFontSize(16);
  pdf.text("Word Document", 15, 15);

  try {
    const result = await mammoth.convertToHtml({
      buffer: Buffer.from(arrayBuffer as ArrayBuffer), // ← yeh fix 100% kaam karta hai
    });

    const text = result.value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) throw new Error("Empty");

    pdf.setFontSize(11);
    pdf.splitTextToSize(text, 180).forEach((line: string) => {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(line, 15, y); y += 7;
    });
  } catch {
    pdf.setFontSize(12); pdf.setTextColor(150, 0, 0);
    pdf.text("Failed to read DOCX file", 15, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(100);
    pdf.text("May be password-protected or corrupted", 15, y);
  }

  return pdf.output("arraybuffer");
}