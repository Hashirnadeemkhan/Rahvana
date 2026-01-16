import { PDFDocument, StandardFonts, rgb, PDFName, PDFDict, PDFArray } from 'pdf-lib';
import { generateRequiredDocumentsList, DocumentItem } from './documentDefinitions';
import { FormSelections } from '../types/221g';

interface PDFGeneratorOptions {
  coverLetterData: {
    applicantName: string;
    caseNumber: string;
    interviewDate: string;
    embassy: string;
    additionalNotes: string;
  };
  selectedItems: FormSelections;
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

const generateCoverLetter = (coverLetterData: PDFGeneratorOptions['coverLetterData'], documents: DocumentItem[]) => {
  const docsList = documents.map((doc, i) => `${i + 1}. ${doc.name}`).join('\n');

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

const generateDocumentIndex = (docs: DocumentItem[], coverLetterData: PDFGeneratorOptions['coverLetterData']) => {
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
    const { coverLetterData, selectedItems, uploadedDocs } = options;
    
    // Generate the list of required documents using the shared utility
    // This ensures IDs match what's in uploadedDocs
    const docs = generateRequiredDocumentsList(selectedItems);
    
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Cover Letter Page
    let coverPage = pdfDoc.addPage([595, 842]); // A4 size
    let y = 780;
    let coverText = generateCoverLetter(coverLetterData, docs);
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
    const indexText = generateDocumentIndex(docs, coverLetterData);
    const indexLines = indexText.split('\n');
    const docStartPages: number[] = []; // To store 0-indexed start pages for each doc
    const lineHeights: {line: string, y: number, pageIndex: number}[] = []; // To track y positions for links

    indexPage.drawText('Document Index', { x: 50, y, size: 16, font: boldFont });
    y -= 30;
    
    let currentIndexPage = indexPage;
    let currentIndexPageIndex = pdfDoc.getPageCount() - 1;

    for (const line of indexLines) {
      if (line.trim()) {
        y = drawWrappedText(currentIndexPage, line, 50, y, 12, font, 495, 15);
        lineHeights.push({line, y: y + 15, pageIndex: currentIndexPageIndex}); // Approximate for link rect
      }
      y -= 5;
      if (y < 50) {
        currentIndexPage = pdfDoc.addPage([595, 842]);
        currentIndexPageIndex = pdfDoc.getPageCount() - 1;
        y = 780;
      }
    }

    // Merge uploaded documents and track start pages
    let docIndex = 0;
    for (const doc of docs) {
      const docId = doc.id;
      if (uploadedDocs[docId] && uploadedDocs[docId].length > 0) {
        docStartPages[docIndex] = pdfDoc.getPageCount();
        
        // Add a separator page for the document
        const sepPage = pdfDoc.addPage([595, 842]);
        sepPage.drawText(doc.name, { x: 50, y: 421, size: 24, font: boldFont });
        
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
              const scale = Math.min(page.getWidth() / img.width, page.getHeight() / img.height, 1);
              const { width, height } = img.scale(scale);
              page.drawImage(img, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height });
            }
          } catch (error) {
            console.error('Error processing file:', error);
            continue;
          }
        }
      } else {
        // If no upload, point to index page (or maybe just don't link)
        docStartPages[docIndex] = currentIndexPageIndex; 
      }
      docIndex++;
    }

    // Add clickable links to index page
    const pages = pdfDoc.getPages();
    lineHeights.forEach(({line, y: lineY, pageIndex}, i) => {
      if (/^\d+\./.test(line)) { // Only for numbered doc lines
        const docIdx = parseInt(line.split('.')[0]) - 1;
        const targetPageIdx = docStartPages[docIdx];
        
        // Only create link if we have a valid target page (and it's not the index page itself, unless we want that)
        if (targetPageIdx !== undefined && targetPageIdx !== pageIndex) {
          const linkPage = pages[pageIndex];
          const targetPage = pages[targetPageIdx];
          
          const link = pdfDoc.context.register(
            pdfDoc.context.obj({
              Type: 'Annot',
              Subtype: 'Link',
              Rect: [50, lineY - 12, 500, lineY + 2],
              Border: [0, 0, 0],
              C: [0, 0, 1],
              A: {
                Type: 'Action',
                S: 'GoTo',
                D: [targetPage.ref, 'Fit'],
              },
            }),
          );

          let annots = linkPage.node.Annots();
          if (!annots) {
            annots = pdfDoc.context.obj([]);
            linkPage.node.set(PDFName.of('Annots'), annots);
          }
          annots.push(link);
        }
      }
    });

    // Footer on all pages
    const pageCount = pdfDoc.getPageCount();
    pages.forEach((page, i) => {
      page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 50, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
      page.drawText(`Page ${i + 1} of ${pageCount}`, { x: 450, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
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

export { generateCoverLetter };