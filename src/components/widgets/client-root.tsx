"use client";

import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { Img } from "@/components/ui/img";
import { RadialGlowBackground } from "@/components/widgets/background";
import { GlobalDisclosure } from "@/components/widgets/global-disclosure";
import { LoadingBar } from "@/components/widgets/loading-bar";
import { APP } from "@/shared/constants/_meta";
import { SVGS_PATH } from "@/shared/constants/paths";
import useADM from "@/contexts/useADM";
import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientRoot(props: ClientRootProps) {
  // Props
  const { children, fallback } = props;

  // Contexts
  const { setColorMode } = useColorMode();
  const ADM = useADM((s) => s.ADM);

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
    <CContainer
      id={"client-root"}
      flex={1}
      minH={"100dvh"}
      bg={"bg.canvas"}
      pos={"relative"}
    >
      <RadialGlowBackground pos={"absolute"} zIndex={1} />

      <LoadingBar />
      <GlobalDisclosure />

      <CContainer zIndex={2}>{children}</CContainer>
    </CContainer>
  );
}
