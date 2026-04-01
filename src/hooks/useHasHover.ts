import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export const useHasHover = () => {
  // States
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    setHasHover(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setHasHover(e.matches);
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return hasHover;
};
