"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import type { PDFDocumentProxy, PDFPageProxy } from "../engine/pdfEngine";
import { getPage } from "../engine/pdfEngine";
import type { SearchMatch } from "../hooks/useSearchIndex";
import CanvasLayer from "./CanvasLayer";
import TextLayer from "./TextLayer";
import AnnotationLayer from "./AnnotationLayer";

type Props = {
  doc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  isVisible: boolean;
  registerSentinel: (pageNum: number, el: HTMLDivElement | null) => void;
  searchMatches?: SearchMatch[];
  activeMatchIndex?: number;
};

/**
 * Container for a single PDF page.
 * When visible, renders canvas + text layer.
 * When not visible, renders a placeholder with estimated dimensions.
 */
export default function PageContainer({
  doc,
  pageNumber,
  scale,
  isVisible,
  registerSentinel,
  searchMatches = [],
  activeMatchIndex = -1,
}: Props) {
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Register sentinel for IntersectionObserver
  useEffect(() => {
    registerSentinel(pageNumber, sentinelRef.current);
    return () => registerSentinel(pageNumber, null);
  }, [pageNumber, registerSentinel]);

  // Load the page object when visible
  useEffect(() => {
    if (!isVisible || !doc) {
      setPage(null);
      return;
    }

    let cancelled = false;

    getPage(doc, pageNumber).then((p) => {
      if (!cancelled) {
        setPage(p);
        const vp = p.getViewport({ scale });
        setDimensions({
          width: vp.width,
          height: vp.height,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber, isVisible, scale]);

  // Update dimensions when scale changes
  useEffect(() => {
    if (page) {
      const vp = page.getViewport({ scale });
      setDimensions({
        width: vp.width,
        height: vp.height,
      });
    }
  }, [page, scale]);

  return (
    <Box
      ref={sentinelRef}
      data-page-num={pageNumber}
      position="relative"
      mx="auto"
      mb={2}
      bg="white"
      boxShadow="sm"
      w={dimensions.width ? `${dimensions.width}px` : "100%"}
      h={dimensions.height ? `${dimensions.height}px` : "800px"}
      overflow="hidden"
    >
      {isVisible && page ? (
        <>
          {/* Base Layer: Canvas for vector paths and background */}
          <Box
            position="absolute"
            top={0}
            left={0}
            zIndex={0}
            w="full"
            h="full"
            pointerEvents="none"
          >
            <CanvasLayer page={page} scale={scale} />
          </Box>

          {/* Text Layer: Selectable text and highlights */}
          <Box
            position="absolute"
            top={0}
            left={0}
            zIndex={2}
            w="full"
            h="full"
            pointerEvents="auto"
          >
            <TextLayer
              page={page}
              scale={scale}
              searchMatches={searchMatches}
              activeMatchIndex={activeMatchIndex}
            />
          </Box>

          {/* Annotation Layer: Interactive links and forms */}
          <Box
            position="absolute"
            top={0}
            left={0}
            zIndex={3}
            w="full"
            h="full"
            pointerEvents="none"
          >
            <AnnotationLayer page={page} scale={scale} />
          </Box>
        </>
      ) : (
        <Box
          w="full"
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.400"
          fontSize="sm"
        >
          Page {pageNumber}
        </Box>
      )}
    </Box>
  );
}
