"use client";

import { APP } from "@/constants/_app";
import { useFirefoxPaddingY } from "@/hooks/useFirefoxPaddingY";
import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Img from "../ui-custom/Img";
import GlobalDisclosure from "./GlobalDisclosure";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => {
  return (
    <Center minH={"100dvh"}>
      <Img alt={`${APP.name} Logo`} src={"/logo.svg"} />
    </Center>
  );
};

export default function ClientOnly(props: Props) {
  // Props
  const { children, fallback } = props;

  // Hooks
  useFirefoxPaddingY(6);

  // States
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback || <DefaultFallback />}</>;

  return (
    <>
      <GlobalDisclosure />

      {children}
    </>
  );
}
