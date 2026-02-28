"use client";

import { useEffect, useRef } from "react";
import type { PDFPageProxy } from "../engine/pdfEngine";
import type { SearchMatch } from "../hooks/useSearchIndex";

type Props = {
  page: PDFPageProxy;
  scale: number;
  searchMatches?: SearchMatch[];
  activeMatchIndex?: number;
};

export default function TextLayer({
  page,
  scale,
  searchMatches = [],
  activeMatchIndex = -1,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textLayerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !page) return;

    let cancelled = false;

    async function render() {
      if (textLayerRef.current) {
        try {
          textLayerRef.current.cancel();
        } catch (e) {}
        textLayerRef.current = null;
      }
      container!.innerHTML = "";

      const viewport = page.getViewport({ scale });
      const textContent = await page.getTextContent();

      if (cancelled) return;

      const { TextLayer: PdfTextLayer } = await import("pdfjs-dist");
      if (!PdfTextLayer) return;

      container!.style.width = `${viewport.width}px`;
      container!.style.height = `${viewport.height}px`;
      container!.style.setProperty("--scale-factor", scale.toString());
      // Replicate what react-pdf and pdf_viewer.js expect
      // Usually --user-unit is 1 for standard PDFs
      container!.style.setProperty("--total-scale-factor", scale.toString());

      const textLayer = new PdfTextLayer({
        textContentSource: textContent,
        container: container!,
        viewport,
      });

      textLayerRef.current = textLayer;

      try {
        await textLayer.render();
        if (cancelled) return;

        // Apply highlights after render
        if (searchMatches.length > 0) {
          const divs = container!.children;
          searchMatches.forEach((match) => {
            const div = divs[match.itemIndex] as HTMLElement;
            if (!div) return;

            const originalText = div.textContent || "";
            // Ensure indices are within bounds
            if (match.charOffset < 0 || match.charOffset >= originalText.length)
              return;

            const needle = originalText.substring(
              match.charOffset,
              match.charOffset + match.length,
            );

            const before = originalText.substring(0, match.charOffset);
            const after = originalText.substring(
              match.charOffset + match.length,
            );
            const isActive = match.itemIndex === activeMatchIndex;

            div.innerHTML = `${before}<mark class="pdf-highlight ${
              isActive ? "active" : ""
            }">${needle}</mark>${after}`;
          });
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("[PDF] TextLayer render error:", err);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
      if (textLayerRef.current) {
        try {
          textLayerRef.current.cancel();
        } catch (e) {}
        textLayerRef.current = null;
      }
    };
  }, [page, scale, searchMatches, activeMatchIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
      className="textLayer"
    />
  );
}
