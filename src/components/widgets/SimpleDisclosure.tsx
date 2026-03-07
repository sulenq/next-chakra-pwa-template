"use client";

import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { useState } from "react";

interface Props {
  open: boolean;
  title: string;
  bodyContent?: any;
  footerContent?: any;
  headerProps?: any;
  bodyProps?: any;
  footerProps?: any;
  withMaximizeButton?: boolean;
}

export const SimpleDisclosure = (props: Props) => {
  // Props
  const {
    open,
    title,
    bodyContent,
    footerContent,
    headerProps,
    bodyProps,
    footerProps,
    withMaximizeButton,
    ...restProps
  } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [maximize, setMaximize] = useState<boolean>(false);

  return (
    <DisclosureRoot
      open={open}
      lazyLoad
      size={maximize ? "full" : "xs"}
      {...restProps}
    >
      <DisclosureContent
        positionerProps={{
          p: !maximize && !iss ? 4 : 0,
        }}
      >
        <DisclosureHeader {...headerProps}>
          <DisclosureHeaderContent
            title={title}
            withMaximizeButton={withMaximizeButton}
            onMaximizeChange={(maximize) => {
              setMaximize(maximize);
            }}
          />
        </DisclosureHeader>

        <DisclosureBody {...bodyProps}>{bodyContent}</DisclosureBody>

        <DisclosureFooter {...footerProps}>{footerContent}</DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
