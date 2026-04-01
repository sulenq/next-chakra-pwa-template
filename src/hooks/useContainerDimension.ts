import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

interface UseContainerDimensionOptions {
  debounceDelay?: number;
}

export function useContainerDimension(
  ref: React.RefObject<HTMLDivElement | null> | null,
  options?: UseContainerDimensionOptions,
) {
  // Options
  const { debounceDelay = 200 } = options || {};
  // Refs
  const timerRef = useRef<number | null>(null);

  // States
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        const { width, height } = entry.contentRect;
        setDimension({ width, height });
      }, debounceDelay);
    });

    observer.observe(node);

    const rect = node.getBoundingClientRect();
    setDimension({ width: rect.width, height: rect.height });

    return () => {
      observer.disconnect();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ref?.current, debounceDelay]);

  return dimension;
}
