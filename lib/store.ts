// /lib/store.ts
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
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

interface PDFEditorStore {
  pdfFile: File | null;
  pdfDoc: PDFDocument | null;
  currentPage: number;
  totalPages: number;

  annotations: TextAnnotation[];
  signatureAnnotations: SignatureAnnotation[];

  // NEW: store processed signature image (dataURL) so any page can read it
  signatureImage: string | null;
  setSignatureImage: (img: string | null) => void;

  selectedAnnotation: string | null;

  setPdfFile: (file: File) => void;
  setPdfDoc: (doc: PDFDocument | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;

  addAnnotation: (annotation: TextAnnotation) => void;
  updateAnnotation: (id: string, updates: Partial<TextAnnotation>) => void;
  deleteAnnotation: (id: string) => void;
  getPageAnnotations: (pageIndex: number) => TextAnnotation[];

  addSignatureAnnotation: (signature: SignatureAnnotation) => void;
  updateSignatureAnnotation: (id: string, updates: Partial<SignatureAnnotation>) => void;
  deleteSignatureAnnotation: (id: string) => void;
  getPageSignatures: (pageIndex: number) => SignatureAnnotation[];

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
  signatureImage: null,
  selectedAnnotation: null,

  setSignatureImage: (img) => set({ signatureImage: img }),

  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfDoc: (doc) => set({ pdfDoc: doc }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),

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

  setSelectedAnnotation: (id) => set({ selectedAnnotation: id }),

  reset: () =>
    set({
      pdfFile: null,
      pdfDoc: null,
      currentPage: 0,
      totalPages: 0,
      annotations: [],
      signatureAnnotations: [],
      signatureImage: null,
      selectedAnnotation: null,
    }),
}));
