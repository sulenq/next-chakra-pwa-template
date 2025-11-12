"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import { StackProps } from "@chakra-ui/react";
import { Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Lazy load Viewer for SSR safety
const Viewer = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Viewer),
  { ssr: false }
);

interface Props extends StackProps {
  fileUrl?: string;
  aspectRatio?: number;
}

export function PDFViewer(props: Props) {
  const { fileUrl, aspectRatio = 10 / 12, ...restProps } = props;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const workerUrl = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — import raw worker source as string
      const workerSrc = require("pdfjs-dist/build/pdf.worker.min.js");
      const blob = new Blob([workerSrc], { type: "text/javascript" });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Failed to build PDF.js worker:", err);
      return "";
    }
  }, []);

  return (
    <CContainer w="full" aspectRatio={aspectRatio} {...restProps}>
      {fileUrl ? (
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      ) : (
        <FeedbackNotFound />
      )}
    </CContainer>
  );
}
