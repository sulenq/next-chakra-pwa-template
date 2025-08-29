import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

const useBackOnClose = (
  id: string,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
) => {
  const pathname = usePathname();

  // handle onOpen, push history if needed
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const modalId = currentUrl.searchParams.get(id);

    if (isOpen && !modalId) {
      currentUrl.searchParams.set(id, "1");
      window.history.pushState(null, "", currentUrl.toString());
    }
  }, [isOpen, id]);

  const handlePopState = useCallback(() => {
    const currentUrl = new URL(window.location.href);
    const modalId = currentUrl.searchParams.get(id);

    if (modalId) {
      onOpen();
    } else {
      onClose();
    }
  }, [id, onOpen]);

  // Handle trigger popstate (back)
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      if (isOpen) {
        window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [isOpen, handlePopState]);

  // Handle initial onOpen with query parameter
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const modalId = currentUrl.searchParams.get(id);

    if (modalId) {
      onOpen();
    } else {
      onClose();
    }
  }, [pathname, id, onOpen]);
};

export default useBackOnClose;
