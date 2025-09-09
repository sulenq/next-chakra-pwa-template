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
    // Props
    const { portalled = true, portalRef, ...restProps } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content
            ref={ref}
            className={"ss"}
            w={"150px"}
            gap={1}
            px={0}
            py={1}
            bg={"body !important"}
            border={"1px solid {colors.d2}"}
            rounded={themeConfig.radii.container}
            boxShadow={"none"}
            {...restProps}
          />
        </ChakraMenu.Positioner>
      </Portal>
    );
  }
);

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    //Props
    const { children, ...restProps } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <CContainer px={1}>
        <ChakraMenu.Item
          gap={4}
          ref={ref}
          py={"8px !important"}
          cursor={"pointer"}
          rounded={themeConfig.radii.component}
          {...restProps}
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
  const { children, ...restProps } = props;
  return (
    <ChakraMenu.RadioItem ps="8" ref={ref} {...restProps}>
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
  const { title, children, ...restProps } = props;
  return (
    <ChakraMenu.ItemGroup ref={ref} {...restProps}>
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

    const { startIcon, children, ...restProps } = props;
    return (
      <ChakraMenu.TriggerItem
        ref={ref}
        rounded={themeConfig.radii.component}
        {...restProps}
      >
        {startIcon}
        {children}
        <LuChevronRight />
      </ChakraMenu.TriggerItem>
    );
  }
);

export const MenuRoot = (props: MenuRootProps) => {
  const { children, ...restProps } = props;
  return (
    <ChakraMenu.Root
      positioning={{ hideWhenDetached: true }}
      unmountOnExit={false}
      {...restProps}
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
