import { SpecialZoomLevel } from "@react-pdf-viewer/core";

export function usePDFUtils(
  viewerRef: React.RefObject<any>,
  totalPages: number,
  currentPage: number,
  setCurrentPage: (p: number) => void,
  scale: number,
  setScale: (s: number) => void
) {
  return {
    nextPage: () => {
      if (viewerRef.current && currentPage < totalPages) {
        viewerRef.current.jumpToPage(currentPage);
        setCurrentPage(currentPage + 1);
      }
    },
    prevPage: () => {
      if (viewerRef.current && currentPage > 1) {
        viewerRef.current.jumpToPage(currentPage - 2);
        setCurrentPage(currentPage - 1);
      }
    },
    goToPage: (pageIndex: number) => {
      viewerRef.current?.jumpToPage(pageIndex);
      setCurrentPage(pageIndex + 1);
    },
    zoomIn: () => {
      const newScale = scale + 0.2;
      viewerRef.current?.zoom(newScale);
      setScale(newScale);
    },
    zoomOut: () => {
      const newScale = Math.max(0.2, scale - 0.2);
      viewerRef.current?.zoom(newScale);
      setScale(newScale);
    },
    resetZoom: () => {
      viewerRef.current?.zoomTo(1);
      setScale(1);
    },
    fitToWidth: () => viewerRef.current?.zoom(SpecialZoomLevel.PageWidth),
    fitToPage: () => viewerRef.current?.zoom(SpecialZoomLevel.PageFit),
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages,
    getScale: () => scale,
  };
}
