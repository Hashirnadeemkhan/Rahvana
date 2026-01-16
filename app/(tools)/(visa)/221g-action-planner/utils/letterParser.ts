import Tesseract from 'tesseract.js';

export async function parse221gLetter(file: File): Promise<string[]> {
  try {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => console.log(m), // For debugging
      }
    );

    // Detect checkboxes and items (simple pattern matching)
    const lines = text.split('\n').map(line => line.trim());
    const items: string[] = [];
    lines.forEach(line => {
      if (line.includes('[x]') || line.includes('checked')) { // Detect checked boxes
        const item = line.replace(/\[x\]/gi, '').trim().toUpperCase().replace(/\s+/g, '_');
        if (item) items.push(item); // e.g., 'BIRTH_CERT', 'FINANCIAL_DOCUMENTS'
      }
    });

    // Flag blurry if confidence low (Tesseract provides confidence)
    if (text.length < 100) { // Simple blurry check (short text = poor scan)
      throw new Error('Blurry scan');
    }

    return items;
  } catch (error) {
    throw new Error('Parsing failed - blurry or invalid file');
  }
}