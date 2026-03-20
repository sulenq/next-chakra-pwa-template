"use client";

import { CContainer } from "@/components/ui/c-container";
import { P, PProps } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { InfoTip } from "@/components/widgets/info-tip";
import { R_SPACING_MD } from "@/constants/styles";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useColorBody } from "@/hooks/useColorBody";
import { HStack, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface ItemContainerProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}

function ItemContainerBase(
  props: ItemContainerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    scrollY = false,
    className,
    roundedless = false,
    borderless = true,
    ...restProps
  } = props;

  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      ref={ref}
      className={`${scrollY ? "scrollY" : ""} ${className}`}
      bg={"bg.frosted"}
      rounded={roundedless ? "" : themeConfig.radii.container}
      border={borderless ? "" : "1px solid"}
      borderColor={"border.subtle"}
      {...restProps}
    >
      {children}
    </CContainer>
  );
}

const ItemContainer = forwardRef(ItemContainerBase);

// -----------------------------------------------------------------

export interface ItemContentProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}

function ItemContentBase(
  props: ItemContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    scrollY = false,
    className,
    roundedless = false,
    borderless = true,
    ...restProps
  } = props;

  const { themeConfig } = useThemeConfig();

  const BG = useColorBody();

  return (
    <StackV
      ref={ref}
      className={`${scrollY ? "scrollY" : ""} ${className}`}
      bg={BG}
      border={borderless ? "" : "1px solid"}
      borderColor={"border.subtle"}
      rounded={roundedless ? "" : themeConfig.radii.component}
      {...restProps}
    >
      {children}
    </StackV>
  );
}

const ItemContent = forwardRef(ItemContentBase);

// -----------------------------------------------------------------

interface ItemHeaderProps extends StackProps {
  borderless?: boolean;
}

function ItemHeaderBase(
  props: ItemHeaderProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, borderless = false, ...restProps } = props;

  return (
    <StackH
      ref={ref}
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      h={"50px"}
      gapX={4}
      px={R_SPACING_MD}
      py={1}
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.subtle"}
      {...restProps}
    >
      {children}
    </StackH>
  );
}

const ItemHeader = forwardRef(ItemHeaderBase);

// -----------------------------------------------------------------

export interface ItemTitleProps extends PProps {
  popoverContent?: string;
  autoHeight?: boolean;
}

function ItemTitleBase(props: ItemTitleProps, ref: React.Ref<HTMLDivElement>) {
  const { children, popoverContent, autoHeight, ...restProps } = props;

  return (
    <HStack ref={ref} gap={1} w={"fit"} h={autoHeight ? "" : "42px"}>
      <P fontWeight={"medium"} {...restProps}>
        {children}
      </P>

      {popoverContent && <InfoTip popoverContent={popoverContent} />}
    </HStack>
  );
}

const ItemTitle = forwardRef(ItemTitleBase);

// -----------------------------------------------------------------

ItemContainer.displayName = "ItemContainer";
ItemContent.displayName = "ItemContent";
ItemHeader.displayName = "ItemHeader";
ItemTitle.displayName = "ItemTitle";

export const Item = {
  Container: ItemContainer,
  Content: ItemContent,
  Header: ItemHeader,
  Title: ItemTitle,
};
