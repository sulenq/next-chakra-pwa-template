"use client";

import { Btn, Props__Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackState from "@/components/widget/FeedbackState";
import { HScroll } from "@/components/widget/HScroll";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, HStack, Icon, StackProps, VStack } from "@chakra-ui/react";
import {
  IconArrowAutofitWidth,
  IconDownload,
  IconFile,
  IconFileOff,
  IconFiles,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export interface Interface__PdfViewer {
  pageWidth: number;
  numPages: number | null;
  page: number;
  scale: number;
  mode: "single" | "scroll";
}
export interface Interface__PdfViewerUtils {
  setPageWidth: (width: number) => void;
  setPage: (p: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  handleDownload: () => void;
  toggleMode: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface Props__UtilBtn extends Props__Btn {
  tooltipContent: string;
}
const UtilBtn = (btnProps: Props__UtilBtn) => {
  const { tooltipContent, ...restProps } = btnProps;
  return (
    <Tooltip content={tooltipContent}>
      <Btn iconButton size={"sm"} variant={"ghost"} {...restProps} />
    </Tooltip>
  );
};

interface Props__PageControl extends Omit<StackProps, "page"> {
  page: number;
  numPages: number;
  utils: Interface__PdfViewerUtils;
}
const PageControl = (props: Props__PageControl) => {
  // Props
  const { utils, page, numPages, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [gotoPage, setGotoPage] = useState<number | null>(null);

  // Utils
  function handleJumpPage(gotoPage: number | null) {
    if (gotoPage && gotoPage > 0 && gotoPage <= numPages) {
      utils.setPage(gotoPage);
    }
  }

  return (
    <HStack gap={0} {...restProps}>
      <UtilBtn
        onClick={utils.prevPage}
        disabled={page <= 1}
        tooltipContent={l.previous_page}
      >
        <AppIcon icon={ChevronLeftIcon} />
      </UtilBtn>

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
          >
            {page} / {numPages || "?"}
          </Btn>
        </MenuTrigger>

        <MenuContent p={0} minW={"100px"} maxW={"100px"}>
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
              placeholder={""}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJumpPage(gotoPage);
              }}
              px={2}
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

      <UtilBtn
        onClick={utils.nextPage}
        disabled={page >= (numPages || 1)}
        tooltipContent={l.next_page}
      >
        <AppIcon icon={ChevronRightIcon} />
      </UtilBtn>
    </HStack>
  );
};

interface Props__ZoomControl extends StackProps {
  scale: number;
  utils: Interface__PdfViewerUtils;
}
const ZoomControl = (props: Props__ZoomControl) => {
  // Props
  const { utils, scale, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  return (
    <HStack gap={0} {...restProps}>
      <UtilBtn onClick={utils.zoomOut} tooltipContent={l.zoom_out}>
        <Icon boxSize={5}>
          <IconZoomOut stroke={1.5} />
        </Icon>
      </UtilBtn>

      <Box minW={"35px"} textAlign={"center"}>
        {Math.round(scale * 100)}%
      </Box>

      <UtilBtn onClick={utils.zoomIn} tooltipContent={l.zoom_in}>
        <Icon boxSize={5}>
          <IconZoomIn stroke={1.5} />
        </Icon>
      </UtilBtn>

      <UtilBtn onClick={utils.fitToWidth} tooltipContent={l.fit_to_width}>
        <Icon boxSize={5}>
          <IconArrowAutofitWidth stroke={1.5} />
        </Icon>
      </UtilBtn>

      {/* 
      <UtilBtn onClick={utils.fitToPage} tooltipContent={l.fit_to_page}>
        <Icon boxSize={5}>
          <IconArrowAutofitContent stroke={1.5} />
        </Icon>
      </UtilBtn> */}
    </HStack>
  );
};

interface Props__PDFToolbar extends StackProps {
  viewer: Interface__PdfViewer;
  utils: Interface__PdfViewerUtils;
}
const Toolbar = (props: Props__PDFToolbar) => {
  // Props
  const { viewer, utils, ...restProps } = props;

  return (
    <HScroll className={"noScroll"} bg={"body"} {...restProps}>
      <HStack minW={"full"} w={"max"} gap={0} p={2}>
        {viewer.mode === "single" && (
          <PageControl
            page={viewer.page}
            numPages={viewer.numPages || 0}
            utils={utils}
          />
        )}

        <ZoomControl scale={viewer.scale} utils={utils} />

        <UtilBtn
          onClick={utils.handleDownload}
          tooltipContent={"Download"}
          ml={"auto"}
        >
          <Icon boxSize={5}>
            <IconDownload />
          </Icon>
        </UtilBtn>

        <UtilBtn
          iconButton={false}
          onClick={utils.toggleMode}
          tooltipContent={"Mode"}
          pl={3}
        >
          <Icon boxSize={5}>
            {viewer.mode === "single" ? (
              <IconFile stroke={1.5} />
            ) : (
              <IconFiles stroke={1.5} />
            )}
          </Icon>

          {viewer.mode === "single" && "Single"}
          {viewer.mode === "scroll" && "Scroll"}
        </UtilBtn>
      </HStack>
    </HScroll>
  );
};

export interface Props__PdfViewer extends StackProps {
  fileUrl: string;
  fileName?: string;
}
export const PDFViewer = (props: Props__PdfViewer) => {
  // Props
  const { fileUrl, fileName, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [viewer, setViewer] = useState<Interface__PdfViewer>({
    pageWidth: 0,
    numPages: null as number | null,
    page: 1,
    scale: 1,
    mode: "single" as "single" | "scroll",
  });
  const utils: Interface__PdfViewerUtils = {
    setPageWidth: (width: number) =>
      setViewer((ps) => ({ ...ps, pageWidth: width })),

    setPage: (p: number) => setViewer((ps) => ({ ...ps, page: p })),

    prevPage: () =>
      setViewer((ps) => ({ ...ps, page: Math.max(ps.page - 1, 1) })),

    nextPage: () =>
      setViewer((ps) => ({
        ...ps,
        page: Math.min(ps.page + 1, ps.numPages || 1),
      })),

    zoomIn: () =>
      setViewer((ps) => ({ ...ps, scale: Math.min(ps.scale + 0.1, 3) })),

    zoomOut: () =>
      setViewer((ps) => ({ ...ps, scale: Math.max(ps.scale - 0.1, 0.5) })),

    resetZoom: () => setViewer((ps) => ({ ...ps, scale: 1 })),

    fitToWidth: () => setViewer((ps) => ({ ...ps, scale: 1 })),

    fitToPage: () => setViewer((ps) => ({ ...ps, scale: 0.6 })),

    handleDownload: async () => {
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
    },

    toggleMode: () =>
      setViewer((v) => ({
        ...v,
        mode: v.mode === "single" ? "scroll" : "single",
        scale: 1,
      })),
  };

  // Resize Observer
  useEffect(() => {
    // Logic auto-width 100% container
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        utils.setPageWidth(entries[0].contentRect.width);
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
      <Toolbar utils={utils} viewer={viewer} flexShrink={0} />

      {/* Document Area */}
      <CContainer
        ref={containerRef}
        className={"scrollX scrollY"}
        flex={1}
        minH={"200px"}
        bg={"d1"}
        p={2}
        m={"auto"}
        position={"relative"}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => {
            setViewer((v) => ({ ...v, numPages }));
          }}
          loading={<Spinner />}
          error={
            <FeedbackState
              icon={<IconFileOff stroke={1.8} />}
              title={l.alert_pdf_failed_to_load.title}
              description={l.alert_pdf_failed_to_load.description}
            />
          }
        >
          {viewer.pageWidth > 0 && (
            <>
              {viewer.mode === "single" && (
                // Single Mode
                <VStack minW={"full"} w={"max"}>
                  <Page
                    pageNumber={viewer.page}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={viewer.pageWidth}
                    scale={viewer.scale}
                  />
                </VStack>
              )}

              {viewer.mode === "scroll" && (
                // Scroll Mode
                <VStack
                  display={"flex"}
                  flexDirection={"column"}
                  minW={"full"}
                  w={"max"}
                  gap={4}
                >
                  {Array.from(new Array(viewer.numPages), (_, index) => (
                    <Box key={`page_${index + 1}`}>
                      <Page
                        pageNumber={index + 1}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        width={viewer.pageWidth}
                        scale={viewer.scale}
                      />
                    </Box>
                  ))}
                </VStack>
              )}
            </>
          )}
        </Document>
      </CContainer>
    </CContainer>
  );
};
