"use client";

import { Btn } from "@/components/ui/btn";
import { Dialog, DialogContentProps } from "@/components/ui/dialog";
import { Drawer, DrawerContentProps } from "@/components/ui/drawer";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { SM_SCREEN_BREAKPOINT } from "@/constants/styles";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { useScreen } from "@/hooks/use-screen";
import { back } from "@/utils/client";
import {
  Box,
  DialogActionTriggerProps,
  DialogBackdropProps,
  DialogBodyProps,
  DialogCloseTriggerProps,
  DialogFooterProps,
  DialogHeaderProps,
  DrawerActionTriggerProps,
  DrawerBackdropProps,
  DrawerBodyProps,
  DrawerCloseTriggerProps,
  DrawerFooterProps,
  DrawerHeaderProps,
} from "@chakra-ui/react";
import { MaximizeIcon, MinimizeIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const DisclosureRoot = ({ children, ...props }: any) => {
  // Utils
  const { sw } = useScreen();
  const iss = sw < SM_SCREEN_BREAKPOINT;

  return iss ? (
    <Drawer.Root placement={"bottom"} {...props}>
      {children}
    </Drawer.Root>
  ) : (
    <Dialog.Root placement={"center"} scrollBehavior={"inside"} {...props}>
      {children}
    </Dialog.Root>
  );
};

// -----------------------------------------------------------------

type DisclosureBackdropProps = {} & (DrawerBackdropProps | DialogBackdropProps);

const DisclosureBackdrop = ({ ...props }: DisclosureBackdropProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Backdrop {...(props as DrawerBackdropProps)} />
  ) : (
    <Dialog.Backdrop {...(props as DialogBackdropProps)} />
  );
};

// -----------------------------------------------------------------

const DisclosureTrigger = ({ children }: any) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Trigger asChild>{children}</Drawer.Trigger>
  ) : (
    <Dialog.Trigger asChild>{children}</Dialog.Trigger>
  );
};

// -----------------------------------------------------------------

type DisclosureContentProps = {
  children: React.ReactNode;
} & (DrawerContentProps | DialogContentProps);

const DisclosureContent = ({ children, ...props }: DisclosureContentProps) => {
  const { themeContext } = useThemeContext();
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Content
      rounded={themeContext.radii.container}
      border={"1px solid"}
      borderColor={"bg.subtle"}
      {...(props as DrawerContentProps)}
    >
      <Box
        w={"40px"}
        h={"4px"}
        rounded={"full"}
        bg={"bg.emphasized"}
        mx={"auto"}
        mt={"6px"}
      />

      {children}
    </Drawer.Content>
  ) : (
    <Dialog.Content
      rounded={themeContext.radii.container}
      border={"1px solid"}
      borderColor={"d0"}
      {...(props as DialogContentProps)}
    >
      {children}
    </Dialog.Content>
  );
};

// -----------------------------------------------------------------

type DisclosureHeaderProps = {
  children: React.ReactNode;
} & (DrawerHeaderProps | DialogHeaderProps);

const DisclosureHeader = ({ children, ...props }: DisclosureHeaderProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Header
      px={4}
      pt={2}
      pb={4}
      // borderBottom={"1px solid"}
      borderColor={children ? "d1" : ""}
      {...(props as DrawerHeaderProps)}
    >
      {children}
    </Drawer.Header>
  ) : (
    <Dialog.Header
      p={3}
      pl={4}
      borderBottom={"1px solid"}
      borderColor={children ? "border.subtle" : ""}
      {...(props as DialogHeaderProps)}
    >
      {children}
    </Dialog.Header>
  );
};

// -----------------------------------------------------------------

export interface DisclosureHeaderContentProps {
  title?: string;
  withCloseButton?: boolean;
  withMaximizeButton?: boolean;
  onMaximizeChange?: (maximize: boolean) => void;
  content?: any;
  prefix?: "drawer" | "dialog";
  children?: any;
}

