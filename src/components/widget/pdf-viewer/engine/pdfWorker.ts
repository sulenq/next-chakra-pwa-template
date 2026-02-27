import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerPort = new Worker(
  new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
  { type: "module" },
);

export default pdfjs;
