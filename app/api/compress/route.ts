import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create temporary paths
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const inputPath = path.join(uploadsDir, file.name);
    const outputPath = path.join(uploadsDir, "compressed_" + file.name);

    // Save uploaded PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputPath, buffer);

    // Run qpdf for compression (lossless)
    const command = `qpdf --linearize "${inputPath}" "${outputPath}"`;
    await execPromise(command);

    // Read compressed file
    const compressedBuffer = fs.readFileSync(outputPath);

    // Clean up
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    // Send compressed file to user
    return new NextResponse(compressedBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Compression failed:", error);
    return NextResponse.json(
      { error: "Failed to compress PDF" },
      { status: 500 }
    );
  }
}
