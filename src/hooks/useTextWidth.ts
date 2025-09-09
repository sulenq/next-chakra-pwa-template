import { useLayoutEffect, useRef, useState } from "react";

function useTextWidth(text: string, font: string) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!spanRef.current) {
      const span = document.createElement("span");
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      span.style.whiteSpace = "pre";
      span.style.font = font;
      document.body.appendChild(span);
      spanRef.current = span;
    }
    if (spanRef.current) {
      spanRef.current.textContent = text || "0";
      setWidth(spanRef.current.offsetWidth);
    }
  }, [text, font]);

  return width;
}

export default useTextWidth;
