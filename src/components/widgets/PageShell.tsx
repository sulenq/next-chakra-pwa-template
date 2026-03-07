"use client";

import { CContainer } from "@/components/ui/c-container";
import { P, PProps } from "@/components/ui/p";
import { BackButton } from "@/components/widgets/BackButton";
import { CalendarDisclosureTrigger } from "@/components/widgets/Calendar";
import { ClampText } from "@/components/widgets/ClampText";
import { Clock } from "@/components/widgets/Clock";

import { DotIndicator } from "@/components/widgets/Indicator";
import { MContainer, MContainerProps } from "@/components/widgets/MContainer";
import SimplePopover from "@/components/widgets/SimplePopover";
import { Today } from "@/components/widgets/Today";
import { Interface__Nav } from "@/constants/interfaces";
import { TOP_BAR_H } from "@/constants/styles";
import { useBreadcrumbs } from "@/contexts/useBreadcrumbs";
import useLang from "@/contexts/useLang";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import useScreen from "@/hooks/useScreen";
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
          overflow={"auto"}
          {...restProps}
        >
          {children}
        </CContainer>
      </PageContainerContext.Provider>
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
  const { t } = useLang();
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

      <SimplePopover
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
      </SimplePopover>
    </HStack>
  );
};

export const TopBar = () => {
  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
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
      justify={"space-between"}
      bg={"body"}
      // borderBottom={"1px solid"}
      borderColor={"border.muted"}
    >
      <NavBreadcrumb
        backPath={backPath}
        resolvedActiveNavs={resolvedActiveNavs}
      />

      <HStack flexShrink={0} gap={4}>
        <HStack flexShrink={0}>
          <CalendarDisclosureTrigger>
            <Today fontSize={FONT_SIZE} />
          </CalendarDisclosureTrigger>

          <Clock showTimezone fontSize={FONT_SIZE} />
        </HStack>
      </HStack>
    </HStack>
  );
};

export const PageHeader = (props: StackProps) => {
  // Props
  const { children, title, ...restProps } = props;

  // Contexts
  const { t } = useLang();

  // Hooks
  const pathname = usePathname();

  // Constants
  const activeNavs = getActiveNavs(pathname);
  const navTitle = pluckString(t, last<any>(activeNavs)?.labelKey);

  // Derived Values
  const resolvedTitle = title || navTitle;

  return (
    <HStack flexShrink={0} w={"full"} minH={TOP_BAR_H} px={4} {...restProps}>
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
      <MContainer ref={ref} flex={1} bg={"body"} {...restProps}>
        {isValidDimension ? children : null}
      </MContainer>
    );
  },
);

ContainerLayout.displayName = "ContainerLayout";
PageContainer.displayName = "PageContainer";
PageContent.displayName = "PageContent";
