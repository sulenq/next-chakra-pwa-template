"use client";

import { usePdfiumEngine } from "@embedpdf/engines/react";
import type { PdfiumEngine } from "@embedpdf/engines";

/*
  Returns a nullable Pdfium engine so callers must handle loading/null.
  Comments in code: English only per your preference.
*/
export function usePDFEngine(): {
  engine: PdfiumEngine | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { engine, isLoading, error } = usePdfiumEngine();
  return {
    // normalize undefined -> null to make types explicit
    engine: (engine ?? null) as PdfiumEngine | null,
    isLoading,
    error: (error ?? null) as Error | null,
  };
}
