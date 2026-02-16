// "use client";

// import { Btn } from "@/components/ui/btn";
// import { CContainer } from "@/components/ui/c-container";
// import { HStack, Icon, StackProps } from "@chakra-ui/react";
// import {
//   IconArrowAutofitContent,
//   IconArrowAutofitWidth,
//   IconChevronLeft,
//   IconChevronRight,
//   IconZoomIn,
//   IconZoomOut,
//   IconZoomReset,
// } from "@tabler/icons-react";
// import { useEffect, useRef, useState } from "react";

// import { Tooltip } from "@/components/ui/tooltip";
// import HScroll from "@/components/widget/HScroll";
// import useLang from "@/context/useLang";

// import * as pdfjsLib from "pdfjs-dist";
// import { GlobalWorkerOptions } from "pdfjs-dist";

// GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

// export function usePDFUtils(
//   pdfDoc: PDFDocumentProxy | null,
//   canvasRefs: React.MutableRefObject<HTMLCanvasElement[]>,
//   currentPage: number,
//   setCurrentPage: (p: number) => void,
//   scale: number,
//   setScale: (s: number) => void,
//   totalPages: number
// ) {
//   const nextPage = () =>
//     currentPage < totalPages && setCurrentPage(currentPage + 1);

//   const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//   const goToPage = (page: number) =>
//     page >= 1 && page <= totalPages && setCurrentPage(page);

//   const zoomIn = () => setScale(scale + 0.2);

//   const zoomOut = () => setScale(Math.max(0.2, scale - 0.2));

//   const resetZoom = () => setScale(1);

//   const fitToWidth = async () => {
//     if (!pdfDoc || !canvasRefs.current[0]) return;
//     const page = await pdfDoc.getPage(currentPage);
//     const viewport = page.getViewport({ scale: 1 });
//     const containerWidth = canvasRefs.current[0].parentElement!.clientWidth;
//     setScale(containerWidth / viewport.width);
//   };

//   const fitToPage = async () => {
//     if (!pdfDoc || !canvasRefs.current[0]) return;
//     const page = await pdfDoc.getPage(currentPage);
//     const viewport = page.getViewport({ scale: 1 });
//     const container = canvasRefs.current[0].parentElement!;
//     const scaleX = container.clientWidth / viewport.width;
//     const scaleY = container.clientHeight / viewport.height;
//     setScale(Math.min(scaleX, scaleY));
//   };

//   return {
//     nextPage,
//     prevPage,
//     goToPage,
//     zoomIn,
//     zoomOut,
//     resetZoom,
//     fitToWidth,
//     fitToPage,
//   };
// }

// interface Props__PDFToolbar extends StackProps {
//   utils: ReturnType<typeof usePDFUtils>;
//   toggleMode: () => void;
//   isSingleMode: boolean;
// }

// const PDFToolbar = (props: Props__PDFToolbar) => {
//   const { utils, toggleMode, isSingleMode, ...restProps } = props;
//   const { l } = useLang();

//   const UtilBtn = (btnProps: any) => {
//     const { tooltipContent, ...restProps } = btnProps;
//     return (
//       <Tooltip content={tooltipContent}>
//         <Btn iconButton size="sm" variant="ghost" {...restProps} />
//       </Tooltip>
//     );
//   };

//   return (
//     <HScroll className="noScroll" p={2} bg={"body"} {...restProps}>
//       <HStack>
//         <UtilBtn
//           onClick={utils.prevPage}
//           disabled={!isSingleMode}
//           tooltipContent={l.previous_page}
//         >
//           <Icon boxSize={5} as={IconChevronLeft} />
//         </UtilBtn>
//         <UtilBtn
//           onClick={utils.nextPage}
//           disabled={!isSingleMode}
//           tooltipContent={l.next_page}
//         >
//           <Icon boxSize={5} as={IconChevronRight} />
//         </UtilBtn>

//         <UtilBtn onClick={utils.zoomIn} tooltipContent={l.zoom_in}>
//           <Icon boxSize={5} as={IconZoomIn} />
//         </UtilBtn>
//         <UtilBtn onClick={utils.zoomOut} tooltipContent={l.zoom_out}>
//           <Icon boxSize={5} as={IconZoomOut} />
//         </UtilBtn>
//         <UtilBtn onClick={utils.resetZoom} tooltipContent={l.zoom_reset}>
//           <Icon boxSize={5} as={IconZoomReset} />
//         </UtilBtn>

