import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const runtime = "nodejs";

// Helper to unlock PDFs via qpdf before merging
async function unlockPdf(filePath: string): Promise<string> {
  const tempOut = path.join(os.tmpdir(), `unlocked-${Date.now()}.pdf`);
  return new Promise((resolve, reject) => {
    exec(`qpdf --decrypt "${filePath}" "${tempOut}"`, (err) => {
      if (err) reject(err);
      else resolve(tempOut);
    });
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No PDFs uploaded" }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const tempInput = path.join(os.tmpdir(), `input-${Date.now()}.pdf`);
      await fs.writeFile(tempInput, Buffer.from(arrayBuffer));

      try {
        // Try unlocking first (handles encrypted PDFs)
        const unlockedPath = await unlockPdf(tempInput);
        const unlockedBuffer = await fs.readFile(unlockedPath);
        const pdf = await PDFDocument.load(unlockedBuffer, { ignoreEncryption: true });

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      } catch (err) {
        console.error(`⚠️ Could not process file: ${file.name}`, err);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    // Use the Uint8Array (or a Node Buffer) directly to avoid ArrayBuffer | SharedArrayBuffer typing issues
    const fileBuffer = Buffer.from(mergedPdfBytes);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error("❌ Merge failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
