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
    client() && window.innerWidth < SM_SCREEN_W_NUMBER ? "top" : "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const { themeConfig } = useThemeConfig();

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          const preset =
            TOAST_PRESETS[toast.type as keyof typeof TOAST_PRESETS];

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
                  ml={"-2px"}
                  mt={"-2px"}
                >
                  <Spinner w={"14px"} h={"14px"} color={"fg.muted"} />
                </Center>
              ) : (
                <ToastIcon type={toast.type} />
              )}

              <Stack gap="1" flex="1" maxWidth="100%" ml={1}>
                {toast.title && (
                  <Toast.Title
                    fontSize={"md"}
                    fontWeight={"medium"}
                    color={preset.color}
                  >
                    {toast.title}
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description fontSize={"md"}>
                    {toast.description}
                  </Toast.Description>
                )}
              </Stack>

              {toast.action && (
                <Toast.ActionTrigger
                  rounded={themeConfig.radii.component}
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
