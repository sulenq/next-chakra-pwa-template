"use client";

import { BACKDROP_BLUR_FILTER, GAP } from "@/constants/styles";
import { useThemeConfig } from "@/contexts/useThemeConfig";
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

// -----------------------------------------------------------------

const MenuRoot = (props: MenuRootProps) => {
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

// -----------------------------------------------------------------

interface MenuTriggerProps extends ChakraMenu.TriggerProps {}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  function MenuTrigger(props, ref) {
    const { children, ...restProps } = props;

    return (
      <ChakraMenu.Trigger
        ref={ref}
        // _focusVisible={{
        //   border: "none !important",
        //   outline: "none !important",
        //   boxShadow: "none !important",
        // }}
        {...restProps}
      >
        {children}
      </ChakraMenu.Trigger>
    );
  },
);

// -----------------------------------------------------------------

interface MenuTriggerItemProps extends ChakraMenu.ItemProps {
  startIcon?: React.ReactNode;
}

const MenuTriggerItem = forwardRef<HTMLDivElement, MenuTriggerItemProps>(
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
  },
);

// -----------------------------------------------------------------

interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
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
            w={"160px"}
            gap={1}
            p={GAP}
            bg={"bg.body"}
            backdropFilter={BACKDROP_BLUR_FILTER}
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={themeConfig.radii.component}
            shadow={"soft"}
            {...restProps}
          />
        </ChakraMenu.Positioner>
      </Portal>
    );
  },
);

// -----------------------------------------------------------------

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    //Props
    const { children, asChild, ...restProps } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <ChakraMenu.Item
        gap={3}
        ref={ref}
        py={asChild ? undefined : "8px !important"}
        cursor={"pointer"}
        fontSize={asChild ? undefined : "md"}
        rounded={
          asChild ? undefined : `calc(${themeConfig.radii.component} - 2px)`
        }
        _hover={
          asChild
            ? undefined
            : {
                bg: "bg.muted",
              }
        }
        asChild={asChild}
        {...restProps}
      >
        {children}
      </ChakraMenu.Item>
    );
  },
);

// -----------------------------------------------------------------

const MenuArrow = forwardRef<HTMLDivElement, ChakraMenu.ArrowProps>(
  function MenuArrow(props, ref) {
    return (
      <ChakraMenu.Arrow ref={ref} {...props}>
        <ChakraMenu.ArrowTip />
      </ChakraMenu.Arrow>
    );
  },
);

// -----------------------------------------------------------------

const MenuCheckboxItem = forwardRef<
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

// -----------------------------------------------------------------

const MenuRadioItem = forwardRef<HTMLDivElement, ChakraMenu.RadioItemProps>(
  function MenuRadioItem(props, ref) {
    const { children, ...restProps } = props;
    return (
      <ChakraMenu.RadioItem ps={"8"} ref={ref} {...restProps}>
        <AbsoluteCenter axis={"horizontal"} left={"4"} asChild>
          <ChakraMenu.ItemIndicator>
            <LuCheck />
          </ChakraMenu.ItemIndicator>
        </AbsoluteCenter>
        <ChakraMenu.ItemText>{children}</ChakraMenu.ItemText>
      </ChakraMenu.RadioItem>
    );
  },
);

// -----------------------------------------------------------------

const MenuItemGroup = forwardRef<HTMLDivElement, ChakraMenu.ItemGroupProps>(
  function MenuItemGroup(props, ref) {
    const { title, children, ...restProps } = props;
    return (
      <ChakraMenu.ItemGroup ref={ref} {...restProps}>
        {title && (
          <ChakraMenu.ItemGroupLabel
            fontSize={"sm"}
            color={"fg.subtle"}
            userSelect={"none"}
            pl={3}
            lineHeight={1.2}
          >
            {title}
          </ChakraMenu.ItemGroupLabel>
        )}
        {children}
      </ChakraMenu.ItemGroup>
    );
  },
);

// -----------------------------------------------------------------

const MenuSeparator = (props: MenuSeparatorProps) => {
  return <ChakraMenu.Separator mx={2} {...props} />;
};

// -----------------------------------------------------------------

const MenuRadioItemGroup = ChakraMenu.RadioItemGroup;

// -----------------------------------------------------------------

const MenuContextTrigger = ChakraMenu.ContextTrigger;

// -----------------------------------------------------------------

const MenuItemText = ChakraMenu.ItemText;

// -----------------------------------------------------------------

const MenuItemCommand = ChakraMenu.ItemCommand;

// -----------------------------------------------------------------

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  TriggerItem: MenuTriggerItem,
  Content: MenuContent,
  Item: MenuItem,
  Arrow: MenuArrow,
  CheckboxItem: MenuCheckboxItem,
  RadioItem: MenuRadioItem,
  ItemGroup: MenuItemGroup,
  Separator: MenuSeparator,
  RadioItemGroup: MenuRadioItemGroup,
  ContextTrigger: MenuContextTrigger,
  ItemText: MenuItemText,
  ItemCommand: MenuItemCommand,
};
