import { useEffect, useState, useRef } from "react";

export function useContainerDimension(
  ref: React.RefObject<HTMLDivElement | null> | null,
  debounceDelay = 0
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!ref?.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }, debounceDelay);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ref, debounceDelay]);

  return size;
}
