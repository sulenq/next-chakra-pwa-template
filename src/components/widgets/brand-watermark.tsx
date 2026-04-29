"use client";

import { P, PProps } from "@/components/ui/p";
import { APP } from "@/constants/_meta";
import { Span } from "@chakra-ui/react";
import Link from "next/link";

// -----------------------------------------------------------------

export const BrandWatermark = (props: PProps) => {
  // Props
  const { ...restProps } = props;

  // States
  const currentYear = new Date().getFullYear();

  return (
    <P textAlign={"center"} fontSize={"sm"} color={"fg.muted"} {...restProps}>
      © {currentYear} powered by{" "}
      <Span fontWeight={"bold"}>
        <Link href={"https://exium.id"} target={"_blank"}>
          {APP.poweredBy}
        </Link>
      </Span>
    </P>
  );
};
