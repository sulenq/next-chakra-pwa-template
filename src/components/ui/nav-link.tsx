"use client";

import { useRouter } from "next/navigation";
import { forwardRef, useEffect } from "react";
import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

export interface NavLinkProps extends StackProps {
  to?: string;
  external?: boolean;
}
export const NavLink = forwardRef<HTMLDivElement, NavLinkProps>(
  (props, ref) => {
    const { children, to, external, onClick, ...restProps } = props;
    const router = useRouter();

    useEffect(() => {
      if (to && !external) {
        router.prefetch(to);
      }
    }, [to, external, router]);

    function handleOnClick(event: React.MouseEvent<HTMLDivElement>) {
      if (!to) return;

      onClick?.(event);

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
  },
);

NavLink.displayName = "NavLink";
