"use client";

import { StackV } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect } from "react";

// -----------------------------------------------------------------

export interface NavLinkProps extends StackProps {
  to?: string;
  external?: boolean;
}

export const NavLink = forwardRef<HTMLDivElement, NavLinkProps>(
  function NavLink(props, ref) {
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
      <StackV
        ref={ref}
        cursor={"pointer"}
        onClick={handleOnClick}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);
