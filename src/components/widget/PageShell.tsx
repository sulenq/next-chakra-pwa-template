"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { P } from "@/components/ui/p";
import BackButton from "@/components/widget/BackButton";
import { CalendarDisclosureTrigger } from "@/components/widget/CalendarDisclosure";
import { ClampText } from "@/components/widget/ClampText";
import Clock from "@/components/widget/Clock";
import { DotIndicator } from "@/components/widget/Indicator";
import SimplePopover from "@/components/widget/SimplePopover";
import { Today } from "@/components/widget/Today";
import { Interface__Nav } from "@/constants/interfaces";
import {
  ADMIN_OTHER_PRIVATE_NAV_GROUPS,
  ADMIN_PRIVATE_NAV_GROUPS,
  OTHER_PRIVATE_NAV_GROUPS,
  PRIVATE_NAV_GROUPS,
} from "@/constants/navs";
import useADM from "@/context/useADM";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import useLang from "@/context/useLang";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { forwardRef, useEffect } from "react";

const FONT_SIZE = "md";
export const RESOLVED_NAVS = [
  ...PRIVATE_NAV_GROUPS,
  ...OTHER_PRIVATE_NAV_GROUPS,
  ...ADMIN_PRIVATE_NAV_GROUPS,
  ...ADMIN_OTHER_PRIVATE_NAV_GROUPS,
];

export const ContainerLayout = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    // Props
    const { children, ...restProps } = props;

    return (
      <CContainer
        className="page-layout"
        ref={ref}
        maxW={"720px"}
        mx={"auto"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  },
);

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
  const {
    // backPath,
    //  resolvedActiveNavs,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const breadcrumbs = useBreadcrumbs((s) => s.breadcrumbs);
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const backPath = breadcrumbs.backPath;
  const activeNavs = breadcrumbs.activeNavs;

  useEffect(() => {
    const currentActiveNavs = getActiveNavs(pathname, RESOLVED_NAVS);
    const resolvedBackPath = last(currentActiveNavs)?.backPath;
    const resolvedActiveNavs =
      sw < 960
        ? [currentActiveNavs[currentActiveNavs.length - 1]]
        : currentActiveNavs;

    setBreadcrumbs({
      activeNavs: resolvedActiveNavs,
      backPath: resolvedBackPath,
    });
  }, [pathname]);

  return (
    <HStack gap={1} ml={"-4px"} h={"36px"} cursor={"pointer"} {...restProps}>
      {backPath && <BackButton iconButton clicky={false} backPath={backPath} />}

      <SimplePopover
        content={activeNavs
          .map((nav) => {
            return nav.label || pluckString(l, nav.labelKey);
          })
          .join(" / ")}
        maxW={"400px"}
      >
        <HStack color={"fg.subtle"} gap={0}>
          <Icon boxSize={5} opacity={0.6} rotate={"-12deg"}>
            <IconSlash stroke={1.5} />
          </Icon>

          {/* {isEmptyArray(resolvedActiveNavs) && <P>{l.navs.welcome}</P>} */}

          {activeNavs.map((nav: Interface__Nav, idx: number) => {
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
      </SimplePopover>
    </HStack>
  );
};

export const TopBar = () => {
  // Contexts
  const ADM = useADM((s) => s.ADM);

  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname, RESOLVED_NAVS);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  useEffect(() => {}, [activeNavs]);

  return (
    <HStack
      flexShrink={0}
      h={"52px"}
      gap={4}
      px={4}
      pr={"10px"}
      justify={"space-between"}
      bg={"body"}
      // borderBottom={"1px solid"}
      borderColor={"border.muted"}
    >
      <NavBreadcrumb
        backPath={backPath}
        resolvedActiveNavs={resolvedActiveNavs}
      />

      <HStack flexShrink={0} gap={1}>
        <HStack mx={1}>
          <CalendarDisclosureTrigger>
            <Today fontSize={FONT_SIZE} />
          </CalendarDisclosureTrigger>

          <Clock showTimezone fontSize={FONT_SIZE} />
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
  const activeNavs = getActiveNavs(pathname, RESOLVED_NAVS);
  const title = pluckString(l, last<any>(activeNavs)?.labelKey);

  return (
    <HStack flexShrink={0} w={"fit"} minH={"36px"} px={4} my={3} {...restProps}>
      <ClampText
        fontSize={"xl"}
        fontWeight={"semibold"}
        textAlign={restProps.textAlign}
      >
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

ContainerLayout.displayName = "ContainerLayout";
PageContainer.displayName = "PageContainer";
PageContent.displayName = "PageContent";
