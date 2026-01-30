// import { NextResponse } from "next/server";
// import { PDFDocument, degrees } from "pdf-lib";

// export const runtime = "nodejs";

// /**
//  * Handles PDF merge requests with rotation support
//  * @param req - Incoming HTTP Request (multipart/form-data)
//  * @returns - Merged PDF file as response
//  */
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const files = formData.getAll("files") as File[];
//     const rotations = formData.getAll("rotations") as string[];

//     console.log(`Processing ${files.length} files`);

//     if (!files.length) {
//       return NextResponse.json({ error: "No PDFs uploaded" }, { status: 400 });
//     }

//     if (files.length < 2) {
//       return NextResponse.json({ error: "At least 2 PDFs required" }, { status: 400 });
//     }

//     // Create a new PDF document for merging
//     const mergedPdf = await PDFDocument.create();

//     // Process each file
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const rotation = parseInt(rotations[i] || "0");

//       console.log(`Processing file ${i + 1}: ${file.name}, rotation: ${rotation}`);

//       try {
//         // Read file as array buffer
//         const arrayBuffer = await file.arrayBuffer();
        
//         // Load the PDF
//         const pdf = await PDFDocument.load(arrayBuffer, {
//           ignoreEncryption: true,
//         });

//         // Get all page indices
//         const pageIndices = pdf.getPageIndices();
//         console.log(`File ${file.name} has ${pageIndices.length} pages`);

//         // Copy pages from source PDF to merged PDF
//         const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);

//         // Add each page with rotation if specified
//         copiedPages.forEach((page) => {
//           if (rotation !== 0) {
//             // Get current rotation and add new rotation
//             const currentRotation = page.getRotation().angle;
//             page.setRotation(degrees(currentRotation + rotation));
//           }
//           mergedPdf.addPage(page);
//         });

//         console.log(`Successfully added ${copiedPages.length} pages from ${file.name}`);
//       } catch (err) {
//         console.error(`Failed to process file: ${file.name}`, err);
//         return NextResponse.json(
//           { error: `Failed to process file: ${file.name}. ${err}` },
//           { status: 500 }
//         );
//       }
//     }

//     // Save the merged PDF
//     console.log("Saving merged PDF...");
//     const mergedPdfBytes = await mergedPdf.save();
//     const totalPages = mergedPdf.getPageCount();
//     console.log(`Merged PDF created with ${totalPages} total pages`);

//     const fileBuffer = Buffer.from(mergedPdfBytes);

//     return new NextResponse(fileBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="merged.pdf"',
//         "Content-Length": fileBuffer.length.toString(),
//       },
//     });
//   } catch (error) {
//     console.error("Merge failed:", error);
//     return NextResponse.json(
//       { error: `Merge failed: ${error}` },
//       { status: 500 }
//     );
//   }
// }