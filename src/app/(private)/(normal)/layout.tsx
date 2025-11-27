"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Props__Layout } from "@/constants/props";
import useLang from "@/context/useLang";
import { last } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { usePathname } from "next/navigation";

export default function Layout(props: Props__Layout) {
  // Props
  const { children } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const title = pluckString(l, last<any>(activeNavs)?.labelKey);

  return (
    <CContainer flex={1} overflow={"auto"}>
      <CContainer flexShrink={0} py={3} px={4} overflow={"auto"}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          {title}
        </P>
      </CContainer>

      {children}
    </CContainer>
  );
}
