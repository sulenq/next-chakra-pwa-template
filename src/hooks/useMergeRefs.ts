import { useCallback, useRef, Ref, RefObject } from "react";

export function useMergedRefs<T>(...refs: Ref<T>[]) {
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
}
