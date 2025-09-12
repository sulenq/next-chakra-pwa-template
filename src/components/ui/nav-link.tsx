"use client";

import { Props__NavLink } from "@/constants/props";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { CContainer } from "./c-container";

export const NavLink = forwardRef<HTMLDivElement, Props__NavLink>(
  (props, ref) => {
    // Props
    const { children, to, ...restProps } = props;

    // Utils
    const router = useRouter();
    router.prefetch(to || "");
    function handleOnClick() {
      if (to) {
        router.push(to);
        window.scrollTo(0, 0);
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
  }
);

NavLink.displayName = "NavLink";
