"use client";

import { Btn } from "@/components/ui/btn";
import { useColorMode } from "@/components/ui/color-mode";
import { Spinner } from "@/components/ui/spinner";
import { StackH, StackV } from "@/components/ui/stack";
import { LucideIcon } from "@/components/misc/icon";
import { BACKDROP_BLUR_FILTER, SM_SCREEN_BREAKPOINT } from "@/constants/styles";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { isClient } from "@/utils/client";
import {
  Center,
  Toaster as ChakraToaster,
  Icon,
  Portal,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

// -----------------------------------------------------------------

const TOAST_PRESETS = {
  loading: {
    icon: <Spinner w={"14px"} h={"14px"} color={"fg.muted"} />,
    color: "current",
    bg: {
      light: "bg.muted",
      dark: "bg.muted",
    },
  },
  success: {
    icon: <LucideIcon icon={CircleCheckIcon} />,
    color: "fg.success",
    bg: {
      light: "green.100",
      dark: "green.800",
    },
  },
  error: {
    icon: <LucideIcon icon={CircleXIcon} />,
    color: "fg.error",
    bg: {
      light: "red.100",
      dark: "red.800",
    },
  },
  warning: {
    icon: <LucideIcon icon={CircleAlertIcon} />,
    color: "fg.warning",
    bg: {
      light: "orange.100",
      dark: "orange.800",
    },
  },
  info: {
    icon: <LucideIcon icon={InfoIcon} />,
    color: "current",
    bg: {
      light: "bg.muted",
      dark: "bg.muted",
    },
  },
};

// -----------------------------------------------------------------

const ToastIcon = (props: any) => {
  // Props
  const { type } = props;

  // Contexts
  const { colorMode } = useColorMode();

  // States
  const preset = TOAST_PRESETS[type as keyof typeof TOAST_PRESETS];

  // Resolved Values
  const resolvedColorMode =
    colorMode === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : colorMode;

  return (
    <Center
      flexShrink={0}
      bg={preset.bg[resolvedColorMode as keyof typeof preset.bg]}
      rounded={"full"}
      w={"28px"}
      h={"28px"}
      ml={"-2px"}
      mt={"-2px"}
    >
      <Icon color={preset.color}>{preset.icon}</Icon>
    </Center>
  );
};

// -----------------------------------------------------------------

export const toaster = createToaster({
  placement:
    isClient() && window.innerWidth < SM_SCREEN_BREAKPOINT
      ? "top"
      : "bottom-end",
  pauseOnPageIdle: true,
});

// -----------------------------------------------------------------

const ToastIconComponent = (props: any) => {
  // Props
  const { toast, ...restProps } = props;
  return (
    <>
      {toast.type === "loading" ? (
        <Center
          flexShrink={0}
          bg={`bg.muted`}
          rounded={"full"}
          p={"6px"}
          w={"28px"}
          h={"28px"}
          ml={"-2px"}
          mt={"-2px"}
          {...restProps}
        >
          <Spinner w={"16px"} h={"16px"} color={"fg.muted"} />
        </Center>
      ) : (
        <ToastIcon type={toast.type} />
      )}
    </>
  );
};

// -----------------------------------------------------------------

const ToastActionTriggerComponent = (props: any) => {
  // Props
  const { toast, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeContext();

  return (
    <Toast.ActionTrigger
      rounded={themeContext.radii.component}
      borderColor={"border.muted"}
      cursor={"pointer"}
      _hover={{
        bg: "bg.muted",
      }}
      {...restProps}
    >
      {toast.action.label}
    </Toast.ActionTrigger>
  );
};

// -----------------------------------------------------------------

const ToastComponent = (props: any) => {
  // Props
  const { toast, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeContext();

  // States
  const [expanded, setExpanded] = useState<boolean>(false);
  const preset = TOAST_PRESETS[toast.type as keyof typeof TOAST_PRESETS];

  return (
    <Toast.Root
      rounded={themeContext?.radii?.container}
      h={expanded ? "max" : ""}
      w={{ md: "sm" }}
      bg={"bg.body"}
      backdropFilter={BACKDROP_BLUR_FILTER}
      color={"current"}
      p={"14px"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      boxShadow={"none"}
      shadow={"soft"}
      {...restProps}
    >
      <ToastIconComponent toast={toast} />

      <StackV gap={2}>
        <StackV>
          <StackV
            flex={1}
            h={expanded ? "max" : ""}
            maxWidth={"full"}
            gap={1}
            align={"start"}
            ml={1}
          >
            {toast.title && (
              <Toast.Title
                w={"fit"}
                pr={"32px"}
                fontSize={"md"}
                fontWeight={"medium"}
                color={preset.color}
                lineClamp={expanded ? undefined : 1}
                cursor={"pointer"}
                onClick={() => {
                  setExpanded((ps) => !ps);
                }}
              >
                {toast.title}
              </Toast.Title>
            )}
            {toast.description && (
              <Toast.Description
                w={"fit"}
                pr={1}
                fontSize={"md"}
                lineClamp={expanded ? undefined : 1}
                cursor={"pointer"}
                onClick={() => {
                  setExpanded((ps) => !ps);
                }}
              >
                {toast.description}
              </Toast.Description>
            )}
          </StackV>

          {expanded && (
            <StackH align={"center"} flexShrink={0} justify={"end"}>
              {toast.action && expanded && (
                <ToastActionTriggerComponent toast={toast} mt={4} />
              )}
            </StackH>
          )}
        </StackV>
      </StackV>

      {/* {toast.meta?.closable && <Toast.CloseTrigger />} */}

      <StackH align={"center"} pos={"absolute"} top={2} right={2}>
        <Btn
          as={Toast.CloseTrigger}
          iconButton
          size={"2xs"}
          variant={"subtle"}
          rounded={"full"}
          pos={"static"}
        >
          <Icon boxSize={4}>
            <LucideIcon icon={XIcon} />
          </Icon>
        </Btn>
      </StackH>
    </Toast.Root>
  );
};

// -----------------------------------------------------------------

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          return <ToastComponent toast={toast} />;
        }}
      </ChakraToaster>
    </Portal>
  );
};
