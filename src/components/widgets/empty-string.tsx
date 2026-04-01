"use client";

import { P, PProps } from "@/components/ui/p";

// -----------------------------------------------------------------

export const EmptyString = (props: PProps) => {
  return (
    <P color={"fg.subtle"} {...props}>
      -
    </P>
  );
};
