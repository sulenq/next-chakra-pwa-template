"use client";

import { Disclosure } from "@/components/ui/disclosure";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { useState } from "react";

// -----------------------------------------------------------------

interface SimpleDisclosureProps {
  open: boolean;
  title: string;
  bodyContent?: any;
  footerContent?: any;
  headerProps?: any;
  bodyProps?: any;
  footerProps?: any;
  withMaximizeButton?: boolean;
}

export const SimpleDisclosure = (props: SimpleDisclosureProps) => {
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

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [maximize, setMaximize] = useState<boolean>(false);

  return (
    <Disclosure.Root
      open={open}
      lazyLoad
      size={maximize ? "full" : "xs"}
      {...restProps}
    >
      <Disclosure.Content
        positionerProps={{
          p: !maximize && !iss ? 4 : 0,
        }}
        rounded={maximize ? 0 : themeConfig.radii.container}
      >
        <Disclosure.Header {...headerProps}>
          <Disclosure.HeaderContent
            title={title}
            withMaximizeButton={withMaximizeButton}
            onMaximizeChange={(maximize) => {
              setMaximize(maximize);
            }}
          />
        </Disclosure.Header>

        <Disclosure.Body {...bodyProps}>{bodyContent}</Disclosure.Body>

        <Disclosure.Footer {...footerProps}>{footerContent}</Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};
