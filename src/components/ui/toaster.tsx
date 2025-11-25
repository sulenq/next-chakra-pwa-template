"use client";

import { CContainer } from "@/components/ui/c-container";
import Spinner from "@/components/ui/spinner";
import { SM_SCREEN_W_NUMBER } from "@/constants/sizes";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isClient } from "@/utils/client";
import {
  Center,
  Toaster as ChakraToaster,
  HStack,
  Icon,
  Portal,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import { useColorMode } from "./color-mode";

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
    color: "fg.success",
    bg: {
      light: "green.100",
      dark: "green.800",
    },
    icon: <IconCircleCheck stroke={1.5} />,
  },
  error: {
    color: "fg.error",
    bg: {
      light: "red.100",
      dark: "red.800",
    },
    icon: <IconAlertTriangle stroke={1.6} size={21} />,
  },
  warning: {
    icon: <IconAlertCircle stroke={1.5} />,
    color: "fg.warning",
    bg: {
      light: "orange.100",
      dark: "orange.800",
    },
  },
  info: {
    icon: <IconInfoCircle stroke={1.5} />,
    color: "current",
    bg: {
      light: "bg.muted",
      dark: "bg.muted",
    },
  },
};

const ToastIcon = (props: any) => {
  // Props
  const { type } = props;

  // Contexts
  const { colorMode } = useColorMode();

  // States
  const preset = TOAST_PRESETS[type as keyof typeof TOAST_PRESETS];

  return (
    <Center
      flexShrink={0}
      bg={preset.bg[colorMode]}
      rounded={"full"}
      w={"32px"}
      h={"32px"}
      ml={"-2px"}
      mt={"-2px"}
    >
      <Icon color={preset.color}>{preset.icon}</Icon>
    </Center>
  );
};

export const toaster = createToaster({
  placement:
    isClient() && window.innerWidth < SM_SCREEN_W_NUMBER ? "top" : "bottom-end",
  pauseOnPageIdle: true,
});

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
          w={"32px"}
          h={"32px"}
          ml={"-2px"}
          mt={"-2px"}
          {...restProps}
        >
          <Spinner w={"14px"} h={"14px"} color={"fg.muted"} />
        </Center>
      ) : (
        <ToastIcon type={toast.type} />
      )}
    </>
  );
};
const ToastActionTriggerComponent = (props: any) => {
  // Props
  const { toast, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Toast.ActionTrigger
      rounded={themeConfig.radii.component}
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
const ToastComponent = (props: any) => {
  // Props
  const { toast, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [expanded, setExpanded] = useState<boolean>(false);
  const preset = TOAST_PRESETS[toast.type as keyof typeof TOAST_PRESETS];

  return (
    <Toast.Root
      rounded={themeConfig?.radii?.container}
      width={{ md: "sm" }}
      boxShadow={"none"}
      color={"current"}
      bg={"body !important"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      p={"14px"}
      className="ss"
      h={expanded ? "max" : ""}
      {...restProps}
    >
      {!expanded && <ToastIconComponent toast={toast} />}

      <CContainer gap={2}>
        {expanded && <ToastIconComponent toast={toast} />}

        <CContainer gap={4}>
          <CContainer
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
          </CContainer>

          {expanded && (
            <HStack flexShrink={0} justify={"end"}>
              {toast.action && expanded && (
                <ToastActionTriggerComponent toast={toast} />
              )}
            </HStack>
          )}
        </CContainer>
      </CContainer>

      {toast.action && !expanded && (
        <ToastActionTriggerComponent toast={toast} />
      )}

      {toast.meta?.closable && <Toast.CloseTrigger />}
    </Toast.Root>
  );
};
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
