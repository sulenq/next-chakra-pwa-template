import { useCallback, useState } from "react";

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const MIN_SCALE = ZOOM_STEPS[0];
const MAX_SCALE = ZOOM_STEPS[ZOOM_STEPS.length - 1];

export function useZoom(initialScale = 1) {
  const [scale, setScaleRaw] = useState(initialScale);

  const setScale = useCallback((s: number) => {
    setScaleRaw(Math.min(MAX_SCALE, Math.max(MIN_SCALE, s)));
  }, []);

  const zoomIn = useCallback(() => {
    setScaleRaw((prev) => {
      const next = ZOOM_STEPS.find((s) => s > prev);
      return next ?? prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScaleRaw((prev) => {
      const next = [...ZOOM_STEPS].reverse().find((s) => s < prev);
      return next ?? prev;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScaleRaw(1);
  }, []);

  return {
    scale,
    setScale,
    zoomIn,
    zoomOut,
    resetZoom,
    minScale: MIN_SCALE,
    maxScale: MAX_SCALE,
  };
}
