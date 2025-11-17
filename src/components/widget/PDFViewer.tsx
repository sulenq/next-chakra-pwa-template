"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { usePDFUtils } from "@/hooks/usePDFUtils";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  IconArrowAutofitContent,
  IconArrowAutofitWidth,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

interface Props__PDFToolbar {
  utils: ReturnType<typeof usePDFUtils>;
}
const PDFToolbar = (props: Props__PDFToolbar) => {
  // Props
  const { utils, ...restProps } = props;

  // Components
  const UtilBtn = (props: any) => (
    <Btn iconButton size="sm" variant="ghost" {...props} />
  );

  return (
    <HStack p={2} {...restProps}>
      <UtilBtn onClick={utils.prevPage}>
        <Icon boxSize={5}>
          <IconChevronLeft stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.nextPage}>
        <Icon boxSize={5}>
          <IconChevronRight stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.zoomIn}>
        <Icon boxSize={5}>
          <IconZoomIn stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.zoomOut}>
        <Icon boxSize={5}>
          <IconZoomOut stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.resetZoom}>
        <Icon boxSize={5}>
          <IconZoomReset stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.fitToWidth}>
        <Icon boxSize={5}>
          <IconArrowAutofitContent stroke={1.5} />
        </Icon>
      </UtilBtn>
      <UtilBtn onClick={utils.fitToPage}>
        <Icon boxSize={5}>
          <IconArrowAutofitWidth stroke={1.5} />
        </Icon>
      </UtilBtn>
    </HStack>
  );
};

interface Props__PDFViewer extends StackProps {
  fileUrl: string;
}
export const PDFViewer = (props: Props__PDFViewer) => {
  // Props
  const { fileUrl, ...restProps } = props;

  // Refs
  const viewerRef = useRef<any>(null);

  // States
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);

  // Utils
  const utils = usePDFUtils(
    viewerRef,
    totalPages,
    currentPage,
    setCurrentPage,
    scale,
    setScale
  );
  const onDocumentLoad = useCallback((doc: any) => {
    setTotalPages(doc.numPages);
    setCurrentPage(1);
  }, []);

  return (
    <CContainer w={"full"} h={"full"} overflow={"hidden"} {...restProps}>
      <PDFToolbar utils={utils} />

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          ref={viewerRef}
          onDocumentLoad={onDocumentLoad}
        />
      </Worker>
    </CContainer>
  );
};
