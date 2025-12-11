
// import { MultiFormatConverter } from "../components/pdf/multi-format-converter"
import PDFConverterApp from "../components/pdf/multi-format-converter"
/**
 * Home Page - Multi-Format PDF Converter Application
 * Supports: Text, HTML, Markdown, Images (JPG/PNG/WebP/GIF/BMP), Word (DOCX)
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Universal PDF Converter</h1>
            <p className="text-muted-foreground">
              Convert any format to PDF - Text, Images, HTML, Markdown, Word documents
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* <MultiFormatConverter /> */}
        <PDFConverterApp/>
      </div>

      {/* Footer Section */}
      <div className="border-t border-border bg-card/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Fast, secure, and privacy-focused. Your files are processed server-side and never stored.</p>
          <p className="mt-2">Built with Next.js 16, PDFKit, and Sharp for optimal performance.</p>
        </div>
      </div>
    </main>
  )
}
