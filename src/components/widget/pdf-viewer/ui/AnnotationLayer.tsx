"use client";

import { useEffect, useRef } from "react";
import type { PDFPageProxy } from "../engine/pdfEngine";

type Props = {
  page: PDFPageProxy;
  scale: number;
};

export default function AnnotationLayer({ page, scale }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !page) return;

    let cancelled = false;

    async function render() {
      container!.innerHTML = "";
      const viewport = page.getViewport({ scale });
      const annotations = await page.getAnnotations();

      if (cancelled) return;

      const { AnnotationLayer: PdfAnnotationLayer } =
        await import("pdfjs-dist");
      if (!PdfAnnotationLayer) return;

      container!.style.width = `${viewport.width}px`;
      container!.style.height = `${viewport.height}px`;

      const annotationLayer = new PdfAnnotationLayer({
        div: container!,
        page,
        viewport,
        accessibilityManager: null,
        annotationCanvasMap: null,
        annotationEditorUIManager: null,
        structTreeLayer: null,
      });

      try {
        await annotationLayer.render({
          viewport,
          div: container!,
          annotations,
          page,
          linkService: {
            externalLinkTarget: null,
            externalLinkRel: null,
            externalLinkEnabled: true,
            getDestinationHash: () => "#",
            getAnchorUrl: () => "#",
            setHash: () => {},
            executeNamedAction: () => {},
            cachePageRef: () => {},
            isPageVisible: () => true,
            isCurrentPage: () => true,
          } as any,
          renderForms: true,
        });
      } catch (err) {
        console.error("[PDF] AnnotationLayer render error:", err);
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [page, scale]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none", // Annotations internally have pointer-events: auto on their children
      }}
      className="annotationLayer"
    />
  );
}
