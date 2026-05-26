"use client";

import { GlobalAlerts } from "@/components/overlays/global-alerts";
import { useColorMode } from "@/components/ui/color-mode";
import { Img } from "@/components/ui/img";
import { StackV } from "@/components/ui/stack";
import { APP } from "@/constants/_meta";
import { SVGS_PATH } from "@/constants/paths";
import useADMStore from "@/features/settings/display/stores/use-adm-store";
import { Center } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

// -----------------------------------------------------------------

const DefaultFallback = () => {
  return (
    <Center w={"100w"} minH={"100dvh"} color={"fg.subtle"}>
      <Img
        alt={`${APP.name} Logo`}
        src={`${SVGS_PATH}/logo_gray.svg`}
        width={"48px"}
        height={"48px"}
        imageProps={{
          priority: true,
        }}
      />
    </Center>
  );
};

// -----------------------------------------------------------------

let mountedGlobal = false;

// -----------------------------------------------------------------

interface ClientRootProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientRoot(props: ClientRootProps) {
  // Props
  const { children, fallback } = props;

  // Stores
  const { setColorMode } = useColorMode();
  const ADM = useADMStore((s) => s.ADM);

  // Hooks
  // useFirefoxScrollbarPadding();

  // States
  const [mounted, setMounted] = useState(mountedGlobal);

  // Utils
  function updateDarkMode() {
    const hour = new Date().getHours();
    setColorMode(hour >= 18 || hour < 6 ? "dark" : "light");
  }

  // Handle mount (cold start)
  useEffect(() => {
    mountedGlobal = true;
    setMounted(true);
  }, []);

  // Handle adaptive dark mode
  useEffect(() => {
    if (ADM) {
      const interval = setInterval(() => {
        const hour = new Date().getHours();
        if (hour === 6 || hour === 18) {
          updateDarkMode();
        }
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    if (ADM) {
      updateDarkMode();
    }
  }, [ADM]);

  if (!mounted) return <>{fallback || <DefaultFallback />}</>;

  return (
    <StackV
      id={"ClientRoot"}
      flex={1}
      minH={"100dvh"}
      bg={"bg.canvas"}
      pos={"relative"}
    >
      <GlobalAlerts />

      <StackV zIndex={2}>{children}</StackV>
    </StackV>
  );
}
