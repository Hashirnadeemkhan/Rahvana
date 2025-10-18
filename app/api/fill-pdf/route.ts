import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const runtime = "nodejs";

async function unlockPdf(filePath: string): Promise<Buffer> {
  const tempOut = path.join(os.tmpdir(), `unlocked-${Date.now()}.pdf`);
  return new Promise((resolve, reject) => {
    exec(`qpdf --decrypt "${filePath}" "${tempOut}"`, async (err) => {
      if (err) reject(err);
      else {
        const buffer = await fs.readFile(tempOut);
        await fs.unlink(tempOut);
        resolve(buffer);
      }
    });
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const inputText = formData.get("inputText") as string || "";

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const tempInput = path.join(os.tmpdir(), `input-${Date.now()}.pdf`);
    await fs.writeFile(tempInput, Buffer.from(await file.arrayBuffer()));

    const unlockedBuffer = await unlockPdf(tempInput);
    await fs.unlink(tempInput);

    const pdfDoc = await PDFDocument.load(unlockedBuffer);
    const page = pdfDoc.getPage(0);
    page.drawText(inputText, { x: 50, y: 700, size: 12 }); // Adjust coords

    const filledPdfBytes = await pdfDoc.save();

    return new NextResponse(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="filled.pdf"',
      },
    });
  } catch (error) {
    console.error("Error filling PDF:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}