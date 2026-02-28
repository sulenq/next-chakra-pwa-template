import type {
  PDFDocumentProxy,
  PDFPageProxy,
  TextContent,
} from "pdfjs-dist/types/src/display/api";

let initialized = false;

async function getPdfJs() {
  if (typeof window === "undefined") return null;

  const pdfjs = await import("pdfjs-dist");

  if (!initialized) {
    // Use matching CDN worker to avoid local file mismatch
    const version = "5.3.93";
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
    initialized = true;
  }

  return pdfjs;
}

// ── Load document ──────────────────────────────────────────────

export async function loadPdf(data: Uint8Array): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js cannot be loaded on the server");

  try {
    const loadingTask = pdfjs.getDocument({
      data,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    return loadingTask.promise;
  } catch (e) {
    console.error("[PDF] Error in getDocument:", e);
    throw e;
  }
}

// ── Page helpers ───────────────────────────────────────────────

export async function getPage(
  doc: PDFDocumentProxy,
  pageNumber: number,
): Promise<PDFPageProxy> {
  return doc.getPage(pageNumber);
}

export async function getPageTextContent(
  page: PDFPageProxy,
): Promise<TextContent> {
  return page.getTextContent();
}

// ── Cleanup ────────────────────────────────────────────────────

export function destroyPdf(doc: PDFDocumentProxy) {
  doc.destroy();
}

export type { PDFDocumentProxy, PDFPageProxy, TextContent };
