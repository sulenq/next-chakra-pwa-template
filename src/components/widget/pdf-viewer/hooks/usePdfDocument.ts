import { useEffect, useRef, useState } from "react";
import {
  loadPdf,
  destroyPdf,
  type PDFDocumentProxy,
} from "../engine/pdfEngine";

type PdfDocumentState = {
  doc: PDFDocumentProxy | null;
  numPages: number;
  loading: boolean;
  error: string | null;
};

/**
 * Fetch a PDF from a URL and return the loaded document.
 * Automatically destroys the document on unmount or URL change.
 */
export function usePdfDocument(fileUrl: string): PdfDocumentState {
  const [state, setState] = useState<PdfDocumentState>({
    doc: null,
    numPages: 0,
    loading: true,
    error: null,
  });

  const docRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ doc: null, numPages: 0, loading: true, error: null });

      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        if (cancelled) return;

        const doc = await loadPdf(new Uint8Array(buf));

        if (cancelled) {
          doc.destroy();
          return;
        }

        docRef.current = doc;
        setState({
          doc,
          numPages: doc.numPages,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (!cancelled) {
          setState({
            doc: null,
            numPages: 0,
            loading: false,
            error: err?.message ?? "Failed to load PDF",
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      if (docRef.current) {
        destroyPdf(docRef.current);
        docRef.current = null;
      }
    };
  }, [fileUrl]);

  return state;
}
