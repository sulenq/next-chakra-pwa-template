import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/styles";
import { useEffect } from "react";

export function useFirefoxPaddingY(
  additionalPx: string = FIREFOX_SCROLL_Y_CLASS_PR_PREFIX,
) {
  useEffect(() => {
    if (!navigator.userAgent.toLowerCase().includes("firefox")) return;

    const updatePadding = () => {
      document.querySelectorAll<HTMLElement>(".scrollY").forEach((el) => {
        const style = window.getComputedStyle(el);
        const currentPadding = parseFloat(style.paddingRight) || 0;

        const alreadyAdded = el.dataset.firefoxAdded === "true";
        if (!alreadyAdded) {
          // extract number dari additionalPx
          const addNumber = parseFloat(additionalPx) || 0;
          el.style.paddingRight = `${currentPadding + addNumber}px`;
          el.dataset.firefoxAdded = "true";
        }
      });
    };

    updatePadding();

    const observer = new MutationObserver(updatePadding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [additionalPx]);
}
