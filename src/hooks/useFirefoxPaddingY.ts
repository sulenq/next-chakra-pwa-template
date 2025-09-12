import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX_NUMBER } from "@/constants/sizes";
import { useEffect } from "react";

export function useFirefoxPaddingY(
  additionalPx: string = FIREFOX_SCROLL_Y_CLASS_PR_PREFIX_NUMBER
) {
  // px
  useEffect(() => {
    if (!navigator.userAgent.toLowerCase().includes("firefox")) return;

    const updatePadding = () => {
      document.querySelectorAll<HTMLElement>(".scrollY").forEach((el) => {
        const style = window.getComputedStyle(el);
        const currentPadding = parseFloat(style.paddingRight) || 0;

        // set only if not already added
        const alreadyAdded = el.dataset.firefoxAdded === "true";
        if (!alreadyAdded) {
          el.style.paddingRight = `${currentPadding + additionalPx}`;
          el.dataset.firefoxAdded = "true"; // mark as added
        }
      });
    };

    updatePadding();

    // optional: observe DOM changes in case .scrollY elements added dynamically
    const observer = new MutationObserver(updatePadding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [additionalPx]);
}
