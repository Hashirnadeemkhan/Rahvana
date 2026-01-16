import { PDFDocument, StandardFonts, rgb, PDFName } from 'pdf-lib';

interface PDFGeneratorOptions {
  coverLetterData: {
    applicantName: string;
    caseNumber: string;
    interviewDate: string;
    embassy: string;
    additionalNotes: string;
  };
  actionPlanStages: Array<{
    documents?: string[];
    [key: string]: any;
  }>;
  uploadedDocs: Record<string, Array<{
    file: File;
    uploadDate: Date;
    quality: 'excellent' | 'good' | 'needs-review';
  }>>;
}

const drawWrappedText = (page: any, text: string, x: number, y: number, size: number, font: any, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  words.forEach(word => {
    const testLine = line + (line ? ' ' : '') + word;
    const width = font.widthOfTextAtSize(testLine, size);
    if (width > maxWidth) {
      page.drawText(line, { x, y: currentY, size, font });
      currentY -= lineHeight;
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) {
    page.drawText(line, { x, y: currentY, size, font });
    currentY -= lineHeight;
  }
  return currentY;
};

const generateCoverLetter = (coverLetterData: PDFGeneratorOptions['coverLetterData'], actionPlanStages: PDFGeneratorOptions['actionPlanStages']) => {
  const docsList = actionPlanStages.flatMap(stage => stage.documents || []).filter(Boolean).map((doc, i) => `${i + 1}. ${doc.trim()}`).join('\n');

  return `
U.S. Embassy ${coverLetterData.embassy.charAt(0).toUpperCase() + coverLetterData.embassy.slice(1)}
Immigrant Visa Unit

RE: Additional Documents for Case ${coverLetterData.caseNumber}
Applicant: ${coverLetterData.applicantName}
Interview Date: ${coverLetterData.interviewDate}

Dear Consular Officer,

I am respectfully submitting the additional documents as requested in my 221(g) letter received after my immigrant visa interview on ${coverLetterData.interviewDate}.

DOCUMENTS SUBMITTED:
${docsList}

I have carefully reviewed each document to ensure completeness, proper certification, and translation where required. All documents are originals or certified copies as specified in your 221(g) letter.

${coverLetterData.embassy.toLowerCase() === 'islamabad' ?
`For submission in Islamabad: I am using the designated courier service as specified in the 221(g) letter and have retained the tracking receipt for my records.` :
''}

${coverLetterData.additionalNotes ? `\nADDITIONAL INFORMATION:\n${coverLetterData.additionalNotes}\n` : ''}

I appreciate your time and consideration of my case. Please contact me at the email or phone number provided in my original application if you require any additional information.

Thank you for your attention to this matter.

Respectfully submitted,
${coverLetterData.applicantName}
Case Number: ${coverLetterData.caseNumber}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  `.trim();
};

const getDocsList = (actionPlanStages: PDFGeneratorOptions['actionPlanStages']) => {
  return actionPlanStages
    .flatMap((stage, stepIndex) => (stage.documents || []).filter(Boolean).map((doc, docIndex) => ({
      name: doc.trim(),
      docId: `step-${stepIndex}-doc-${docIndex}`
    })));
};

const generateDocumentIndex = (docs: {name: string, docId: string}[], coverLetterData: PDFGeneratorOptions['coverLetterData']) => {
  let indexText = 'DOCUMENT INDEX\n\n';
  indexText += 'The following documents are included in this submission:\n\n';

  docs.forEach((doc, i) => {
    indexText += `${i + 1}. ${doc.name}\n`;
  });

  indexText += `\nTotal Documents: ${docs.length}\nSubmitted by: ${coverLetterData.applicantName}\nCase Number: ${coverLetterData.caseNumber}\nDate: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

  return indexText;
};

export const generatePDFPacket = async (options: PDFGeneratorOptions): Promise<void> => {
  try {
    const { coverLetterData, actionPlanStages, uploadedDocs } = options;
    
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Cover Letter Page
    let coverPage = pdfDoc.addPage([595, 842]); // A4 size
    let y = 780;
    let coverText = generateCoverLetter(coverLetterData, actionPlanStages);
    const paragraphs = coverText.split('\n\n'); // Split into paragraphs for better handling
    for (let para of paragraphs) {
      const lines = para.split('\n');
      for (let line of lines) {
        const isBold = line.startsWith('U.S. Embassy') || line.startsWith('RE:') || line.startsWith('Dear') || line.startsWith('Respectfully') || line.startsWith('DOCUMENTS SUBMITTED:') || line.startsWith('ADDITIONAL INFORMATION:');
        const f = isBold ? boldFont : font;
        const size = isBold ? 12 : 11;
        y = drawWrappedText(coverPage, line, 50, y, size, f, 495, 15);
      }
      y -= 10; // Space between paragraphs
      if (y < 50) {
        coverPage = pdfDoc.addPage([595, 842]);
        y = 780;
      }
    }

    // Document Index Page
    const indexPage = pdfDoc.addPage([595, 842]);
    y = 780;
    const docs = getDocsList(actionPlanStages);
    const indexText = generateDocumentIndex(docs, coverLetterData);
    const indexLines = indexText.split('\n');
    const docStartPages: number[] = []; // To store 0-indexed start pages for each doc
    const lineHeights: {line: string, y: number}[] = []; // To track y positions for links

    indexPage.drawText('Document Index', { x: 50, y, size: 16, font: boldFont });
    y -= 30;
    for (const line of indexLines) {
      if (line.trim()) {
        y = drawWrappedText(indexPage, line, 50, y, 12, font, 495, 15);
        lineHeights.push({line, y: y + 15}); // Approximate for link rect
      }
      y -= 5;
      if (y < 50) {
        const newPage = pdfDoc.addPage([595, 842]);
        y = 780;
      }
    }

    // Merge uploaded documents and track start pages
    let docIndex = 0;
    for (const {docId} of docs) {
      if (uploadedDocs[docId]) {
        docStartPages[docIndex] = pdfDoc.getPageCount();
        for (const { file } of uploadedDocs[docId]) {
          try {
            const fileBuffer = await file.arrayBuffer();
            if (file.type === 'application/pdf') {
              const uploadedPdf = await PDFDocument.load(fileBuffer);
              const copiedPages = await pdfDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
              copiedPages.forEach((page) => pdfDoc.addPage(page));
            } else { // Image
              const img = file.type.includes('png') ? await pdfDoc.embedPng(fileBuffer) : await pdfDoc.embedJpg(fileBuffer);
              const page = pdfDoc.addPage();
              const scale = 0.5;
              const { width, height } = img.scale(scale);
              page.drawImage(img, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height });
            }
          } catch (error) {
            console.error('Error processing file:', error);
            continue;
          }
        }
      } else {
        // If no upload, still reserve a placeholder page or skip, but for link, set to index page or something
        docStartPages[docIndex] = 1; // Default to cover if missing
      }
      docIndex++;
    }

    // Add clickable links to index page
    const pages = pdfDoc.getPages();
    lineHeights.forEach(({line, y: lineY}, i) => {
      if (/^\d+\./.test(line)) { // Only for numbered doc lines
        const docIdx = parseInt(line.split('.')[0]) - 1;
        const targetPageIdx = docStartPages[docIdx];
        if (targetPageIdx !== undefined) {
          const targetPage = pages[targetPageIdx];
          const annotRef = pdfDoc.context.obj({});
          const annotDict = pdfDoc.context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [50, lineY - 5, 545, lineY + 10], // Approximate rect over the line
            Border: [0, 0, 0],
            C: [0, 0, 1], // Blue border for debug, remove in prod
            A: {
              Type: PDFName.of('Action'),
              S: PDFName.of('GoTo'),
              D: [targetPage.node, PDFName.of('Fit')]
            }
          });
          pdfDoc.context.register(annotRef, annotDict);
          let annots = indexPage.node.Annots();
          if (!annots) {
            annots = pdfDoc.context.obj([]);
            indexPage.node.set(PDFName.of('Annots'), annots);
          }
          annots.push(annotRef);
        }
      }
    });

    // Footer on all pages
    pages.forEach((page, i) => {
      page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 50, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
      page.drawText(`Page ${i + 1} of ${pages.length}`, { x: 450, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `221g_Packet_${coverLetterData.caseNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    localStorage.removeItem('221gActionPlanProgress');
  } catch (error) {
    console.error('Error generating PDF packet:', error);
    throw new Error('Failed to generate PDF packet');
  }
};

export { generateCoverLetter, getDocsList, generateDocumentIndex };