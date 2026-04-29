import { useEffect, useState } from "react";

export const useHasHover = () => {
  // States
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = (e?: MediaQueryList | MediaQueryListEvent) => {
      setHasHover(e ? (e as MediaQueryList).matches : media.matches);
    };

    update(media);

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return hasHover;
};
