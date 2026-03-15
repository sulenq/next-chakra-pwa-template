"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { useColorModeValue } from "@/components/ui/color-mode";
import { P, PProps } from "@/components/ui/p";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { ClampText } from "@/components/widgets/clamp-text";

import { DotIndicator } from "@/components/widgets/indicator";
import { MContainerProps } from "@/components/widgets/m-container";
import ToggleTip from "@/components/widgets/toggle-tip";
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
import {
  Box,
  Center,
  Circle,
  HStack,
  Icon,
  StackProps,
} from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { InboxIcon, ListIcon } from "lucide-react";
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

export const AnimatedBg = (props: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      h={"full"}
      bg={`${themeConfig.colorPalette}.900`}
      pos={"relative"}
      overflow={"clip"}
      {...props}
    >
      <CContainer flex={1} pos={"relative"}>
        <Box
          w="full"
          h="full"
          aspectRatio={1}
          bg={`${themeConfig.colorPalette}.500`}
          borderRadius="60% 40% 70% 30% / 50% 60% 40% 70%"
          animation="rotate360 5s linear infinite"
          pos={"absolute"}
          bottom={"-20%"}
          right={"-20%"}
        />

        <Box
          w="65%"
          h="65%"
          aspectRatio={1}
          bg={`${themeConfig.colorPalette}.800`}
          borderRadius="30% 70% 40% 60% / 60% 40% 70% 30%"
          animation="rotate360 7s linear infinite"
          pos={"absolute"}
          bottom={"-20%"}
          left={"-20%"}
        />

        <Box
          w="40%"
          h="40%"
          aspectRatio={1}
          bg={`${themeConfig.colorPalette}.600`}
          borderRadius="60% 40% 70% 30% / 100% 60% 40% 70%"
          animation="rotate360 5s linear infinite"
          pos={"absolute"}
          top={"10%"}
          left={"-10%"}
        />
      </CContainer>

      <Box
        w={"full"}
        h={"full"}
        backdropFilter={"blur(100px)"}
        pos={"absolute"}
        top={0}
        left={0}
      />
    </CContainer>
  );
};

export const RadialGlowBackground = (props: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Constants
  const colorPalette = themeConfig.colorPalette;
  const opacity1 = useColorModeValue(0.025, 0.015);
  const opacity2 = useColorModeValue(0.05, 0.03);

  return (
    <Center
      w={"full"}
      h={"full"}
      overflow={"clip"}
      pos={"absolute"}
      left={0}
      top={0}
      {...props}
    >
      <CContainer h={"full"} pos={"relative"} mt={"100%"}>
        <Circle
          aspectRatio={1}
          w={"160%"}
          bg={`${colorPalette}.solid`}
          opacity={opacity1}
          pos={"absolute"}
          left={"50%"}
          top={"50%"}
          transform={"translate(-50%, -50%)"}
        />

        <Circle
          aspectRatio={1}
          w={"100%"}
          bg={`${colorPalette}.solid`}
          opacity={opacity2}
          pos={"absolute"}
          left={"50%"}
          top={"50%"}
          transform={"translate(-50%, -50%)"}
        />
      </CContainer>

      {/* Blur overlay */}
      <CContainer
        h={"full"}
        backdropFilter={"blur(100px)"}
        pos={"absolute"}
        left={0}
        top={0}
      />
    </Center>
  );
};

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

      <HStack flexShrink={0} gap={1}>
        <Btn
          iconButton
          variant={"ghost"}
          _hover={{
            bg: "d1",
          }}
        >
          <AppIconLucide icon={ListIcon} />
        </Btn>

        <Btn
          iconButton
          variant={"ghost"}
          _hover={{
            bg: "d1",
          }}
        >
          <AppIconLucide icon={InboxIcon} />
        </Btn>
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
const PageContainer = forwardRef<HTMLDivElement, StackProps>(
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
          className={"page-container"}
          flex={1}
          overflow={"auto"}
          {...restProps}
        >
          {isValidDimension && children}
        </CContainer>
      </PageContainerContext.Provider>
    );
  },
);

interface PageHeaderProps extends StackProps {
  withTitle?: boolean;
  title?: string;
  pageTitleProps?: PProps;
}
const PageHeader = (props: PageHeaderProps) => {
  // Props
  const {
    children,
    withTitle = true,
    title,
    pageTitleProps,
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
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {withTitle && <PageTitle {...pageTitleProps}>{resolvedTitle}</PageTitle>}

      {children}
    </HStack>
  );
};

const PageTitle = (props: PProps) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <ClampText
      fontSize={"xl"}
      fontWeight={"semibold"}
      textAlign={restProps.textAlign}
      {...restProps}
    >
      {capitalizeWords(children)}
    </ClampText>
  );
};

const PageContent = forwardRef<HTMLDivElement, MContainerProps>(
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

export const PageShell = {
  Container: PageContainer,
  Content: PageContent,
  Header: PageHeader,
  Title: PageTitle,
};
