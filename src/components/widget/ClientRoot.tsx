"use client";

import { useColorMode } from "@/components/ui/color-mode";
import { LoadingBar } from "@/components/widget/LoadingBar";
import { APP } from "@/constants/_meta";
import { SVGS_PATH } from "@/constants/paths";
import useADM from "@/context/useADM";
import { useFirefoxScrollbarPadding } from "@/hooks/useFirefoxScrollbarPadding";
import useOfflineAlert from "@/hooks/useOfflineAlert";
import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Img } from "../ui/img";
import GlobalDisclosure from "./GlobalDisclosure";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

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

// persist mounted state across route changes
let mountedGlobal = false;

export default function ClientRoot(props: Props) {
  // Props
  const { children, fallback } = props;

  // Contexts
  const { setColorMode } = useColorMode();
  const ADM = useADM((s) => s.ADM);

  // Hooks
  useFirefoxScrollbarPadding();

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

  // Handle offline alert
  useOfflineAlert({ mounted });

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
    <>
      <LoadingBar />
      <GlobalDisclosure />

      {children}
    </>
  );
}
