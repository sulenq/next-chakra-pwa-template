import { useRef } from "react";

// -----------------------------------------------------------------

export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  debounceDelay: number,
) => {
  // Refs
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, debounceDelay);
  };
};
