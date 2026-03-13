"use client";

import { CContainer } from "@/components/ui/c-container";
import { P, PProps } from "@/components/ui/p";
import { BackButton } from "@/components/widgets/back-button";
import { Calendar } from "@/components/widgets/calendar";
import { ClampText } from "@/components/widgets/clamp-text";
import { Clock } from "@/components/widgets/clock";

import { DotIndicator } from "@/components/widgets/indicator";
import { MContainerProps } from "@/components/widgets/m-container";
import { Today } from "@/components/widgets/today";
import ToggleTip from "@/components/widgets/toggle-tip";
import { Interface__Nav } from "@/constants/interfaces";
import { GAP, R_SPACING_MD, TOP_BAR_H } from "@/constants/styles";
import { useBreadcrumbs } from "@/contexts/useBreadcrumbs";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import { useScreen } from "@/hooks/useScreen";
import { isEmptyArray, last } from "@/utils/array";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

const FONT_SIZE = "md";

export const NavBreadcrumb = (props: any) => {
  // Props
  const {
    // backPath,
    //  resolvedActiveNavs,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const breadcrumbs = useBreadcrumbs((s) => s.breadcrumbs);
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const currentActiveNavs = getActiveNavs(pathname);
  const backPath = breadcrumbs.backPath;
  const activeNavs = breadcrumbs.activeNavs;

  useEffect(() => {
    const resolvedBackPath = last(currentActiveNavs)?.backPath;
    const resolvedActiveNavs =
      sw < 960
        ? !isEmptyArray(currentActiveNavs)
          ? [currentActiveNavs[currentActiveNavs.length - 1]]
          : currentActiveNavs
        : currentActiveNavs;

    setBreadcrumbs({
      activeNavs: resolvedActiveNavs,
      backPath: resolvedBackPath,
    });
  }, [pathname, sw]);

  return (
    <HStack gap={1} ml={"-4px"} h={"36px"} cursor={"pointer"} {...restProps}>
      {backPath && <BackButton iconButton clicky={false} backPath={backPath} />}

      <ToggleTip
        content={currentActiveNavs
          .map((nav) => {
            return nav?.label || pluckString(t, nav?.labelKey);
          })
          .join(" / ")}
        maxW={"400px"}
      >
        <HStack color={"fg.subtle"} gap={0} ml={"-4px"}>
          <Icon boxSize={5} opacity={0.6} rotate={"-12deg"}>
            <IconSlash stroke={1.5} />
          </Icon>

          {/* {isEmptyArray(resolvedActiveNavs) && <P>{t.navs.welcome}</P>} */}

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
                  {nav?.label ? nav?.label : pluckString(t, nav.labelKey)}
                </P>
              </HStack>
            );
          })}
        </HStack>
      </ToggleTip>
    </HStack>
  );
};

export const TopBar = (props: StackProps) => {
  // Contexts
  // const { themeConfig } = useThemeConfig();

  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  return (
    <HStack
      flexShrink={0}
      justify={"space-between"}
      gap={4}
      h={"52px"}
      // px={`calc(${themeConfig.radii.container} + ${GAP})`}
      px={R_SPACING_MD}
      // borderBottom={"1px solid"}
      borderColor={"border.muted"}
      {...props}
    >
      <NavBreadcrumb
        backPath={backPath}
        resolvedActiveNavs={resolvedActiveNavs}
      />

      <HStack flexShrink={0} gap={4}>
        <HStack flexShrink={0} color={"fg.muted"}>
          <Calendar.Trigger>
            <Today fontSize={FONT_SIZE} />
          </Calendar.Trigger>

          <Clock showTimezone fontSize={FONT_SIZE} />
        </HStack>
      </HStack>
    </HStack>
  );
};

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

type PageContainerContextType = {
  isValidDimension: boolean;
  isSmContainer: boolean;
};
const PageContainerContext = createContext<PageContainerContextType | null>(
  null,
);
export function usePageContainerContext() {
  const context = useContext(PageContainerContext);
  if (!context) {
    throw new Error(
      "usePageContainerContext must be used inside PageContainer",
    );
  }
  return context;
}
export const PageContainer = forwardRef<HTMLDivElement, StackProps>(
  ({ children, ...restProps }, ref) => {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const mergeRef = useMergedRefs(containerRef, ref);

    // Hooks
    const dimension = useContainerDimension(containerRef);

    // States
    const isValidDimension = dimension.width > 0 && dimension.height > 0;
    const isSmContainer = dimension.width < 600;

    const contextValue = useMemo(
      () => ({ isValidDimension, isSmContainer }),
      [isValidDimension, isSmContainer],
    );

    return (
      <PageContainerContext.Provider value={contextValue}>
        <CContainer
          ref={mergeRef}
          className="page-container"
          flex={1}
          p={GAP}
          overflow={"auto"}
          {...restProps}
        >
          {children}
        </CContainer>
      </PageContainerContext.Provider>
    );
  },
);

export const PageHeader = (props: StackProps) => {
  // Props
  const { children, title, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const pathname = usePathname();

  // Constants
  const activeNavs = getActiveNavs(pathname);
  const navTitle = pluckString(t, last<any>(activeNavs)?.labelKey);

  // Derived Values
  const resolvedTitle = title || navTitle;

  return (
    <HStack
      flexShrink={0}
      w={"full"}
      minH={TOP_BAR_H}
      p={R_SPACING_MD}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      <PageTitle>{resolvedTitle}</PageTitle>

      {children}
    </HStack>
  );
};

export const PageTitle = (props: PProps) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <ClampText
      fontSize={"xl"}
      fontWeight={"semibold"}
      textAlign={restProps.textAlign}
    >
      {capitalizeWords(children)}
    </ClampText>
  );
};

export const PageContent = forwardRef<HTMLDivElement, MContainerProps>(
  (props, ref) => {
    // Props
    const { children, ...restProps } = props;

    // Contexts
    const { isValidDimension } = usePageContainerContext();

    return (
      <CContainer ref={ref} flex={1} {...restProps}>
        {isValidDimension ? children : null}
      </CContainer>
    );
  },
);

ContainerLayout.displayName = "ContainerLayout";
PageContainer.displayName = "PageContainer";
PageContent.displayName = "PageContent";

export const Page = {
  Container: PageContainer,
  Content: PageContent,
  Header: PageHeader,
  Title: PageTitle,
};
