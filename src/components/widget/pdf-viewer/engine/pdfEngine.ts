let pdfjs: any = null;

async function getPdfJs() {
  if (pdfjs) return pdfjs;

  if (typeof window === "undefined") {
    throw new Error("pdfjs must run in browser");
  }

  const mod = await import("pdfjs-dist/build/pdf.mjs");

  pdfjs = mod;

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  return pdfjs;
}

export type PdfDoc = any;

export async function loadPdf(data: Uint8Array) {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  return { doc };
}

export async function getPage(doc: PdfDoc, pageNumber: number) {
  return doc.getPage(pageNumber);
}

export function destroyPdf(doc: PdfDoc) {
  doc.destroy();
}
