"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Spinner } from "@/components/ui/spinner";
import { LucideIcon } from "@/components/widget/Icon";
import { SM_SCREEN_W_NUMBER } from "@/constants/styles";
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
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
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
      w={"28px"}
      h={"28px"}
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
      <ToastIconComponent toast={toast} />

      <CContainer gap={2}>
        <CContainer>
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
                <ToastActionTriggerComponent toast={toast} mt={4} />
              )}
            </HStack>
          )}
        </CContainer>
      </CContainer>

      {/* {toast.meta?.closable && <Toast.CloseTrigger />} */}

      <HStack pos={"absolute"} top={2} right={2}>
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
      </HStack>
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