//         <UtilBtn onClick={utils.fitToWidth} tooltipContent={l.fit_to_width}>
//           <Icon boxSize={5} as={IconArrowAutofitContent} />
//         </UtilBtn>
//         <UtilBtn onClick={utils.fitToPage} tooltipContent={l.fit_to_page}>
//           <Icon boxSize={5} as={IconArrowAutofitWidth} />
//         </UtilBtn>

//         <UtilBtn
//           iconButton={false}
//           onClick={toggleMode}
//           ml={"auto"}
//           tooltipContent={"Mode"}
//         >
//           {isSingleMode ? "Single page" : "Scroll mode"}
//         </UtilBtn>
//       </HStack>
//     </HScroll>
//   );
// };

// interface Props__PDFViewer extends StackProps {
//   fileUrl: string;
// }

// export const SimplePDFViewer = (props: Props__PDFViewer) => {
//   const { fileUrl, ...restProps } = props;

//   const containerRef = useRef<HTMLDivElement>(null);

//   const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [scale, setScale] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isSingleMode, setIsSingleMode] = useState(true);

//   const canvasRefs = useRef<HTMLCanvasElement[]>([]);

//   useEffect(() => {
//     const loadPDF = async () => {
//       // load PDF document
//       const loadingTask = pdfjsLib.getDocument(fileUrl);
//       const doc = await loadingTask.promise;

//       setPdfDoc(doc);
//       setTotalPages(doc.numPages);
//       setCurrentPage(1);

//       // auto-fit first page width
//       if (canvasRefs.current[0]) {
//         const page = await doc.getPage(1);
//         const viewport = page.getViewport({ scale: 1 });
//         const containerWidth = canvasRefs.current[0].parentElement!.clientWidth;
//         setScale(containerWidth / viewport.width);
//       }
//     };
//     loadPDF();
//   }, [fileUrl]);

//   const renderPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
//     if (!pdfDoc) return;

//     const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
//     const viewport = page.getViewport({ scale });
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     // cancel previous renderTask safely
//     if ((canvas as any)._pdfRenderTask) {
//       (canvas as any)._pdfRenderTask.cancel();
//     }

//     const renderTask = page.render({ canvasContext: ctx, viewport });
//     (canvas as any)._pdfRenderTask = renderTask;

//     try {
//       await renderTask.promise;
//     } catch (err: any) {
//       // PDF.js throws RenderingCancelledException → harmless
//       if (err?.name !== "RenderingCancelledException") {
//         console.error(err);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!pdfDoc) return;

//     if (isSingleMode) {
//       if (canvasRefs.current[0]) {
//         renderPage(currentPage, canvasRefs.current[0]);
//       }
//     } else {
//       canvasRefs.current.forEach((canvas, idx) => renderPage(idx + 1, canvas));
//     }
//   }, [pdfDoc, currentPage, scale, isSingleMode]);

//   const utils = usePDFUtils(
//     pdfDoc,
//     canvasRefs,
//     currentPage,
//     setCurrentPage,
//     scale,
//     setScale,
//     totalPages
//   );

//   const toggleMode = () => setIsSingleMode(!isSingleMode);

//   return (
//     <CContainer w={"full"} h={"full"} overflow={"clip"} {...restProps}>
//       <PDFToolbar
//         utils={utils}
//         toggleMode={toggleMode}
//         isSingleMode={isSingleMode}
//         borderColor={"border.subtle"}
//       />

//       {isSingleMode ? (
//         <CContainer h={"full"} gap={2} align={"start"} overflow={"auto"}>
//           <canvas
//             ref={(el) => {
//               if (!el) return;
//               canvasRefs.current[0] = el;
//             }}
//             style={{
//               marginBottom: 12,
//               boxShadow: "0 0 0 1px #8a8a8a15",
//               margin: "auto auto",
//             }}
//           />
//         </CContainer>
//       ) : (
//         <CContainer
//           ref={containerRef}
//           className={"scrollY"}
//           h={"full"}
//           gap={2}
//           align={"start"}
//           py={2}
//         >
//           {Array.from({ length: totalPages }, (_, i) => (
//             <canvas
//               key={i}
//               ref={(el) => {
//                 if (!el) return;
//                 canvasRefs.current[i] = el;
//               }}
//               style={{
//                 marginBottom: 12,
//                 margin: "0 auto",
//               }}
//             />
//           ))}
//         </CContainer>
//       )}
//     </CContainer>
//   );
// };

export {};
