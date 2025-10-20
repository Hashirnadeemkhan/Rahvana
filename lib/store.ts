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

interface PDFEditorStore {
  pdfFile: File | null;
  pdfDoc: PDFDocument | null;
  currentPage: number;
  totalPages: number;
  annotations: TextAnnotation[];
  selectedAnnotation: string | null;

  setPdfFile: (file: File) => void;
  setPdfDoc: (doc: PDFDocument | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  addAnnotation: (annotation: TextAnnotation) => void;
  updateAnnotation: (id: string, updates: Partial<TextAnnotation>) => void;
  deleteAnnotation: (id: string) => void;
  setSelectedAnnotation: (id: string | null) => void;
  getPageAnnotations: (pageIndex: number) => TextAnnotation[];
  reset: () => void;
}

export const usePDFStore = create<PDFEditorStore>((set, get) => ({
  pdfFile: null,
  pdfDoc: null,
  currentPage: 0,
  totalPages: 0,
  annotations: [],
  selectedAnnotation: null,

  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfDoc: (doc) => set({ pdfDoc: doc }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  addAnnotation: (annotation) => set((state) => ({ annotations: [...state.annotations, annotation] })),
  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann)),
    })),
  deleteAnnotation: (id) => set((state) => ({ annotations: state.annotations.filter((ann) => ann.id !== id) })),
  setSelectedAnnotation: (id) => set({ selectedAnnotation: id }),
  getPageAnnotations: (pageIndex) => get().annotations.filter((ann) => ann.pageIndex === pageIndex),
  reset: () =>
    set({
      pdfFile: null,
      pdfDoc: null,
      currentPage: 0,
      totalPages: 0,
      annotations: [],
      selectedAnnotation: null,
      addAnnotation: (annotation: TextAnnotation) => set((state) => ({
        annotations: [...state.annotations, annotation]
      })),
      updateAnnotation: (id: string, patch: Partial<TextAnnotation>) => set((state) => ({
        annotations: state.annotations.map(ann => 
          ann.id === id ? { ...ann, ...patch } : ann
        )
      })),
      deleteAnnotation: (id: string) => set((state) => ({
        annotations: state.annotations.filter(ann => ann.id !== id)
      })),
    }),
}));