import { toaster } from "@/components/ui/toaster";
import useOffline from "@/context/disclosure/useOffilne";
import useLang from "@/context/useLang";
import { useEffect, useRef } from "react";

interface Props {
  mounted: boolean;
}

export default function useOfflineAlert(props: Props) {
  // Props
  const { mounted } = props;

  // Contexts
  const { l } = useLang();
  const { setOffline } = useOffline();

  // Refs
  const lastStatus = useRef(navigator.onLine);

  // Utils
  function handleOnline() {
    setOffline(false);
    toaster.success({
      id: "success_online",
      title: l.success_online.title,
      description: l.success_online.description,
    });
  }
  function handleOffline() {
    setOffline(true);
  }

  // Handler
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      const online = navigator.onLine;
      if (online !== lastStatus.current) {
        lastStatus.current = online;
        if (online) handleOnline();
        else handleOffline();
      }
    }, 1);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [mounted]);
}
