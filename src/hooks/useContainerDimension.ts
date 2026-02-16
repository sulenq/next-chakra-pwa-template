import { useEffect, useState, useRef } from "react";

export function useContainerDimension(
  ref: React.RefObject<HTMLDivElement | null> | null,
) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const { width, height } = entry.contentRect;
        setDimension({ width, height });
      });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [ref]);

  return dimension;
}
