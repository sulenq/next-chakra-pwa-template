"use client";

import { SM_SCREEN_W_NUMBER } from "@/constants/sizes";
import { useThemeConfig } from "@/context/useThemeConfig";
import { client } from "@/utils/client";
import {
  Center,
  Toaster as ChakraToaster,
  Icon,
  Portal,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useColorMode } from "./color-mode";
import Spinner from "@/components/ui/spinner";

const TOAST_PROPS = {
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
  const toast = TOAST_PROPS[type as keyof typeof TOAST_PROPS];

  return (
    <Center
      bg={toast.bg[colorMode]}
      rounded={"full"}
      w={"32px"}
      h={"32px"}
      ml={"-2px"}
      mt={"-2px"}
    >
      <Icon color={toast.color}>{toast.icon}</Icon>
    </Center>
  );
};

export const toaster = createToaster({
  placement:
    client() && window.innerWidth < SM_SCREEN_W_NUMBER ? "top" : "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const { themeConfig } = useThemeConfig();

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
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
            >
              {toast.type === "loading" ? (
                <Center
                  bg={`bg.muted`}
                  rounded={"full"}
                  p={"6px"}
                  w={"32px"}
                  h={"32px"}
                  ml={-1}
                  mt={-1}
                >
                  <Spinner w={"14px"} h={"14px"} color={"fg.muted"} />
                </Center>
              ) : (
                <ToastIcon type={toast.type} />
              )}

              <Stack gap="1" flex="1" maxWidth="100%" ml={1}>
                {toast.title && (
                  <Toast.Title fontWeight={"medium"}>{toast.title}</Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description>{toast.description}</Toast.Description>
                )}
              </Stack>

              {toast.action && (
                <Toast.ActionTrigger
                  rounded={6}
                  borderColor={"border.muted"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "bg.muted",
                  }}
                >
                  {toast.action.label}
                </Toast.ActionTrigger>
              )}
              {toast.meta?.closable && <Toast.CloseTrigger />}
            </Toast.Root>
          );
        }}
      </ChakraToaster>
    </Portal>
  );
};
