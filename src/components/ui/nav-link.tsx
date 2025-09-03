"use client";

import { StackProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { CContainer } from "./c-container";

interface Props extends StackProps {
  to?: string;
}

export const NavLink = forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Props
  const { children, to, ...restProps } = props;

  // Utils
  const router = useRouter();
  function handleOnClick() {
    if (to) {
      router.push(to);
    }
  }

  return (
    <CContainer
      ref={ref}
      cursor={"pointer"}
      onClick={handleOnClick}
      {...restProps}
    >
      {children}
    </CContainer>
  );
});

NavLink.displayName = "NavLink";
