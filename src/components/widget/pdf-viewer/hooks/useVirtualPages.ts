import { useEffect, useRef, useState } from "react";

type UseVirtualPagesOptions = {
  numPages: number;
  overscan?: number; // extra pages to render above/below viewport
};

/**
 * Track which pages are visible in a scroll container using
 * IntersectionObserver. Only visible + overscan pages get rendered.
 */
export function useVirtualPages(
  containerRef: React.RefObject<HTMLDivElement | null>,
  { numPages, overscan = 2 }: UseVirtualPagesOptions,
) {
  const [visiblePages, setVisiblePages] = useState<Set<number>>(
    () => new Set([1]),
  );
  const sentinelRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Provide a callback for PageContainer to register its sentinel element
  const registerSentinel = (pageNum: number, el: HTMLDivElement | null) => {
    if (el) {
      sentinelRefs.current.set(pageNum, el);
    } else {
      sentinelRefs.current.delete(pageNum);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || numPages === 0) return;

    const rawVisible = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNum = Number((entry.target as HTMLElement).dataset.pageNum);
          if (isNaN(pageNum)) return;

          if (entry.isIntersecting) {
            rawVisible.add(pageNum);
          } else {
            rawVisible.delete(pageNum);
          }
        });

        // Expand with overscan
        const expanded = new Set<number>();
        rawVisible.forEach((p) => {
          for (
            let i = Math.max(1, p - overscan);
            i <= Math.min(numPages, p + overscan);
            i++
          ) {
            expanded.add(i);
          }
        });

        setVisiblePages(new Set(expanded));
      },
      {
        root: container,
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    // Observe all registered sentinels
    sentinelRefs.current.forEach((el) => observer.observe(el));

    // Also observe any sentinels that get added later via MutationObserver
    const mutObs = new MutationObserver(() => {
      sentinelRefs.current.forEach((el) => {
        observer.observe(el);
      });
    });
    mutObs.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
    };
  }, [containerRef, numPages, overscan]);

  return { visiblePages, registerSentinel };
}
