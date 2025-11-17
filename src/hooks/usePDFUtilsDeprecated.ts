import { useCallback } from "react";

export function usePDFUtils(engine: any) {
  const loader = engine.getPlugin("loader");
  const viewport = engine.getPlugin("viewport");
  const scroller = engine.getPlugin("scroll");

  const getTotalPages = useCallback(() => loader.getPageCount(), [loader]);

  const nextPage = useCallback(() => scroller.scrollToPage("next"), [scroller]);
  const prevPage = useCallback(
    () => scroller.scrollToPage("previous"),
    [scroller]
  );
  const goToPage = useCallback(
    (pageIndex: number) => scroller.scrollToPage(pageIndex),
    [scroller]
  );

  const zoomIn = useCallback(() => {
    const scale = viewport.getScale();
    viewport.setScale(scale + 0.2);
  }, [viewport]);

  const zoomOut = useCallback(() => {
    const scale = viewport.getScale();
    viewport.setScale(Math.max(0.2, scale - 0.2));
  }, [viewport]);

  const resetZoom = useCallback(() => viewport.setScale(1), [viewport]);
  const fitToWidth = useCallback(() => viewport.fitToWidth?.(), [viewport]);
  const fitToHeight = useCallback(() => viewport.fitToHeight?.(), [viewport]);
  const fitToPage = useCallback(() => viewport.fitToPage?.(), [viewport]);

  const getCurrentPage = useCallback(
    () => scroller.getCurrentPage(),
    [scroller]
  );

  return {
    getTotalPages,
    nextPage,
    prevPage,
    goToPage,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToWidth,
    fitToHeight,
    fitToPage,
    getCurrentPage,
  };
}
