import { useEffect, useRef, useState } from "react";

export function useContainerDimension(
  ref: React.RefObject<HTMLDivElement | null> | null,
  debounce = 200,
) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const timerRef = useRef<number | null>(null);

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
      }, debounce);
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
  }, [ref?.current, debounce]);

  return dimension;
}
