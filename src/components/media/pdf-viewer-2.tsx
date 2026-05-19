"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Menu } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Spinner } from "@/components/ui/spinner";
import { StackH } from "@/components/ui/stack";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/branding/app-icon";
import FeedbackState from "@/components/feedback/feedback-state";
import { HScroll } from "@/components/container/h-scroll";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { Box, Icon, StackProps } from "@chakra-ui/react";
import {
  IconArrowAutofitHeight,
  IconArrowAutofitWidth,
  IconDownload,
  IconFile,
  IconFileOff,
  IconFiles,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type Type__PdfLoadPhase = "loading" | "rendering" | "ready";

export interface Interface__PdfViewer {
  pageWidth: number;
  numPages: number | null;
  page: number;
  scale: number;
  mode: "single" | "continuous";
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
  fitToHeight: () => void;
  handleDownload: () => void;
  toggleMode: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface Props__UtilBtn extends BtnProps {
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
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

  // States
  const [gotoPage, setGotoPage] = useState<number | null>(null);

  // Utils
  function handleJumpPage(gotoPage: number | null) {
    if (gotoPage && gotoPage > 0 && gotoPage <= numPages) {
      utils.setPage(gotoPage);
    }
  }

  return (
    <StackH {...restProps}>
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
            px={2}
            variant={"ghost"}
            fontWeight={"medium"}
            whiteSpace={"nowrap"}
            size={"sm"}
            fontVariantNumeric={"tabular-nums"}
          >
            {page} / {numPages || "?"}
          </Btn>
        </Menu.Trigger>

        <Menu.Content p={0} minW={"100px"} maxW={"100px"}>
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
              colorPalette={themeContext.colorPalette}
              disabled={gotoPage === null}
              onClick={() => {
                handleJumpPage(gotoPage);
              }}
            >
              Go
            </Btn>
          </CContainer>
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

interface Props__ZoomControl extends StackProps {
  scale: number;
  utils: Interface__PdfViewerUtils;
}
const ZoomControl = (props: Props__ZoomControl) => {
  // Props
  const { utils, scale, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();

  return (
    <StackH {...restProps}>
      <UtilBtn onClick={utils.zoomOut} tooltipContent={t.zoom_out}>
        <Icon boxSize={5}>
          <IconZoomOut stroke={1.5} />
        </Icon>
      </UtilBtn>

      <Box minW={"45px"} textAlign={"center"}>
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

      <UtilBtn onClick={utils.fitToHeight} tooltipContent={"Fit to Page"}>
        <Icon boxSize={5}>
          <IconArrowAutofitHeight stroke={1.5} />
        </Icon>
      </UtilBtn>
    </StackH>
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
      <StackH minW={"full"} w={"max"} p={2}>
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
          {viewer.mode === "continuous" && "Scroll"}
        </UtilBtn>
      </StackH>
    </HScroll>
  );
};

export interface Props__PdfViewer extends StackProps {
  fileUrl: string;
  fileName?: string;
  toolBarProps?: Props__PDFToolbar;
  defaultMode?: "single" | "continuous";
}

export const PdfViewer = (props: Props__PdfViewer) => {
  // Props
  const {
    fileUrl,
    fileName,
    toolBarProps,
    defaultMode = "continuous",
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  // States
  const [viewer, setViewer] = useState<Interface__PdfViewer>({
    pageWidth: 0,
    numPages: null as number | null,
    page: 1,
    scale: 1,
    mode: defaultMode,
  });

  const [pdfInfo, setPdfInfo] = useState<{
    originalWidth: number;
    originalHeight: number;
  } | null>(null);
  const [loadState, setLoadState] = useState<{
    phase: Type__PdfLoadPhase;
    progress: number;
  }>({
    phase: "loading",
    progress: 0,
  });

  const utils: Interface__PdfViewerUtils = {
    setPageWidth: (width: number) =>
      setViewer((ps) => ({ ...ps, pageWidth: width })),

    setPage: (p: number) => {
      setViewer((ps) => ({ ...ps, page: p }));
      // Scroll ke halaman yang dipilih di continuous mode
      if (viewer.mode === "continuous") {
        setTimeout(() => {
          const pageElement = documentRef.current?.querySelector(
            `[data-page-number="${p}"]`,
          );
          pageElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    },

    prevPage: () =>
      setViewer((ps) => ({ ...ps, page: Math.max(ps.page - 1, 1) })),

    nextPage: () =>
      setViewer((ps) => ({
        ...ps,
        page: Math.min(ps.page + 1, ps.numPages || 1),
      })),

    zoomIn: () =>
      setViewer((ps) => ({ ...ps, scale: Math.min(ps.scale + 0.25, 3) })),

    zoomOut: () =>
      setViewer((ps) => ({ ...ps, scale: Math.max(ps.scale - 0.25, 0.25) })),

    resetZoom: () => setViewer((ps) => ({ ...ps, scale: 1 })),

    fitToWidth: () => {
      // Reset scale ke 1, width mengikuti container
      setViewer((ps) => ({ ...ps, scale: 1 }));
    },

    fitToHeight: () => {
      // Scale agar satu halaman muat di viewport
      if (containerRef.current && pdfInfo) {
        const containerHeight = containerRef.current.clientHeight - 80; // minus toolbar
        const scale = containerHeight / pdfInfo.originalHeight;
        setViewer((ps) => ({
          ...ps,
          scale: Math.max(0.5, Math.min(scale, 2)),
        }));
      }
    },

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
        mode: v.mode === "single" ? "continuous" : "single",
      })),
  };

  // Resize Observer - update pageWidth sesuai container
  useEffect(() => {
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

  useEffect(() => {
    setViewer((ps) => ({
      ...ps,
      numPages: null,
      page: 1,
    }));
    setPdfInfo(null);
    setLoadState({
      phase: "loading",
      progress: 0,
    });
  }, [fileUrl]);

  // Simpan info PDF untuk fitToHeight
  const handleLoadSuccess = useCallback((pdf: any) => {
    setViewer((v) => ({ ...v, numPages: pdf.numPages }));
    setLoadState((prev) => ({
      phase: "rendering",
      progress: Math.max(prev.progress, 92),
    }));
    // Ambil ukuran halaman pertama
    pdf.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 });
      setPdfInfo({
        originalWidth: viewport.width,
        originalHeight: viewport.height,
      });
    });
  }, []);

  const handleLoadProgress = useCallback(
    (progressData: { loaded: number; total: number }) => {
      if (!progressData?.total) return;

      const nextProgress = Math.min(
        90,
        Math.round((progressData.loaded / progressData.total) * 100),
      );

      setLoadState((prev) => {
        if (prev.phase === "ready") return prev;
        return {
          ...prev,
          progress: Math.max(prev.progress, nextProgress),
        };
      });
    },
    [],
  );

  const handlePageRenderSuccess = useCallback(() => {
    setLoadState((prev) => {
      if (prev.phase === "ready") return prev;
      return {
        phase: "ready",
        progress: 100,
      };
    });
  }, []);

  // Update current page saat scroll di continuous mode
  useEffect(() => {
    if (viewer.mode !== "continuous" || !documentRef.current) return;

    const handleScroll = () => {
      if (!documentRef.current) return;

      const pages = documentRef.current.querySelectorAll("[data-page-number]");
      const containerRect = documentRef.current.getBoundingClientRect();
      const containerMiddle = containerRect.top + containerRect.height / 2;

      let closestPage = 1;
      let closestDistance = Infinity;

      pages.forEach((page) => {
        const pageRect = page.getBoundingClientRect();
        const pageMiddle = pageRect.top + pageRect.height / 2;
        const distance = Math.abs(containerMiddle - pageMiddle);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = parseInt(page.getAttribute("data-page-number") || "1");
        }
      });

      setViewer((ps) => {
        if (ps.page !== closestPage) {
          return { ...ps, page: closestPage };
        }
        return ps;
      });
    };

    const container = documentRef.current;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewer.mode]);

  return (
    <CContainer flex={1} w={"full"} h={"full"} overflow={"clip"} {...restProps}>
      {/* Toolbar */}
      <Toolbar utils={utils} viewer={viewer} flexShrink={0} {...toolBarProps} />

      {/* Document Area - Horizontal & Vertical Scroll + Grab to Pan */}
      <CContainer
        ref={containerRef}
        className={"scrollX scrollY"}
        flex={1}
        minH={"200px"}
        bg={"bg.muted"}
        p={2}
        position={"relative"}
        overflow={"auto"}
        cursor={"grab"}
        css={{
          "&:active": {
            cursor: "grabbing",
          },
          userSelect: "none",
        }}
        onMouseDown={(e) => {
          // Don't intercept clicks on toolbar buttons or interactive elements
          const target = e.target as HTMLElement;
          if (
            target.closest("button") ||
            target.closest("a") ||
            target.closest("input") ||
            target.closest("[role='menu']") ||
            target.closest("[data-scope='popover']")
          )
            return;

          const container = e.currentTarget;
          const startX = e.clientX;
          const startY = e.clientY;
          const scrollLeft = container.scrollLeft;
          const scrollTop = container.scrollTop;

          const onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            container.scrollLeft = scrollLeft - dx;
            container.scrollTop = scrollTop - dy;
          };
          const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };
          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      >
        {loadState.phase !== "ready" && (
          <CContainer
            position={"absolute"}
            inset={0}
            zIndex={1}
            align={"center"}
            justify={"center"}
            borderRadius={"lg"}
            pointerEvents={"none"}
            gap={4}
            px={6}
          >
            <Spinner />

            <CContainer gap={2} maxW={"360px"} w={"full"} align={"center"}>
              <P fontWeight={"medium"}>
                {loadState.phase === "loading"
                  ? "Memuat PDF..."
                  : "Merender halaman PDF..."}
              </P>

              <P fontSize={"sm"} color={"fg.subtle"} textAlign={"center"}>
                {loadState.progress}% selesai
              </P>

              <Box
                w={"full"}
                h={"8px"}
                bg={"whiteAlpha.200"}
                rounded={"full"}
                overflow={"hidden"}
              >
                <Box
                  h={"full"}
                  w={`${loadState.progress}%`}
                  bg={`${themeContext.colorPalette}.solid`}
                  transition={"width 180ms ease"}
                />
              </Box>
            </CContainer>
          </CContainer>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadProgress={handleLoadProgress}
          loading={null}
          error={
            <FeedbackState
              icon={<IconFileOff stroke={1.8} />}
              title={t.alert_pdf_failed_to_load.title}
              description={t.alert_pdf_failed_to_load.description}
            />
          }
        >
          <Box ref={documentRef}>
            {viewer.pageWidth > 0 && (
              <>
                {viewer.mode === "single" && (
                  // Single Mode - dengan horizontal scroll saat zoom
                  <Box minW={"max-content"} mx={"auto"}>
                    <Page
                      pageNumber={viewer.page}
                      onRenderSuccess={handlePageRenderSuccess}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      width={viewer.pageWidth * viewer.scale}
                      scale={1}
                    />
                  </Box>
                )}

                {viewer.mode === "continuous" && (
                  // Scroll Mode - scroll vertical dengan horizontal scroll saat zoom
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    gap={4}
                    minW={"full"}
                  >
                    {Array.from(
                      { length: viewer.numPages || 0 },
                      (_, index) => index + 1,
                    ).map((pageNumber) => (
                      <Box
                        key={`page_${pageNumber}`}
                        data-page-number={pageNumber}
                      >
                        <Page
                          pageNumber={pageNumber}
                          onRenderSuccess={handlePageRenderSuccess}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          width={viewer.pageWidth * viewer.scale}
                          scale={1}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Document>
      </CContainer>
    </CContainer>
  );
};
