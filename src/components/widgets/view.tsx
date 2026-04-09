"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { P, PProps } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { Calendar } from "@/components/widgets/calendar";
import { ClampText } from "@/components/widgets/clamp-text";
import { Clock } from "@/components/widgets/clock";
import { DotIndicator } from "@/components/widgets/indicator";
import { Today } from "@/components/widgets/today";
import { ToggleTip } from "@/components/widgets/toggle-tip";
import { Interface__Nav } from "@/constants/interfaces";
import { R_SPACING_MD, TOP_BAR_H } from "@/constants/styles";
import { useBreadcrumbs } from "@/contexts/useBreadcrumbs";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import { useScreen } from "@/hooks/useScreen";
import { isEmptyArray, last } from "@/utils/array";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon, Stack, StackProps } from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { HeadsetIcon, NavigationIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

// -----------------------------------------------------------------

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
      {backPath && (
        <BackButton iconButton clicky={false} backPath={backPath} size={"sm"} />
      )}

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
                        bg={"fg.subtle"}
                        opacity={0.6}
                        mx={2}
                      />
                    )}
                  </>
                )}

                <P fontSize={"sm"} lineClamp={1}>
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

// -----------------------------------------------------------------

export const TopBar = (props: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { dimension } = useViewContext();

  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  // Derived Values
  const isSmContainer = dimension.width < 750;

  return (
    <StackH
      flexShrink={0}
      justify={"space-between"}
      gap={2}
      w={"full"}
      rounded={themeConfig.radii.container}
      {...props}
    >
      <StackH w={"35%"}>
        <NavBreadcrumb
          backPath={backPath}
          resolvedActiveNavs={resolvedActiveNavs}
        />
      </StackH>

      <Stack
        flexDir={isSmContainer ? "column" : "row"}
        align={"center"}
        justify={"center"}
        gap={0}
        w={"30%"}
        color={"fg.muted"}
      >
        <Calendar.Trigger>
          <Today
            dateVariant={"shortWeekdayDayShortMonthYear"}
            fontSize={"sm"}
          />
        </Calendar.Trigger>

        {!isSmContainer && <Divider dir={"vertical"} mx={2} h={"20px"} />}

        <Clock showSeconds fontSize={"sm"} />
      </Stack>

      <StackH justify={"end"} gap={2} w={"35%"}>
        {/* <SearchInput
          queryKey={"quick-navigation"}
          variant={"subtle"}
          icon={<LucideIcon icon={NavigationIcon} />}
          placeholder={t.quick_navigation}
        /> */}

        <Btn iconButton variant={"subtle"} size={"xs"} color={"fg.muted"}>
          <AppIconLucide icon={NavigationIcon} />
        </Btn>

        <Btn iconButton variant={"subtle"} size={"xs"} color={"fg.muted"}>
          <AppIconLucide icon={HeadsetIcon} />
        </Btn>
      </StackH>
    </StackH>
  );
};

// -----------------------------------------------------------------

export const ConstrainedContainer = forwardRef<HTMLDivElement, StackProps>(
  function ConstrainedContainer(props, ref) {
    // Props
    const { children, ...restProps } = props;

    return (
      <StackV
        className={"constrained-container"}
        ref={ref}
        align={"stretch"}
        w={"full"}
        maxW={"720px"}
        mx={"auto"}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);

// -----------------------------------------------------------------

export interface ViewContextInterface {
  dimension: {
    width: number;
    height: number;
  };
  isValidDimension: boolean;
  isSmContainer: boolean;
}

const ViewContext = createContext<ViewContextInterface | null>(null);

export function useViewContext() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useViewContext must be used inside View.Root");
  }
  return context;
}

const ViewRoot = forwardRef<HTMLDivElement, StackProps>(function ViewRoot(
  { children, ...restProps },
  ref,
) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const mergeRef = useMergedRefs(containerRef, ref);

  // Hooks
  const dimension = useContainerDimension(containerRef);

  // States
  const isValidDimension = dimension.width > 0 && dimension.height > 0;
  const isSmContainer = dimension.width < 600;

  // Constants
  const contextValue = useMemo(
    () => ({ dimension, isValidDimension, isSmContainer }),
    [dimension, isValidDimension, isSmContainer],
  );

  return (
    <ViewContext.Provider value={contextValue}>
      <StackV
        ref={mergeRef}
        className={"page-container"}
        flex={1}
        overflow={"auto"}
        {...restProps}
      >
        {isValidDimension && children}
      </StackV>
    </ViewContext.Provider>
  );
});

// -----------------------------------------------------------------

export interface ViewHeaderProps extends StackProps {
  withTitle?: boolean;
  title?: string;
  ViewTitleProps?: PProps;
}

const ViewHeader = (props: ViewHeaderProps) => {
  // Props
  const {
    children,
    withTitle = false,
    title,
    ViewTitleProps,
    ...restProps
  } = props;

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
      px={R_SPACING_MD}
      pb={R_SPACING_MD}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {withTitle && <ViewTitle {...ViewTitleProps}>{resolvedTitle}</ViewTitle>}

      {children}
    </HStack>
  );
};

// -----------------------------------------------------------------

const ViewTitle = (props: PProps) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <ClampText
      fontSize={"xl"}
      fontWeight={"medium"}
      textAlign={restProps.textAlign}
      {...restProps}
    >
      {capitalizeWords(children)}
    </ClampText>
  );
};

// -----------------------------------------------------------------

const ViewContent = forwardRef<HTMLDivElement, StackProps>(
  function ViewContent(props, ref) {
    // Props
    const { children, ...restProps } = props;

    // Contexts
    const { isValidDimension } = useViewContext();

    return (
      <StackV ref={ref} flex={1} overflow={"auto"} {...restProps}>
        {isValidDimension ? children : null}
      </StackV>
    );
  },
);

export const View = {
  Root: ViewRoot,
  Content: ViewContent,
  Header: ViewHeader,
  Title: ViewTitle,
};
