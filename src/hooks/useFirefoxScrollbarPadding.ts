import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/styles";
import { useEffect } from "react";

export function useFirefoxScrollbarPadding(
  extraPaddingPx: string = FIREFOX_SCROLL_Y_CLASS_PR_PREFIX,
) {
  useEffect(() => {
    if (!navigator.userAgent.toLowerCase().includes("firefox")) return;

    const updatePadding = () => {
      document.querySelectorAll<HTMLElement>(".scrollY").forEach((el) => {
        const style = window.getComputedStyle(el);
        const currentPadding = parseFloat(style.paddingRight) || 0;

        const alreadyAdded = el.dataset.scrollbarCompensated === "true";
        if (!alreadyAdded) {
          // extract number dari extraPaddingPx
          const addNumber = parseFloat(extraPaddingPx) || 0;
          el.style.paddingRight = `${currentPadding + addNumber}px`;
          el.dataset.scrollbarCompensated = "true";
        }
      });
    };

    updatePadding();

    const observer = new MutationObserver(updatePadding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [extraPaddingPx]);
}
