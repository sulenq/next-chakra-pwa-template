import * as pdfjs from "pdfjs-dist";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
}

export default pdfjs;
