"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  AbsoluteCenter,
  Menu as ChakraMenu,
  MenuItemProps,
  MenuRootProps,
  MenuSeparatorProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { LuCheck, LuChevronRight } from "react-icons/lu";

interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(props, ref) {
    // Contexts
    const { portalled = true, portalRef, ...rest } = props;
    const { themeConfig } = useThemeConfig();

    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content
            className={"ss"}
            boxShadow={"none"}
            bg={"body !important"}
            rounded={themeConfig?.radii.container}
            border={"1px solid {colors.d2}"}
            w={"150px"}
            px={0}
            py={1}
            ref={ref}
            {...rest}
          />
        </ChakraMenu.Positioner>
      </Portal>
    );
  }
);

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    const { children, ...rest } = props;
    const { themeConfig } = useThemeConfig();

    return (
      <CContainer px={1}>
        <ChakraMenu.Item
          gap={4}
          ref={ref}
          py={"6px !important"}
          cursor={"pointer"}
          rounded={themeConfig?.radii.component}
          // color={"white"}
          // _hover={{
          //   bg: "d2",
          // }}
          // _focus={{
          //   bg: "d2",
          // }}
          // _focusVisible={{
          //   bg: "d2",
          // }}
          {...rest}
        >
          {children}
        </ChakraMenu.Item>
      </CContainer>
    );
  }
);

export const MenuArrow = forwardRef<HTMLDivElement, ChakraMenu.ArrowProps>(
  function MenuArrow(props, ref) {
    return (
      <ChakraMenu.Arrow ref={ref} {...props}>
        <ChakraMenu.ArrowTip />
      </ChakraMenu.Arrow>
    );
  }
);

export const MenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ChakraMenu.CheckboxItemProps
>(function MenuCheckboxItem(props, ref) {
  return (
    <ChakraMenu.CheckboxItem ref={ref} {...props}>
      <ChakraMenu.ItemIndicator hidden={false}>
        <LuCheck />
      </ChakraMenu.ItemIndicator>
      {props.children}
    </ChakraMenu.CheckboxItem>
  );
});

export const MenuRadioItem = forwardRef<
  HTMLDivElement,
  ChakraMenu.RadioItemProps
>(function MenuRadioItem(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraMenu.RadioItem ps="8" ref={ref} {...rest}>
      <AbsoluteCenter axis="horizontal" left="4" asChild>
        <ChakraMenu.ItemIndicator>
          <LuCheck />
        </ChakraMenu.ItemIndicator>
      </AbsoluteCenter>
      <ChakraMenu.ItemText>{children}</ChakraMenu.ItemText>
    </ChakraMenu.RadioItem>
  );
});

export const MenuItemGroup = forwardRef<
  HTMLDivElement,
  ChakraMenu.ItemGroupProps
>(function MenuItemGroup(props, ref) {
  const { title, children, ...rest } = props;
  return (
    <ChakraMenu.ItemGroup ref={ref} {...rest}>
      {title && (
        <ChakraMenu.ItemGroupLabel color={"fg.subtle"} userSelect="none">
          {title}
        </ChakraMenu.ItemGroupLabel>
      )}
      {children}
    </ChakraMenu.ItemGroup>
  );
});

export interface MenuTriggerItemProps extends ChakraMenu.ItemProps {
  startIcon?: React.ReactNode;
}

export const MenuTriggerItem = forwardRef<HTMLDivElement, MenuTriggerItemProps>(
  function MenuTriggerItem(props, ref) {
    // Contexts
    const { themeConfig } = useThemeConfig();

    const { startIcon, children, ...rest } = props;
    return (
      <ChakraMenu.TriggerItem
        ref={ref}
        rounded={themeConfig.radii.component}
        {...rest}
      >
        {startIcon}
        {children}
        <LuChevronRight />
      </ChakraMenu.TriggerItem>
    );
  }
);

export const MenuRoot = (props: MenuRootProps) => {
  const { children, ...rest } = props;
  return (
    <ChakraMenu.Root
      positioning={{ hideWhenDetached: true }}
      unmountOnExit={false}
      {...rest}
    >
      {children}
    </ChakraMenu.Root>
  );
};

export const MenuSeparator = (props: MenuSeparatorProps) => {
  return <ChakraMenu.Separator {...props} />;
};

export const MenuRadioItemGroup = ChakraMenu.RadioItemGroup;
export const MenuContextTrigger = ChakraMenu.ContextTrigger;
export const MenuItemText = ChakraMenu.ItemText;
export const MenuItemCommand = ChakraMenu.ItemCommand;
export const MenuTrigger = ChakraMenu.Trigger;
