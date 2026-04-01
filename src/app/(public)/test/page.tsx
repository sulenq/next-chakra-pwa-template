"use client";

import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";

export default function Page() {
  return (
    <StackV gap={4}>
      <StackV>
        <P>Wix Madefor Text</P>
        <P
          fontSize={"3xl"}
          className={"wix-madefor-text"}
          fontVariantNumeric={"tabular-nums"}
        >
          1111111111
        </P>
        <P fontSize={"3xl"} className={"wix-madefor-text"}>
          1234567890
        </P>
      </StackV>

      <StackV>
        <P>Google</P>
        <P
          fontSize={"3xl"}
          className={"google-sans-flex"}
          fontVariantNumeric={"tabular-nums"}
        >
          1111111111
        </P>
        <P fontSize={"3xl"} className={"google-sans-flex"}>
          1234567890
        </P>
      </StackV>

      <StackV>
        <P>Inter</P>
        <P
          fontSize={"3xl"}
          className="inter"
          fontVariantNumeric={"tabular-nums"}
        >
          1111111111
        </P>
        <P fontSize={"3xl"} className="inter">
          1234567890
        </P>
      </StackV>
    </StackV>
  );
}