export const DisclosureHeaderContent = (
  props: DisclosureHeaderContentProps,
) => {
  // Props
  const {
    title,
    withCloseButton = true,
    withMaximizeButton = false,
    onMaximizeChange,
    prefix,
    content,
    children,
    ...restProps
  } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [maximize, setMaximize] = useState(false);

  useEffect(() => {
    onMaximizeChange?.(maximize);
  }, [maximize]);

  return (
    <StackH
      align={"center"}
      justify={"space-between"}
      w={"full"}
      {...restProps}
    >
      {content ? (
        content
      ) : (
        <P fontWeight={"medium"} ml={!prefix ? [0, null, 0] : ""}>
          {title}
        </P>
      )}

      <StackH w={"fit"} align={"center"} ml={"auto"} gap={[0, null, 2]}>
        {children}

        {withMaximizeButton && (
          <Btn
            clicky={false}
            iconButton
            size={["xs", null, "2xs"]}
            rounded={"full"}
            variant={iss ? "ghost" : "subtle"}
            onClick={() => {
              setMaximize((ps) => !ps);
            }}
          >
            <AppIconLucide
              icon={maximize ? MinimizeIcon : MaximizeIcon}
              boxSize={3.5}
            />
          </Btn>
        )}

        {withCloseButton && (
          <>
            {!prefix && (
              <Btn
                iconButton
                clicky={false}
                rounded={"full"}
                variant={iss ? "ghost" : "subtle"}
                size={["xs", null, "2xs"]}
                onClick={back}
              >
                <AppIconLucide icon={XIcon} boxSize={4} />
              </Btn>
            )}
          </>
        )}
      </StackH>
    </StackH>
  );
};

// -----------------------------------------------------------------

type DisclosureBodyProps = {
  children: React.ReactNode;
} & (DrawerBodyProps | DialogBodyProps);

const DisclosureBody = ({ children, ...props }: DisclosureBodyProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Body
      px={4}
      // pr={`calc(16px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
      py={2}
      className={props.className || "scrollY"}
      {...(props as DrawerHeaderProps)}
    >
      {children}
    </Drawer.Body>
  ) : (
    <Dialog.Body
      px={4}
      // pr={`calc(16px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
      py={4}
      className={props.className || "scrollY"}
      {...(props as DialogBodyProps)}
    >
      {children}
    </Dialog.Body>
  );
};

// -----------------------------------------------------------------

type DisclosureFooterProps = {
  children: React.ReactNode;
} & (DrawerFooterProps | DialogFooterProps);

const DisclosureFooter = ({ children, ...props }: DisclosureFooterProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.Footer
      px={4}
      pt={5}
      pb={6}
      // borderTop={"1px solid"}
      borderColor={"border.subtle"}
      {...(props as DrawerHeaderProps)}
    >
      <StackV align={"stretch"} gap={2}>
        {children}
      </StackV>
    </Drawer.Footer>
  ) : (
    <Dialog.Footer
      p={4}
      borderTop={"1px solid"}
      borderColor={"border.subtle"}
      {...(props as DialogFooterProps)}
    >
      <StackH align={"center"} justify={"end"} gap={2} w={"full"}>
        {children}
      </StackH>
    </Dialog.Footer>
  );
};

// -----------------------------------------------------------------

type DisclosureActionTriggerProps = {} & (
  | DrawerActionTriggerProps
  | DialogActionTriggerProps
);

const DisclosureActionTrigger = ({
  children,
  ...props
}: DisclosureActionTriggerProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.ActionTrigger
      onClick={back}
      {...(props as DrawerActionTriggerProps)}
    >
      {children}
    </Drawer.ActionTrigger>
  ) : (
    <Dialog.ActionTrigger
      onClick={back}
      {...(props as DialogActionTriggerProps)}
    >
      {children}
    </Dialog.ActionTrigger>
  );
};

// -----------------------------------------------------------------

type DisclosureCloseTriggerProps = {} & (
  | DrawerCloseTriggerProps
  | DialogCloseTriggerProps
);

const DisclosureCloseTrigger = ({
  children,
  ...props
}: DisclosureCloseTriggerProps) => {
  const iss = useIsSmScreenWidth();

  return iss ? (
    <Drawer.CloseTrigger
      mt={"1px"}
      onClick={back}
      {...(props as DrawerCloseTriggerProps)}
    >
      {children}
    </Drawer.CloseTrigger>
  ) : (
    <Dialog.CloseTrigger
      // mr={"-2px"}
      mt={"-2px"}
      bg={"bg.muted"}
      onClick={back}
      {...(props as DialogCloseTriggerProps)}
    >
      {children}
    </Dialog.CloseTrigger>
  );
};

// -----------------------------------------------------------------

export const Disclosure = {
  Root: DisclosureRoot,
  Content: DisclosureContent,
  Header: DisclosureHeader,
  HeaderContent: DisclosureHeaderContent,
  Body: DisclosureBody,
  Footer: DisclosureFooter,
  Backdrop: DisclosureBackdrop,
  Trigger: DisclosureTrigger,
  ActionTrigger: DisclosureActionTrigger,
  CloseTrigger: DisclosureCloseTrigger,
};
