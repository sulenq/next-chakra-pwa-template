"use client";

import { useCallback, useMemo, useRef } from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { usePdfDocument } from "./hooks/usePdfDocument";
import { useVirtualPages } from "./hooks/useVirtualPages";
import { useZoom } from "./hooks/useZoom";
import { useSearchIndex } from "./hooks/useSearchIndex";
import Toolbar from "./ui/Toolbar";
import PageContainer from "./ui/PageContainer";

import "pdfjs-dist/web/pdf_viewer.css";

type Props = {
  fileUrl: string;
};

export default function PdfViewer({ fileUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── Core hooks ──────────────────────────────────────────────
  const { doc, numPages, loading, error } = usePdfDocument(fileUrl);

  const { scale, zoomIn, zoomOut, resetZoom } = useZoom(1);

  const { visiblePages, registerSentinel } = useVirtualPages(containerRef, {
    numPages,
    overscan: 2,
  });

  const {
    matches,
    currentIndex: searchCurrentIndex,
    currentMatch,
    search,
    nextMatch,
    prevMatch,
    clearSearch,
  } = useSearchIndex(doc);

  // ── Scroll to page ──────────────────────────────────────────
  const goToPage = useCallback((pageNum: number) => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-page-num="${pageNum}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Scroll to search match page when current match changes
  useMemo(() => {
    if (currentMatch) {
      goToPage(currentMatch.pageNum);
    }
  }, [currentMatch, goToPage]);

  // ── Page list ───────────────────────────────────────────────
  const pages = useMemo(() => {
    if (!doc) return [];
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [doc, numPages]);

  // ── Loading / error states ──────────────────────────────────
  if (loading) {
    return (
      <VStack h="400px" justify="center" gap={3}>
        <Spinner size="lg" />
        <Text fontSize="sm" color="fg.muted">
          Loading PDF…
        </Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack h="400px" justify="center" gap={2}>
        <Text fontSize="sm" color="red.500">
          Failed to load PDF
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {error}
        </Text>
      </VStack>
    );
  }

  if (!doc) return null;

  return (
    <Box
      h="full"
      display="flex"
      flexDirection="column"
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      <Toolbar
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        numPages={numPages}
        onGoToPage={goToPage}
        onSearch={search}
        searchMatches={matches.length}
        searchCurrentIndex={searchCurrentIndex}
        onNextMatch={nextMatch}
        onPrevMatch={prevMatch}
        onClearSearch={clearSearch}
      />

      <Box ref={containerRef} flex={1} overflowY="auto" py={3} px={2}>
        {pages.map((pageNum) => {
          const pageMatches = matches.filter((m) => m.pageNum === pageNum);
          const activeMatchIndex =
            currentMatch?.pageNum === pageNum ? currentMatch.itemIndex : -1;

          return (
            <PageContainer
              key={pageNum}
              doc={doc}
              pageNumber={pageNum}
              scale={scale}
              isVisible={visiblePages.has(pageNum)}
              registerSentinel={registerSentinel}
              searchMatches={pageMatches}
              activeMatchIndex={activeMatchIndex}
            />
          );
        })}
      </Box>
    </Box>
  );
}
