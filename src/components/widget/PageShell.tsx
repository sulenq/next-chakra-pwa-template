"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { P } from "@/components/ui/p";
import BackButton from "@/components/widget/BackButton";
import { CalendarDisclosureTrigger } from "@/components/widget/CalendarDisclosure";
import { ClampText } from "@/components/widget/ClampText";
import Clock from "@/components/widget/Clock";
import { DotIndicator } from "@/components/widget/Indicator";
import { Today } from "@/components/widget/Today";
import {
  Interface__NavItem,
  Interface__NavListItem,
} from "@/constants/interfaces";
import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { isEmptyArray } from "formik";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

const FONT_SIZE = "md";

export const PageContainer = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    // Props
    const { children, ...restProps } = props;

    return (
      <CContainer
        ref={ref}
        className="page-container"
        flex={1}
        overflow={"auto"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  },
);

export const NavBreadcrumb = (props: any) => {
  // Props
  const { backPath, resolvedActiveNavs, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  return (
    <HStack gap={1} ml={"-4px"} h={"36px"} {...restProps}>
      {backPath && <BackButton iconButton clicky={false} backPath={backPath} />}

      <HStack color={"fg.subtle"} gap={0}>
        <Icon boxSize={5} opacity={0.6} rotate={"-12deg"}>
          <IconSlash stroke={1.5} />
        </Icon>

        {isEmptyArray(resolvedActiveNavs) && <P>{l.navs.welcome}</P>}

        {resolvedActiveNavs.map((nav: Interface__NavListItem, idx: number) => {
          return (
            <HStack key={idx} gap={0} color={"fg.subtle"}>
              {idx !== 0 && (
                <>
                  {backPath && (
                    <Icon boxSize={5} opacity={0.6} rotate={"-12deg"}>
                      <IconSlash stroke={1.5} />
                    </Icon>
                  )}

                  {!backPath && (
                    <DotIndicator
                      boxSize={"5px"}
                      color={"fg.subtle"}
                      opacity={0.6}
                      mx={2}
                    />
                  )}
                </>
              )}

              <P fontSize={FONT_SIZE} lineClamp={1}>
                {nav.label ? nav.label : pluckString(l, nav.labelKey)}
              </P>
            </HStack>
          );
        })}
      </HStack>
    </HStack>
  );
};

interface Props__TopBar extends StackProps {
  navs?: Interface__NavItem[];
}
export const TopBar = (props: Props__TopBar) => {
  // Props
  const { navs, ...restProps } = props;

  // Contexts
  const ADM = useADM((s) => s.ADM);

  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname, navs);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  return (
    <HStack
      gap={4}
      h={"52px"}
      p={4}
      pr={"10px"}
      justify={"space-between"}
      bg={"body"}
      {...restProps}
    >
      <NavBreadcrumb
        backPath={backPath}
        resolvedActiveNavs={resolvedActiveNavs}
      />

      <HStack flexShrink={0} gap={1}>
        <HStack mx={1}>
          <Clock showTimezone fontSize={FONT_SIZE} />

          <CalendarDisclosureTrigger>
            <Today fontSize={FONT_SIZE} />
          </CalendarDisclosureTrigger>
        </HStack>

        {!ADM && <ColorModeButton rounded={"full"} size={"xs"} />}
      </HStack>
    </HStack>
  );
};

export const PageTitle = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const title = pluckString(l, last<any>(activeNavs)?.labelKey);

  return (
    <HStack flexShrink={0} px={4} my={3} minH={"36px"} {...restProps}>
      <ClampText w={"fit"} fontSize={"xl"} fontWeight={"semibold"}>
        {capitalizeWords(title)}
      </ClampText>

      {children}
    </HStack>
  );
};

export const PageContent = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    // Props
    const { children, ...restProps } = props;

    return (
      <CContainer ref={ref} flex={1} bg={"body"} {...restProps}>
        {children}
      </CContainer>
    );
  },
);

PageContainer.displayName = "PageContainer";
PageContent.displayName = "PageContent";
