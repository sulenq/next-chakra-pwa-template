"use client";

import { CContainer } from "@/components/ui/c-container";
import { P, PProps } from "@/components/ui/p";
import { InfoTip } from "@/components/widgets/info-tip";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { HStack, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface ItemContainerProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}
const ItemContainer = forwardRef<HTMLDivElement, ItemContainerProps>(
  (props, ref) => {
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
      <CContainer
        ref={ref}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        bg={"bg.frosted"}
        rounded={roundedless ? "" : themeConfig.radii.container}
        border={borderless ? "" : "1px solid"}
        borderColor={"border.muted"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  },
);

interface ItemHeaderContainerProps extends StackProps {
  borderless?: boolean;
}
const ItemHeaderContainer = forwardRef<
  HTMLDivElement,
  ItemHeaderContainerProps
>((props, ref) => {
  // Props
  const { children, borderless = false, ...restProps } = props;

  return (
    <HStack
      ref={ref}
      wrap={"wrap"}
      justify={"space-between"}
      minH={"50px"}
      gapX={4}
      px={4}
      py={1}
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.subtle"}
      {...restProps}
    >
      {children}
    </HStack>
  );
});

export interface ItemHeaderTitleProps extends PProps {
  popoverContent?: string;
  autoHeight?: boolean;
}
const ItemHeaderTitle = forwardRef<HTMLDivElement, ItemHeaderTitleProps>(
  (props, ref) => {
    // Props
    const { children, popoverContent, autoHeight, ...restProps } = props;

    return (
      <HStack ref={ref} gap={1} w={"fit"} minH={autoHeight ? "" : "42px"}>
        <P fontWeight={"medium"} {...restProps}>
          {children}
        </P>

        {popoverContent && <InfoTip popoverContent={popoverContent} />}
      </HStack>
    );
  },
);

ItemContainer.displayName = "ItemContainer";
ItemHeaderContainer.displayName = "ItemHeaderContainer";
ItemHeaderTitle.displayName = "ItemHeaderTitle";

export const Item = {
  Container: ItemContainer,
  HeaderContainer: ItemHeaderContainer,
  HeaderTitle: ItemHeaderTitle,
};
