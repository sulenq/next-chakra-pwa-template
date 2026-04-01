import { useState, useEffect, useRef } from "react";

// -----------------------------------------------------------------

function debounce<T extends (...args: any[]) => void>(
  func: T,
  debounceDelay: number,
) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), debounceDelay);
  };
}

// -----------------------------------------------------------------

interface UseResizeObserverOptions {
  inputId?: string;
  debounceDelay?: number;
}

export const useResizeObserver = (options: UseResizeObserverOptions = {}) => {
  // Options
  const { inputId, debounceDelay = 200 } = options;

  // Refs
  const ref = useRef<any>(null);

  // States
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const targetElement = inputId
      ? document.getElementById(inputId)
      : ref.current;

    if (!targetElement) {
      console.warn(`No element found for id: ${inputId}`);
      return;
    }

    const handleResize = () => {
      setDimensions({
        width: targetElement.offsetWidth,
        height: targetElement.offsetHeight,
      });
    };

    const debounceResize = debounce(handleResize, debounceDelay);

    window.addEventListener("resize", debounceResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, [inputId]);

  return { ref: inputId ? null : ref, dimensions };
};
