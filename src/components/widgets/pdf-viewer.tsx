"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Spinner } from "@/components/ui/spinner";
import { StackH, StackV } from "@/components/ui/stack";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import FeedbackState from "@/components/widgets/feedback-state";
import { ScrollH } from "@/components/widgets/scroll-h";
import { GAP } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { Box, Icon, StackProps, VStack } from "@chakra-ui/react";
import {
  IconArrowAutofitWidth,
  IconDownload,
  IconFile,
  IconFileOff,
  IconFiles,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { ArrowRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// -----------------------------------------------------------------

export interface Viewer {
  pageWidth: number;
  numPages: number | null;
  page: number;
  scale: number;
  mode: "single" | "scroll";
}

export interface PdfViewerUtils {
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

// -----------------------------------------------------------------

interface UtilBtnProps extends BtnProps {
  tooltipContent: string;
}

const UtilBtn = (btnProps: UtilBtnProps) => {
  const { tooltipContent, ...restProps } = btnProps;

  return (
    <Tooltip content={tooltipContent}>
      <Btn iconButton size={"sm"} variant={"ghost"} {...restProps} />
    </Tooltip>
  );
};

// -----------------------------------------------------------------

interface PageControlProps extends Omit<StackProps, "page"> {
  page: number;
  numPages: number;
  utils: PdfViewerUtils;
}

const PageControl = (props: PageControlProps) => {
  // Props
  const { utils, page, numPages, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  // States
  const [gotoPage, setGotoPage] = useState<number | null>(page);

  // Utils
  function handleJumpPage(gotoPage: number | null) {
    if (gotoPage && gotoPage > 0 && gotoPage <= numPages) {
      utils.setPage(gotoPage);
    }
  }

  // Sync page with goto page
  useEffect(() => {
    setGotoPage(page);
  }, [page]);

  return (
    <StackH align={"center"} gap={GAP} {...restProps}>
      <UtilBtn
        onClick={utils.prevPage}
        disabled={page <= 1}
        tooltipContent={t.previous_page}
      >
        <AppIconLucide icon={ChevronLeftIcon} />
      </UtilBtn>

      <Menu.Root
        positioning={{
          placement: "bottom",
        }}
      >
        <Menu.Trigger asChild>
          <Btn
            minW={"70px"}
            px={2}
            variant={"ghost"}
            fontWeight={"medium"}
            whiteSpace={"nowrap"}
            fontVariantNumeric={"tabular-nums"}
          >
            {page} / {numPages || "?"}
          </Btn>
        </Menu.Trigger>

        <Menu.Content p={0}>
          <StackV gap={2} p={2}>
            <P fontSize={"sm"} fontWeight={"medium"} color={"fg.subtle"}>
              Go to page
            </P>

            <StackH gap={GAP}>
              <NumInput
                inputValue={gotoPage}
                onChange={(inputValue) => {
                  setGotoPage(inputValue);
                }}
                max={numPages}
                placeholder={""}
                flex={1}
                w={"full"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJumpPage(gotoPage);
                }}
                px={"8px 32px"}
              />

              <Menu.Item
                asChild
                value={"submit"}
                w={"fit"}
                disabled={gotoPage === null}
                onClick={() => {
                  handleJumpPage(gotoPage);
                }}
              >
                <Btn iconButton variant={"outline"}>
                  <AppIconLucide icon={ArrowRight} />
                </Btn>
              </Menu.Item>
            </StackH>
          </StackV>
        </Menu.Content>
      </Menu.Root>

      <UtilBtn
        onClick={utils.nextPage}
        disabled={page >= (numPages || 1)}
        tooltipContent={t.next_page}
      >
        <AppIconLucide icon={ChevronRightIcon} />
      </UtilBtn>
    </StackH>
  );
};

// -----------------------------------------------------------------

interface ZoomControlProps extends StackProps {
  scale: number;
  utils: PdfViewerUtils;
}

const ZoomControl = (props: ZoomControlProps) => {
  // Props
  const { utils, scale, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <StackH align={"center"} gap={GAP} {...restProps}>
      <UtilBtn onClick={utils.zoomOut} tooltipContent={t.zoom_out}>
        <Icon boxSize={5}>
          <IconZoomOut stroke={1.5} />
        </Icon>
      </UtilBtn>

      <Box minW={"35px"} textAlign={"center"}>
        {Math.round(scale * 100)}%
      </Box>

      <UtilBtn onClick={utils.zoomIn} tooltipContent={t.zoom_in}>
        <Icon boxSize={5}>
          <IconZoomIn stroke={1.5} />
        </Icon>
      </UtilBtn>

      <UtilBtn onClick={utils.fitToWidth} tooltipContent={t.fit_to_width}>
        <Icon boxSize={5}>
          <IconArrowAutofitWidth stroke={1.5} />
        </Icon>
      </UtilBtn>

      {/* 
      <UtilBtn onClick={utils.fitToPage} tooltipContent={t.fit_to_page}>
        <Icon boxSize={5}>
          <IconArrowAutofitContent stroke={1.5} />
        </Icon>
      </UtilBtn> */}
    </StackH>
  );
};

// -----------------------------------------------------------------

interface PDFToolbarProps extends StackProps {
  viewer: Viewer;
  utils: PdfViewerUtils;
}

const Toolbar = (props: PDFToolbarProps) => {
  // Props
  const { viewer, utils, ...restProps } = props;

  return (
    <ScrollH className={"noScroll"} bg={"bg.body"} {...restProps}>
      <StackH minW={"full"} w={"max"} gap={GAP} p={2}>
        <PageControl
          page={viewer.page}
          numPages={viewer.numPages || 0}
          utils={utils}
        />

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
      </StackH>
    </ScrollH>
  );
};

// -----------------------------------------------------------------

export interface PdfViewerProps extends StackProps {
  fileUrl: string;
  fileName?: string;
}

export const PDFViewer = (props: PdfViewerProps) => {
  // Props
  const { fileUrl, fileName, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [viewer, setViewer] = useState<Viewer>({
    pageWidth: 0,
    numPages: null as number | null,
    page: 1,
    scale: 1,
    mode: "single" as "single" | "scroll",
  });
  const utils: PdfViewerUtils = {
    setPageWidth: (width: number) =>
      setViewer((ps) => ({ ...ps, pageWidth: width })),

    setPage: (p: number) =>
      setViewer((ps) => {
        if (ps.mode === "scroll") {
          setTimeout(() => {
            const container = containerRef.current;
            const pageElement = document.getElementById(`pdf_page_${p}`);
            if (container && pageElement) {
              const cRect = container.getBoundingClientRect();
              const pRect = pageElement.getBoundingClientRect();
              container.scrollTo({
                top: container.scrollTop + (pRect.top - cRect.top) - 8,
                behavior: "auto",
              });
            }
          }, 0);
        }
        return { ...ps, page: p };
      }),

    prevPage: () =>
      setViewer((ps) => {
        const p = Math.max(ps.page - 1, 1);
        if (ps.mode === "scroll") {
          setTimeout(() => {
            const container = containerRef.current;
            const pageElement = document.getElementById(`pdf_page_${p}`);
            if (container && pageElement) {
              const cRect = container.getBoundingClientRect();
              const pRect = pageElement.getBoundingClientRect();
              container.scrollTo({
                top: container.scrollTop + (pRect.top - cRect.top) - 8,
                behavior: "auto",
              });
            }
          }, 0);
        }
        return { ...ps, page: p };
      }),

    nextPage: () =>
      setViewer((ps) => {
        const p = Math.min(ps.page + 1, ps.numPages || 1);
        if (ps.mode === "scroll") {
          setTimeout(() => {
            const container = containerRef.current;
            const pageElement = document.getElementById(`pdf_page_${p}`);
            if (container && pageElement) {
              const cRect = container.getBoundingClientRect();
              const pRect = pageElement.getBoundingClientRect();
              container.scrollTo({
                top: container.scrollTop + (pRect.top - cRect.top) - 8,
                behavior: "auto",
              });
            }
          }, 0);
        }
        return { ...ps, page: p };
      }),

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

  // Intersection Observer for Scroll Mode
  useEffect(() => {
    if (viewer.mode !== "scroll" || !containerRef.current) return;

    let timeout: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageId = entry.target.id.replace("pdf_page_", "");
            if (pageId) {
              setViewer((ps) => ({ ...ps, page: Number(pageId) }));
            }
          }
        });
      },
      {
        root: containerRef.current,
        // Trigger when the element crosses the vertical center of the container
        rootMargin: "-50% 0px -50% 0px",
      },
    );

    const observePages = () => {
      if (!containerRef.current) return;
      const pages = containerRef.current.querySelectorAll("[id^='pdf_page_']");
      if (pages.length > 0) {
        pages.forEach((page) => observer.observe(page));
      } else {
        timeout = setTimeout(observePages, 200);
      }
    };

    observePages();

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [viewer.mode, viewer.numPages]);

  return (
    <StackV flex={1} w={"full"} h={"full"} {...restProps}>
      {/* Toolbar */}
      <Toolbar utils={utils} viewer={viewer} flexShrink={0} />

      {/* Document Area */}
      <StackV
        ref={containerRef}
        className={"scrollX scrollY"}
        flex={1}
        w={"full"}
        minH={"200px"}
        bg={"bg.muted"}
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
              title={t.alert_pdf_failed_to_load.title}
              description={t.alert_pdf_failed_to_load.description}
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
                    <Box key={`page_${index + 1}`} id={`pdf_page_${index + 1}`}>
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
      </StackV>
    </StackV>
  );
};
