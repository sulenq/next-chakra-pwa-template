"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { P, PProps } from "@/components/ui/p";
import { Stack, StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { Calendar } from "@/components/widgets/calendar";
import { ClampText } from "@/components/widgets/clamp-text";
import { Clock } from "@/components/widgets/clock";
import { DotIndicator } from "@/components/widgets/indicator";
import { Today } from "@/components/widgets/today";
import { ToggleTip } from "@/components/widgets/toggle-tip";
import {
  R_SPACING_MD,
  SM_SCREEN_W_NUMBER,
  TOP_BAR_H,
} from "@/constants/styles";
import { useBreadcrumbs } from "@/contexts/use-breadcrumbs-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeConfig } from "@/contexts/use-theme-context";
import { useContainerDimension } from "@/hooks/use-container-dimenssion";
import { useMergedRefs } from "@/hooks/use-merge-refs";
import { useScreen } from "@/hooks/use-screen";
import { Nav } from "@/types/global.types";
import { isEmptyArray, last } from "@/utils/array";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
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

          {activeNavs.map((nav: Nav, index: number) => {
            return (
              <HStack key={index} gap={0} color={"fg.subtle"}>
                {index !== 0 && (
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

export interface TopBarProps extends StackProps {
  showDateTime?: boolean;
}
export const TopBar = (props: TopBarProps) => {
  // Props
  const { showDateTime = true, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeConfig();
  const { dimension } = useMainViewContext();

  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  // Derived Values
  const isSmContainer = dimension.width < 650;

  if (showDateTime)
    return (
      <StackH
        flexShrink={0}
        justify={"space-between"}
        gap={2}
        w={"full"}
        rounded={themeContext.radii.container}
        {...restProps}
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
            <Today dateVariant={"numeric"} fontSize={"sm"} />
          </Calendar.Trigger>

          {!isSmContainer && <Divider dir={"vertical"} mx={2} h={"20px"} />}

          <Clock fontSize={"sm"} />
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

export function useMainViewContext() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useMainViewContext must be used inside MainView.Root");
  }
  return context;
}

const MainViewRoot = forwardRef<HTMLDivElement, StackProps>(
  function MainViewRoot({ children, ...restProps }, ref) {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const mergeRef = useMergedRefs(containerRef, ref);

    // Hooks
    const dimension = useContainerDimension(containerRef);

    // States
    const isValidDimension = dimension.width > 0 && dimension.height > 0;
    const isSmContainer = dimension.width < SM_SCREEN_W_NUMBER;

    // Constants
    const contextValue = useMemo(
      () => ({ dimension, isValidDimension, isSmContainer }),
      [dimension, isValidDimension, isSmContainer],
    );

    return (
      <ViewContext.Provider value={contextValue}>
        <StackV
          ref={mergeRef}
          className={"MainViewRoot"}
          flex={1}
          overflow={"auto"}
          {...restProps}
        >
          {isValidDimension && children}
        </StackV>
      </ViewContext.Provider>
    );
  },
);

// -----------------------------------------------------------------

const MainViewContent = forwardRef<HTMLDivElement, StackProps>(
  function MainViewContent(props, ref) {
    // Props
    const { children, ...restProps } = props;

    // Contexts
    const { isValidDimension } = useMainViewContext();

    return (
      <StackV
        ref={ref}
        className={"MainViewContent"}
        flex={1}
        overflow={"auto"}
        {...restProps}
      >
        {isValidDimension ? children : null}
      </StackV>
    );
  },
);

// -----------------------------------------------------------------

export interface MainViewHeaderProps extends StackProps {
  withTitle?: boolean;
  title?: string;
  MainViewTitleProps?: PProps;
}

const MainViewHeader = (props: MainViewHeaderProps) => {
  // Props
  const {
    children,
    withTitle = false,
    title,
    MainViewTitleProps,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeConfig();

  // Hooks
  const pathname = usePathname();

  // Constants
  const activeNavs = getActiveNavs(pathname);
  const navTitle =
    last<any>(activeNavs)?.label ||
    pluckString(t, last<any>(activeNavs)?.labelKey);

  // Derived Values
  const resolvedTitle = title || navTitle;

  return (
    <HStack
      className={"MainViewHeader"}
      flexShrink={0}
      w={"full"}
      minH={TOP_BAR_H}
      px={R_SPACING_MD}
      pb={R_SPACING_MD}
      rounded={themeContext.radii.container}
      {...restProps}
    >
      {withTitle && (
        <MainViewTitle {...MainViewTitleProps}>{resolvedTitle}</MainViewTitle>
      )}

      {children}
    </HStack>
  );
};

// -----------------------------------------------------------------

const MainViewTitle = (props: PProps) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <ClampText
      className={"MainViewTitle"}
      fontSize={"xl"}
      fontWeight={"medium"}
      textAlign={restProps.textAlign}
      {...restProps}
    >
      {capitalizeWords(children)}
    </ClampText>
  );
};

export const MainView = {
  Root: MainViewRoot,
  Content: MainViewContent,
  Header: MainViewHeader,
  Title: MainViewTitle,
};
