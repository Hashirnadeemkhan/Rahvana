/**
 * Font management utilities for PDF rendering
 */

export async function getFont(fontName: string) {
  // This would normally load fonts using pdf-lib
  // For now returning a basic mapping
  const fontMap: Record<string, null> = {
    Arial: null,
    Helvetica: null,
    "Times New Roman": null,
    "Courier New": null,
    Georgia: null,
  }

  return fontMap[fontName] || fontMap.Arial
}

export const AVAILABLE_FONTS = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia"]
