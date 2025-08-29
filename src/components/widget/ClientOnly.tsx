"use client";

import { useEffect, useState } from "react";
import Loader from "../ui-custom/Loader";
import { useFirefoxPaddingY } from "@/hooks/useFirefoxPaddingY";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

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

  if (!mounted) return <>{fallback || <Loader minH={"100dvh"} />}</>;

  return <>{children}</>;
}
