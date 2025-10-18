// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Upload, Trash2, Download } from "lucide-react"
// import { PDFDocument } from "pdf-lib"
// import { loadPDF, savePDF } from "@/lib/pdf-utils"

// interface MergePDFsProps {
//   onBack: () => void
// }

// export function MergePDFs({ onBack }: MergePDFsProps) {
//   const [files, setFiles] = useState<File[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || [])
//     setFiles((prev) => [...prev, ...selectedFiles])
//   }

//   const handleRemoveFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleMerge = async () => {
//     if (files.length < 2) {
//       alert("Please select at least 2 PDF files to merge")
//       return
//     }

//     setIsLoading(true)
//     try {
//       const mergedPdf = await PDFDocument.create()

//       for (const file of files) {
//         const pdf = await loadPDF(file)
//         const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
//         copiedPages.forEach((page) => mergedPdf.addPage(page))
//       }

//       const pdfBytes = await savePDF(mergedPdf)
//       const blob = new Blob([pdfBytes], { type: "application/pdf" })
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement("a")
//       link.href = url
//       link.download = "merged-document.pdf"
//       link.click()
//       URL.revokeObjectURL(url)

//       setFiles([])
//       alert("PDFs merged successfully!")
//     } catch (error) {
//       console.error("Error merging PDFs:", error)
//       alert("Error merging PDFs")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
//       <div className="max-w-4xl mx-auto p-6">
//         <Button onClick={onBack} variant="ghost" className="mb-6 gap-2">
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>

//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge PDFs</h1>
//           <p className="text-gray-600 mb-8">Combine multiple PDF files into a single document</p>

//           <div className="space-y-6">
//             <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
//               <Upload className="h-12 w-12 text-purple-500 mx-auto mb-4" />
//               <p className="text-gray-700 font-medium mb-2">Click to upload or drag and drop</p>
//               <p className="text-sm text-gray-500 mb-4">PDF files only</p>
//               <input type="file" multiple accept=".pdf" onChange={handleFileSelect} className="hidden" id="pdf-input" />
//               <label htmlFor="pdf-input">
//                 <Button asChild variant="outline" className="cursor-pointer bg-transparent">
//                   <span>Select Files</span>
//                 </Button>
//               </label>
//             </div>

//             {files.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="font-semibold text-gray-900">Selected Files ({files.length})</h3>
//                 <div className="space-y-2 max-h-64 overflow-y-auto">
//                   {files.map((file, index) => (
//                     <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
//                       <span className="text-sm text-gray-700">{file.name}</span>
//                       <Button onClick={() => handleRemoveFile(index)} variant="ghost" size="sm" className="h-6 w-6 p-0">
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <Button
//               onClick={handleMerge}
//               disabled={files.length < 2 || isLoading}
//               className="w-full bg-purple-600 hover:bg-purple-700 gap-2 py-6 text-base"
//             >
//               <Download className="h-5 w-5" />
//               {isLoading ? "Merging..." : "Merge PDFs"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
