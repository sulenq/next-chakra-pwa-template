import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api";
import type { RenderTask } from "pdfjs-dist/types/src/display/api";

/**
 * Render a PDF page onto a canvas element.
 * Supports HiDPI displays via devicePixelRatio.
 * Returns the RenderTask so callers can cancel if needed.
 */
export function renderPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  scale = 1,
): RenderTask {
  const viewport = page.getViewport({ scale });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  // Supersampling: Force minimum 2.5x resolution so the canvas feels like a native vector pdf
  const renderDpr = Math.max(dpr * 2, 2.5);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2d context is null");

  // Physical (pixel) size — sharp on HiDPI
  canvas.width = Math.floor(viewport.width * renderDpr);
  canvas.height = Math.floor(viewport.height * renderDpr);

  // CSS (layout) size
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  // Provide crisp edge rendering
  context.imageSmoothingEnabled = true;

  context.setTransform(renderDpr, 0, 0, renderDpr, 0, 0);

  // PDF.js v5 requires the `canvas` property in RenderParameters
  return page.render({
    // canvas,
    canvasContext: context,
    viewport,
  });
}

export type { RenderTask };
