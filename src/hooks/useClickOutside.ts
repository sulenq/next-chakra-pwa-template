import { useEffect, RefObject } from "react";

export const useClickOutside = <T extends HTMLElement | null>(
  refs: RefObject<T> | RefObject<T>[],
  callback: () => void,
): void => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent): void {
      const refArray = Array.isArray(refs) ? refs : [refs];

      if (refArray.every((ref) => !ref.current)) return;

      const isOutside = refArray.every(
        (ref) =>
          !ref.current || !event.composedPath().includes(ref.current as Node),
      );

      if (isOutside) {
        setTimeout(() => {
          callback();
        }, 0);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside, true);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, true);
    };
  }, [refs, callback]);
};
