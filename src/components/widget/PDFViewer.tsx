"use client";

import { HStack, Icon, Skeleton, StackProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// react-pdf CSS
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import Spinner from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import FeedbackState from "@/components/widget/FeedbackState";
import HScroll from "@/components/widget/HScroll";
import useLang from "@/context/useLang";
import {
  IconArrowAutofitContent,
  IconArrowAutofitWidth,
  IconChevronLeft,
  IconChevronRight,
  IconFileOff,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

interface Props__PDFToolbar extends StackProps {
  utils: any;
  toggleMode: () => void;
  isSingleMode: boolean;
}
const Toolbar = (props: Props__PDFToolbar) => {
  // Props
  const { utils, toggleMode, isSingleMode, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Components
  const UtilBtn = (btnProps: any) => {
    const { tooltipContent, ...restProps } = btnProps;
    return (
      <Tooltip content={tooltipContent}>
        <Btn iconButton size={"sm"} variant={"ghost"} {...restProps} />
      </Tooltip>
    );
  };

  return (
    <HScroll className={"noScroll"} p={2} bg={"body"} {...restProps}>
      <HStack>
        <UtilBtn
          onClick={utils.prevPage}
          disabled={!isSingleMode}
          tooltipContent={l.previous_page}
        >
          <Icon boxSize={5}>
            <IconChevronLeft stroke={1.5} />
          </Icon>
        </UtilBtn>
        <UtilBtn
          onClick={utils.nextPage}
          disabled={!isSingleMode}
          tooltipContent={l.next_page}
        >
          <Icon boxSize={5}>
            <IconChevronRight stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn onClick={utils.zoomIn} tooltipContent={l.zoom_in}>
          <Icon boxSize={5}>
            <IconZoomIn stroke={1.5} />
          </Icon>
        </UtilBtn>
        <UtilBtn onClick={utils.zoomOut} tooltipContent={l.zoom_out}>
          <Icon boxSize={5}>
            <IconZoomOut stroke={1.5} />
          </Icon>
        </UtilBtn>
        <UtilBtn onClick={utils.resetZoom} tooltipContent={l.zoom_reset}>
          <Icon boxSize={5}>
            <IconZoomReset stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn onClick={utils.fitToWidth} tooltipContent={l.fit_to_width}>
          <Icon boxSize={5}>
            <IconArrowAutofitContent stroke={1.5} />
          </Icon>
        </UtilBtn>
        <UtilBtn onClick={utils.fitToPage} tooltipContent={l.fit_to_page}>
          <Icon boxSize={5}>
            <IconArrowAutofitWidth stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn
          iconButton={false}
          onClick={toggleMode}
          ml={"auto"}
          tooltipContent={"Mode"}
        >
          {isSingleMode ? "Single page" : "Scroll mode"}
        </UtilBtn>
      </HStack>
    </HScroll>
  );
};

interface Props__PdfViewer extends StackProps {
  fileUrl: string;
}
export const PdfViewer = (props: Props__PdfViewer) => {
  // Props
  const { fileUrl, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [isSingleMode, setIsSingleMode] = useState(true);
  const utils = {
    prevPage: () => setPageNumber((p) => Math.max(p - 1, 1)),
    nextPage: () => setPageNumber((p) => Math.min(p + 1, numPages || 1)),
    zoomIn: () => setScale((s) => Math.min(s + 0.1, 2)),
    zoomOut: () => setScale((s) => Math.max(s - 0.1, 0.5)),
    resetZoom: () => setScale(1),
    fitToWidth: () => setScale(1),
    fitToPage: () => setScale(1),
  };

  // Utils
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  function toggleMode() {
    setIsSingleMode(!isSingleMode);
  }

  // Prevent Hydration Mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {!isMounted && <Skeleton w={"full"} h={"full"} />}

      {isMounted && (
        <CContainer w={"full"} mx="auto" {...restProps}>
          {/* Toolbar */}
          <Toolbar
            utils={utils}
            isSingleMode={isSingleMode}
            toggleMode={toggleMode}
          />

          {/* Document Area */}
          <CContainer className={"scrollX scrollY"} minH={"500px"}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Spinner />}
              error={
                <FeedbackState
                  icon={<IconFileOff stroke={1.8} />}
                  title={l.alert_pdf_failed_to_load.title}
                  description={l.alert_pdf_failed_to_load.description}
                />
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={Math.min(
                  600,
                  typeof window !== "undefined" ? window.innerWidth - 60 : 600
                )}
                scale={scale}
              />
            </Document>
          </CContainer>
        </CContainer>
      )}
    </>
  );
};
