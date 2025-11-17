// components/PDFViewer.tsx
"use client";

import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";

import { LoaderPluginPackage } from "@embedpdf/plugin-loader/react";
import {
  RenderLayer,
  RenderPluginPackage,
} from "@embedpdf/plugin-render/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { usePDFEngine } from "@/hooks/usePDFEngineDeprecated";
import { usePDFUtils } from "@/hooks/usePDFUtilsDeprecated";
import { normalizeUrl } from "@/utils/url";
import { Box, HStack, Icon, Spinner, StackProps } from "@chakra-ui/react";
import {
  IconArrowAutofitContent,
  IconArrowAutofitWidth,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react";

interface Props__PDFToolbar extends StackProps {
  engine: any;
}
export function PDFToolbar(props: Props__PDFToolbar) {
  // Props
  const { engine, ...restProps } = props;

  // Hooks
  const utils = usePDFUtils(engine);

  const UtilBtn = (props: BtnProps) => {
    return <Btn iconButton variant={"ghost"} size={"sm"} {...props} />;
  };

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

      {/* <Btn iconButton onClick={utils.rotateCW}>
        <Icon>
          <IconRotate stroke={1.5} />
        </Icon>
      </Btn> */}
    </HStack>
  );
}

interface Props__PDFViewer extends StackProps {
  url: string;
}
export function PDFViewer(props: Props__PDFViewer) {
  // Props
  const { url, ...restProps } = props;

  // Hooks
  const { engine, isLoading, error } = usePDFEngine();

  // Wait for engine to initialize (engine is nullable)
  if (isLoading || !engine) {
    return (
      <Box
        w="full"
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  // States
  const safeUrl = normalizeUrl(url);

  if (error) {
    return (
      <Box p={4}>
        <P color={"fg.error"}>Engine error: {error.message}</P>
      </Box>
    );
  }

  const plugins = [
    createPluginRegistration(LoaderPluginPackage, {
      loadingOptions: {
        type: "url",
        pdfFile: {
          id: "doc",
          url: safeUrl,
        },
      },
    }),

    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
  ];

  return (
    <CContainer
      w={"full"}
      h={"full"}
      overflow="hidden"
      bg={"body"}
      {...restProps}
    >
      <PDFToolbar
        engine={engine}
        borderBottom={"1px solid"}
        borderColor={"d1"}
      />

      <EmbedPDF engine={engine} plugins={plugins}>
        <Viewport
          style={{ width: "100%", height: "100%", background: "#8a8a8a15" }}
        >
          <Scroller
            renderPage={({ width, height, pageIndex, scale }) => (
              <Box key={pageIndex} width={width} height={height}>
                <RenderLayer pageIndex={pageIndex} scale={scale} />
              </Box>
            )}
          />
        </Viewport>
      </EmbedPDF>
    </CContainer>
  );
}
