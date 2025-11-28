"use client";

import { CContainer } from "@/components/ui/c-container";
import { PageTitle } from "@/components/widget/TopBar";
import { Props__Layout } from "@/constants/props";

export default function Layout(props: Props__Layout) {
  // Props
  const { children } = props;

  return (
    <CContainer flex={1} bg={"body"} overflow={"auto"}>
      <PageTitle />

      {children}
    </CContainer>
  );
}
