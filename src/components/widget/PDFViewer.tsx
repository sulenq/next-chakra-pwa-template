"use client";

import { Box, HStack, Icon, StackProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// react-pdf CSS
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import Spinner from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import FeedbackState from "@/components/widget/FeedbackState";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import useLang from "@/context/useLang";
import {
  IconArrowAutofitContent,
  IconArrowAutofitWidth,
  IconFileOff,
} from "@tabler/icons-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  GalleryHorizontalIcon,
  GalleryVerticalIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Props__PdfViewer } from "@/constants/props";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const UtilBtn = (props: any) => {
  const { tooltipContent, ...restProps } = props;

  return (
    <Tooltip content={tooltipContent}>
      <Btn iconButton size={"sm"} variant={"ghost"} {...restProps} />
    </Tooltip>
  );
};
const PageJump = (props: any) => {
  // Props
  const { pageNumber, setPageNumber, numPages, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [gotoPage, setGotoPage] = useState<number | null>(null);

  // Utils
  function handleJumpPage(gotoPage: number | null) {
    if (gotoPage && gotoPage > 0 && gotoPage <= numPages) {
      console.debug(gotoPage);
      setPageNumber(gotoPage);
    }
  }

  return (
    <MenuRoot
      positioning={{
        placement: "bottom",
      }}
    >
      <MenuTrigger asChild>
        <Btn
          px={2}
          variant={"ghost"}
          fontWeight={"medium"}
          whiteSpace={"nowrap"}
          fontVariantNumeric={"tabular-nums"}
          {...restProps}
        >
          {pageNumber} / {numPages || "?"}
        </Btn>
      </MenuTrigger>

      <MenuContent p={0}>
        <CContainer gap={2} p={2}>
          <P fontSize={"sm"} fontWeight={"medium"} color={"fg.subtle"}>
            Go to page
          </P>

          <NumInput
            inputValue={gotoPage}
            onChange={(inputValue) => {
              setGotoPage(inputValue);
            }}
            max={numPages}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJumpPage(gotoPage);
            }}
          />

          <Btn
            colorPalette={themeConfig.colorPalette}
            disabled={gotoPage === null}
            onClick={() => {
              handleJumpPage(gotoPage);
            }}
          >
            Go
          </Btn>
        </CContainer>
      </MenuContent>
    </MenuRoot>
  );
};

interface Props__PDFToolbar extends StackProps {
  utils: any;
  toggleMode: () => void;
  isSingleMode: boolean;
  pageNumber: number;
  setPageNumber: React.Dispatch<number>;
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
    setPageNumber,
    numPages,
    scale,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  return (
    <HScroll className={"noScroll"} bg={"body"} {...restProps}>
      <HStack minW={"full"} w={"max"} gap={2} p={2}>
        {isSingleMode && (
          <HStack gap={1}>
            <UtilBtn
              onClick={utils.prevPage}
              disabled={!isSingleMode || pageNumber <= 1}
              tooltipContent={l.previous_page}
            >
              <Icon boxSize={5}>
                <LucideIcon icon={ChevronLeftIcon} />
              </Icon>
            </UtilBtn>

            {/* Page Indicator */}
            <PageJump
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              numPages={numPages}
            />

            <UtilBtn
              onClick={utils.nextPage}
              disabled={!isSingleMode || pageNumber >= (numPages || 1)}
              tooltipContent={l.next_page}
            >
              <Icon boxSize={5}>
                <LucideIcon icon={ChevronRightIcon} />
              </Icon>
            </UtilBtn>
          </HStack>
        )}

        <UtilBtn onClick={utils.zoomOut} tooltipContent={l.zoom_out}>
          <Icon boxSize={5}>
            <LucideIcon icon={ZoomOutIcon} />
          </Icon>
        </UtilBtn>

        {/* Scale Indicator */}
        <Box minW={"35px"} textAlign={"center"}>
          {Math.round(scale * 100)}%
        </Box>

        <UtilBtn onClick={utils.zoomIn} tooltipContent={l.zoom_in}>
          <Icon boxSize={5}>
            <LucideIcon icon={ZoomInIcon} />
          </Icon>
        </UtilBtn>

        {/* <UtilBtn onClick={utils.resetZoom} tooltipContent={l.zoom_reset}>
          <Icon boxSize={5}>
            <IconZoomReset  />
          </Icon>
        </UtilBtn> */}

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
          onClick={utils.handleDownload}
          tooltipContent={"Download"}
          ml={"auto"}
        >
          <Icon boxSize={5}>
            <LucideIcon icon={DownloadIcon} />
          </Icon>
        </UtilBtn>
        <UtilBtn
          iconButton={false}
          onClick={toggleMode}
          tooltipContent={"Mode"}
        >
          <Icon boxSize={5}>
            {isSingleMode ? (
              <LucideIcon icon={GalleryHorizontalIcon} />
            ) : (
              <LucideIcon icon={GalleryVerticalIcon} />
            )}
          </Icon>
          {isSingleMode ? "Single" : "Scroll"}
        </UtilBtn>
      </HStack>
    </HScroll>
  );
};

export const PDFViewer = (props: Props__PdfViewer) => {
  // Props
  const { fileUrl, fileName, ...restProps } = props;

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
    fitToWidth: () => setScale(1),
    fitToPage: () => setScale(0.6),
    handleDownload: handleDownload,
  };

  // Utils
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  function toggleMode() {
    setIsSingleMode(!isSingleMode);
    setScale(1);
  }
  async function handleDownload() {
    const response = await fetch(fileUrl, {
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download =
      fileName ||
      decodeURIComponent(fileUrl.split("/").pop() || "download.pdf");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
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
    <CContainer
      flex={1}
      w={"full"}
      h={"full"}
      aspectRatio={3 / 4.5}
      {...restProps}
    >
      {/* Toolbar */}
      <Toolbar
        utils={utils}
        isSingleMode={isSingleMode}
        toggleMode={toggleMode}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        numPages={numPages}
        scale={scale}
        flexShrink={0}
        // borderBottom={"1px solid"}
        borderColor={"border.muted"}
      />

      {/* Document Area */}
      <CContainer
        ref={containerRef}
        className={"scrollX scrollYAlt"}
        flex={1}
        minH={"200px"}
        bg={"gray.subtle"}
        m={"auto"}
        position={"relative"}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Spinner />}
          error={
            <FeedbackState
              icon={<IconFileOff stroke={1.8} />}
              title={l.alert_pdf_failed_to_load.title}
              description={l.alert_pdf_failed_to_load.description}
              m={"auto"}
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
