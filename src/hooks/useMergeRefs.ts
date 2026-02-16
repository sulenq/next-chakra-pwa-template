import { useCallback } from "react";

export function useMergedRefs<T>(...refs: any[]) {
  return useCallback(
    (el: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(el);
        } else {
          ref.current = el;
        }
      });
    },
    [refs]
  );
}
