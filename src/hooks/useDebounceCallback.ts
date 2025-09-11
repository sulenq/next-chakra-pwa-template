import { useCallback, useRef, useEffect } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 500
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const timeoutRef = useRef<number | undefined>(undefined);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        fnRef.current(...args);
      }, delay) as unknown as number;
    },
    [delay]
  );

  // optional: expose cancel
  const cancel = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  return { debounced, cancel };
}
