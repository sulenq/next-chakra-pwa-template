"use client";

import { P, PProps } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { InfoTip } from "@/components/widgets/info-tip";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { HStack, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface ItemContainerProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}

const ItemContainer = forwardRef<HTMLDivElement, ItemContainerProps>(
  function ItemContainer(props, ref) {
    // Props
    const {
      children,
      scrollY = false,
      className,
      roundedless = false,
      borderless = true,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <StackV
        ref={ref}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        w={"full"}
        bg={"bg.frosted"}
        rounded={roundedless ? "" : themeConfig.radii.container}
        border={borderless ? "" : "1px solid"}
        borderColor={"border.subtle"}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);

// -----------------------------------------------------------------

export interface ItemContentProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}

const ItemContent = forwardRef<HTMLDivElement, ItemContentProps>(
  function ItemContent(props, ref) {
    // Props
    const {
      children,
      scrollY = false,
      className,
      roundedless = false,
      borderless = true,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <StackV
        ref={ref}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        w={"full"}
        bg={"bg.body"}
        border={borderless ? "" : "1px solid"}
        borderColor={"border.subtle"}
        rounded={roundedless ? "" : themeConfig.radii.component}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);

// -----------------------------------------------------------------

interface ItemHeaderProps extends StackProps {
  borderless?: boolean;
}

const ItemHeader = forwardRef<HTMLDivElement, ItemHeaderProps>(
  function ItemHeader(props, ref) {
    // Props
    const { children, borderless = false, ...restProps } = props;

    return (
      <StackH
        ref={ref}
        wrap={"wrap"}
        align={"center"}
        h={"50px"}
        gapX={2}
        px={4}
        py={1}
        borderBottom={"1px solid"}
        borderColor={borderless ? "transparent" : "border.subtle"}
        {...restProps}
      >
        {children}
      </StackH>
    );
  },
);

// -----------------------------------------------------------------

export interface ItemTitleProps extends PProps {
  popoverContent?: string;
  autoHeight?: boolean;
}

const ItemTitle = forwardRef<HTMLDivElement, ItemTitleProps>(
  function ItemTitle(props, ref) {
    // Props
    const { children, popoverContent, autoHeight, ...restProps } = props;

    return (
      <HStack ref={ref} gap={1} w={"fit"} h={autoHeight ? "" : "42px"}>
        <P fontWeight={"medium"} {...restProps}>
          {children}
        </P>

        {popoverContent && <InfoTip popoverContent={popoverContent} />}
      </HStack>
    );
  },
);

// -----------------------------------------------------------------

export const Item = {
  Container: ItemContainer,
  Content: ItemContent,
  Header: ItemHeader,
  Title: ItemTitle,
};
