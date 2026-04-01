"use client";

import { P, PProps } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { InfoTip } from "@/components/widgets/info-tip";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import { HStack, StackProps } from "@chakra-ui/react";
import { createContext, forwardRef, useContext, useMemo, useRef } from "react";

// -----------------------------------------------------------------

export interface ItemContextInterface {
  dimension: {
    width: number;
    height: number;
  };
  isValidDimension: boolean;
  isSmContainer: boolean;
}

const ItemContext = createContext<ItemContextInterface | null>(null);

export function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useViewContext must be used inside Item.Root");
  }
  return context;
}

interface ItemRootProps extends StackProps {
  scrollY?: boolean;
  provideContext?: boolean;
}

const ItemRoot = forwardRef<HTMLDivElement, ItemRootProps>(
  function ItemBody(props, ref) {
    const {
      children,
      scrollY = false,
      provideContext = false,
      className,
      ...restProps
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const mergeRef = useMergedRefs(containerRef, ref);

    const dimension = useContainerDimension(containerRef);

    const isValidDimension = dimension.width > 0 && dimension.height > 0;
    const isSmContainer = dimension.width < 600;

    const contextValue = useMemo(
      () => ({ dimension, isValidDimension, isSmContainer }),
      [dimension, isValidDimension, isSmContainer],
    );

    const content = (
      <StackV
        ref={mergeRef}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        w={"full"}
        borderColor={"border.subtle"}
        {...restProps}
      >
        {children}
      </StackV>
    );

    if (!provideContext) return content;

    return (
      <ItemContext.Provider value={contextValue}>
        {content}
      </ItemContext.Provider>
    );
  },
);

// -----------------------------------------------------------------

export interface ItemHeaderProps extends StackProps {
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

export interface ItemBodyProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}

const ItemBody = forwardRef<HTMLDivElement, ItemBodyProps>(
  function ItemBody(props, ref) {
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
  Root: ItemRoot,
  Header: ItemHeader,
  Title: ItemTitle,
  Body: ItemBody,
};
