"use client";

import { Props__NavLink } from "@/constants/props";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect } from "react";
import { CContainer } from "./c-container";

export const NavLink = forwardRef<HTMLDivElement, Props__NavLink>(
  (props, ref) => {
    const { children, to, external, ...restProps } = props;
    const router = useRouter();

    useEffect(() => {
      if (to && !external) {
        router.prefetch(to);
      }
    }, [to, external, router]);

    function handleOnClick() {
      if (!to) return;

      if (external) {
        window.open(to, "_blank", "noopener,noreferrer");
      } else {
        router.push(to);
      }
    }

    return (
      <CContainer
        ref={ref}
        cursor="pointer"
        onClick={handleOnClick}
        w={"fit"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);

NavLink.displayName = "NavLink";
