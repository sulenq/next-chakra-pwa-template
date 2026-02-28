"use client";

import { useEffect, useRef } from "react";
import type { PDFPageProxy } from "../engine/pdfEngine";
import { renderPage, type RenderTask } from "../engine/renderPage";

type Props = {
  page: PDFPageProxy;
  scale: number;
};

/**
 * Renders a single PDF page to a <canvas>.
 * Re-renders when scale changes, cancelling any in-progress render.
 */
export default function CanvasLayer({ page, scale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !page) return;

    // Cancel any previous render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const task = renderPage(page, canvas, scale);
    renderTaskRef.current = task;

    task.promise.catch((err: any) => {
      // RenderingCancelledException is expected when we cancel
      if (err?.name !== "RenderingCancelledException") {
        console.error("[PDF] render error:", err);
      }
    });

    return () => {
      task.cancel();
    };
  }, [page, scale]);

  return (
    <canvas ref={canvasRef} style={{ display: "block", background: "#fff" }} />
  );
}
