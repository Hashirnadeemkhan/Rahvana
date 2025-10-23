/**
 * POST /api/merge
 * Merges multiple uploaded PDF files into a single PDF.
 */

import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const runtime = "nodejs";

/**
 * Handles PDF merge requests.
 * @param req - Incoming HTTP Request (multipart/form-data)
 * @returns - Merged PDF file as response
 */
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
        const pdf = await PDFDocument.load(await fs.readFile(tempInput), {
          ignoreEncryption: true,
        });

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      } catch (err) {
        console.error(`Failed to process: ${file.name}`, err);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const fileBuffer = Buffer.from(mergedPdfBytes);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error("Merge failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
