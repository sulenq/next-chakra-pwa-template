"use client";

import { APP } from "@/constants/_meta";
import { useFirefoxPaddingY } from "@/hooks/useFirefoxPaddingY";
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
      <Center position={"relative"}>
        <Img alt={`${APP.name} Logo`} src={"/logo.svg"} w={"40px"} />
      </Center>
    </Center>
  );
};

// persist mounted state across route changes
let mountedGlobal = false;

export default function ClientOnlyApp(props: Props) {
  // Props
  const { children, fallback } = props;

  // Hooks
  useFirefoxPaddingY(6);

  // States
  const [mounted, setMounted] = useState(mountedGlobal);

  // Handle mount
  useEffect(() => {
    mountedGlobal = true;
    setMounted(true);
  }, []);

  // Handle offline alert
  useOfflineAlert({ mounted });

  if (!mounted) return <>{fallback || <DefaultFallback />}</>;

  return (
    <>
      <GlobalDisclosure />
      {children}
    </>
  );
}
