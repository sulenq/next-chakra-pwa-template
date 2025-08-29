import { useCallback, useEffect } from "react";

const useBackOnClose = (
  id: string,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
) => {
  const url = typeof window !== "undefined" ? window.location.href : "";

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
  }, [url, id, onOpen]);
};

export default useBackOnClose;
