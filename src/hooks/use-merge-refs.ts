import { useCallback, useRef, Ref, RefObject } from "react";

// -----------------------------------------------------------------

export const useMergedRefs = <T>(...refs: Ref<T>[]) => {
  // Refs
  const refsRef = useRef(refs);
  refsRef.current = refs;

  return useCallback((node: T | null) => {
    for (const ref of refsRef.current) {
      if (!ref) continue;

      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as RefObject<T | null>).current = node;
      }
    }
  }, []);
};
