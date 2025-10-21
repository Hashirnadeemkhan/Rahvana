import { create } from "zustand";
import type { PDFDocument } from "pdf-lib";

interface TextAnnotation {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

interface SignatureAnnotation {
  id: string;
  pageIndex: number;
  image: string; // Data URL of the signature image
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PDFEditorStore {
  pdfFile: File | null;
  pdfDoc: PDFDocument | null;
  currentPage: number;
  totalPages: number;

  annotations: TextAnnotation[];
  signatureAnnotations: SignatureAnnotation[];

  selectedAnnotation: string | null;

  // --- Setters ---
  setPdfFile: (file: File) => void;
  setPdfDoc: (doc: PDFDocument | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;

  // --- Text Annotations ---
  addAnnotation: (annotation: TextAnnotation) => void;
  updateAnnotation: (id: string, updates: Partial<TextAnnotation>) => void;
  deleteAnnotation: (id: string) => void;
  getPageAnnotations: (pageIndex: number) => TextAnnotation[];

  // --- Signature Annotations ---
  addSignatureAnnotation: (signature: SignatureAnnotation) => void;
  updateSignatureAnnotation: (id: string, updates: Partial<SignatureAnnotation>) => void;
  deleteSignatureAnnotation: (id: string) => void;
  getPageSignatures: (pageIndex: number) => SignatureAnnotation[];

  // --- Misc ---
  setSelectedAnnotation: (id: string | null) => void;
  reset: () => void;
}

export const usePDFStore = create<PDFEditorStore>((set, get) => ({
  pdfFile: null,
  pdfDoc: null,
  currentPage: 0,
  totalPages: 0,
  annotations: [],
  signatureAnnotations: [],
  selectedAnnotation: null,

  // --- Setters ---
  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfDoc: (doc) => set({ pdfDoc: doc }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),

  // --- Text Annotations ---
  addAnnotation: (annotation) =>
    set((state) => ({ annotations: [...state.annotations, annotation] })),
  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((ann) =>
        ann.id === id ? { ...ann, ...updates } : ann
      ),
    })),
  deleteAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((ann) => ann.id !== id),
    })),
  getPageAnnotations: (pageIndex) =>
    get().annotations.filter((ann) => ann.pageIndex === pageIndex),

  // --- Signature Annotations ---
  addSignatureAnnotation: (signature) =>
    set((state) => ({
      signatureAnnotations: [...state.signatureAnnotations, signature],
    })),
  updateSignatureAnnotation: (id, updates) =>
    set((state) => ({
      signatureAnnotations: state.signatureAnnotations.map((sig) =>
        sig.id === id ? { ...sig, ...updates } : sig
      ),
    })),
  deleteSignatureAnnotation: (id) =>
    set((state) => ({
      signatureAnnotations: state.signatureAnnotations.filter(
        (sig) => sig.id !== id
      ),
    })),
  getPageSignatures: (pageIndex) =>
    get().signatureAnnotations.filter((sig) => sig.pageIndex === pageIndex),

  // --- Misc ---
  setSelectedAnnotation: (id) => set({ selectedAnnotation: id }),
  reset: () =>
    set({
      pdfFile: null,
      pdfDoc: null,
      currentPage: 0,
      totalPages: 0,
      annotations: [],
      signatureAnnotations: [],
      selectedAnnotation: null,
    }),
}));
