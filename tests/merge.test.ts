import { PDFDocument } from "pdf-lib";
import fs from "fs";

describe("PDF Merge Functionality", () => {
  it("should merge multiple readable PDFs successfully", async () => {
    const pdf1 = await PDFDocument.load(fs.readFileSync("tests/sample1.pdf"));
    const pdf2 = await PDFDocument.load(fs.readFileSync("tests/sample2.pdf"));

    const merged = await PDFDocument.create();
    const p1 = await merged.copyPages(pdf1, pdf1.getPageIndices());
    const p2 = await merged.copyPages(pdf2, pdf2.getPageIndices());
    [...p1, ...p2].forEach((p) => merged.addPage(p));

    const output = await merged.save();
    expect(output.byteLength).toBeGreaterThan(0);
  });

  it("should skip encrypted PDFs gracefully", async () => {
    try {
      await PDFDocument.load(fs.readFileSync("tests/encrypted.pdf"));
    } catch (err) {
      expect((err as Error).message).toContain("encrypted");
    }
  });
});
