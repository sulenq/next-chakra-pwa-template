"use client";

import { useEffect, useRef } from "react";

type Props = {
  fileUrl: string;
};

export default function PdfViewer({ fileUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let doc: any;

    async function run() {
      console.debug("[PDF] start load", fileUrl);

      const engine = await import("./engine/pdfEngine");
      const renderer = await import("./engine/renderPage");

      const res = await fetch(fileUrl);
      const buf = await res.arrayBuffer();

      console.debug("[PDF] fetched bytes", buf.byteLength);

      const { doc: loaded } = await engine.loadPdf(new Uint8Array(buf));
      doc = loaded;

      console.debug("[PDF] loaded", doc.numPages, "pages");

      const page = await engine.getPage(doc, 1);
      console.debug("[PDF] got page");

      if (canvasRef.current) {
        await renderer.renderPage(page, canvasRef.current, 1.5);
      }

      console.debug("[PDF] render finished");
    }

    run();

    return () => {
      if (doc) doc.destroy();
    };
  }, [fileUrl]);

  return <canvas ref={canvasRef} />;
}
