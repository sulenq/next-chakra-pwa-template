import { useState, useEffect, useRef } from "react";

function useResizeObserver(inputId?: string) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const ref = useRef<any>(null);

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

    const debounceResize = debounce(handleResize, 200);

    window.addEventListener("resize", debounceResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, [inputId]);

  return { ref: inputId ? null : ref, dimensions };
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default useResizeObserver;
