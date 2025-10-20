import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 ULTRA SIMPLE COMPRESSION!');

    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;

    if (!file || file.type !== 'application/pdf' || file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Invalid PDF!' }, { status: 400 });
    }

    const originalSize = file.size;
    console.log(`📄 Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // ✅ pdf-lib supported options only
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,  // slight optimization
      addDefaultPage: false,
    });

    const compressedSize = pdfBytes.length;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ COMPRESSED: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎯 REDUCTION: ${reduction}%`);

    // ✅ Convert to Buffer for NextResponse
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="compressed-${reduction}%-${file.name}"`,
        'Content-Length': compressedSize.toString(),
      },
    });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ ERROR:', errMsg);
    return NextResponse.json({ error: 'Compression failed!' }, { status: 500 });
  }
}
