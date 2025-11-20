"use client";

import { Box, HStack, Icon, Skeleton, StackProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// react-pdf CSS
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Tooltip } from "@/components/ui/tooltip";
import FeedbackState from "@/components/widget/FeedbackState";
import HScroll from "@/components/widget/HScroll";
import useLang from "@/context/useLang";
import {
  IconArrowAutofitContent,
  IconArrowAutofitWidth,
  IconChevronLeft,
  IconChevronRight,
  IconFile,
  IconFileOff,
  IconFiles,
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
  pageNumber: number;
  numPages: number | null;
  scale: number;
}
const Toolbar = (props: Props__PDFToolbar) => {
  // Props
  const {
    utils,
    toggleMode,
    isSingleMode,
    pageNumber,
    numPages,
    scale,
    ...restProps
  } = props;

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
    <HScroll className={"noScroll"} bg={"body"} {...restProps}>
      <HStack minW={"full"} w={"max"} gap={2} p={2}>
        <HStack gap={0}>
          <UtilBtn
            onClick={utils.prevPage}
            disabled={!isSingleMode || pageNumber <= 1}
            tooltipContent={l.previous_page}
          >
            <Icon boxSize={5}>
              <IconChevronLeft stroke={1.5} />
            </Icon>
          </UtilBtn>

          {/* Page Indicator */}
          <Box fontWeight={"medium"} px={2} whiteSpace={"nowrap"}>
            {pageNumber} / {numPages || "--"}
          </Box>

          <UtilBtn
            onClick={utils.nextPage}
            disabled={!isSingleMode || pageNumber >= (numPages || 1)}
            tooltipContent={l.next_page}
          >
            <Icon boxSize={5}>
              <IconChevronRight stroke={1.5} />
            </Icon>
          </UtilBtn>
        </HStack>

        <UtilBtn onClick={utils.zoomOut} tooltipContent={l.zoom_out}>
          <Icon boxSize={5}>
            <IconZoomOut stroke={1.5} />
          </Icon>
        </UtilBtn>

        {/* Scale Indicator */}
        <Box minW={"35px"} textAlign={"center"}>
          {Math.round(scale * 100)}%
        </Box>

        <UtilBtn onClick={utils.zoomIn} tooltipContent={l.zoom_in}>
          <Icon boxSize={5}>
            <IconZoomIn stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn onClick={utils.resetZoom} tooltipContent={l.zoom_reset}>
          <Icon boxSize={5}>
            <IconZoomReset stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn onClick={utils.fitToWidth} tooltipContent={l.fit_to_width}>
          <Icon boxSize={5}>
            <IconArrowAutofitWidth stroke={1.5} />
          </Icon>
        </UtilBtn>
        <UtilBtn onClick={utils.fitToPage} tooltipContent={l.fit_to_page}>
          <Icon boxSize={5}>
            <IconArrowAutofitContent stroke={1.5} />
          </Icon>
        </UtilBtn>

        <UtilBtn
          iconButton={false}
          onClick={toggleMode}
          ml={"auto"}
          tooltipContent={"Mode"}
        >
          <Icon boxSize={5}>
            {isSingleMode ? (
              <IconFile stroke={1.5} />
            ) : (
              <IconFiles stroke={1.5} />
            )}
          </Icon>
          {isSingleMode ? "Single" : "Scroll"}
        </UtilBtn>
      </HStack>
    </HScroll>
  );
};

interface Props__PdfViewer extends StackProps {
  fileUrl: string;
}
export const PDFViewer = (props: Props__PdfViewer) => {
  // Props
  const { fileUrl, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isSingleMode, setIsSingleMode] = useState(true);

  // Width Responsive State
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const utils = {
    prevPage: () => setPageNumber((p) => Math.max(p - 1, 1)),
    nextPage: () => setPageNumber((p) => Math.min(p + 1, numPages || 1)),
    zoomIn: () => setScale((s) => Math.min(s + 0.1, 3)), // Max zoom 300%
    zoomOut: () => setScale((s) => Math.max(s - 0.1, 0.5)), // Min zoom 50%
    resetZoom: () => setScale(1),
    fitToWidth: () => setScale(1), // 100% container width
    fitToPage: () => setScale(0.6),
  };

  // Utils
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  function toggleMode() {
    setIsSingleMode(!isSingleMode);
    setScale(1);
  }

  // Resize Observer
  useEffect(() => {
    // Logic auto-width 100% container
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <CContainer flex={1} w={"full"} h={"full"} {...restProps}>
      {/* Toolbar */}
      <Toolbar
        utils={utils}
        isSingleMode={isSingleMode}
        toggleMode={toggleMode}
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        flexShrink={0}
      />

      {/* Document Area */}
      <CContainer
        ref={containerRef}
        className={"scrollX scrollYAlt"}
        flex={1}
        minH={"200px"}
        // bg={"d1"}
        p={2}
        m={"auto"}
        position={"relative"}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Skeleton flex={1} w={"full"} h={"full"} />}
          error={
            <FeedbackState
              icon={<IconFileOff stroke={1.8} />}
              title={l.alert_pdf_failed_to_load.title}
              description={l.alert_pdf_failed_to_load.description}
            />
          }
        >
          {containerWidth > 0 && (
            <>
              {isSingleMode && (
                // Single Mode
                <Box mx={"auto"} width={"fit-content"}>
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={containerWidth}
                    scale={scale}
                  />
                </Box>
              )}

              {!isSingleMode && (
                // Scroll Mode
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={4}
                  alignItems="center"
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <Box key={`page_${index + 1}`}>
                      <Page
                        pageNumber={index + 1}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        width={containerWidth}
                        scale={scale}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Document>
      </CContainer>
    </CContainer>
  );
};
