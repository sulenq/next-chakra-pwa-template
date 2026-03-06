"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Popover } from "@/components/ui/popover";
import { AppIcon } from "@/components/widget/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { LucideIcon } from "@/components/widget/Icon";
import { DotIndicator } from "@/components/widget/Indicator";
import { SVGS_PATH } from "@/constants/paths";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useADM from "@/context/useADM";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import useRequest from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { back, removeStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { Icon, PopoverRootProps, StackProps } from "@chakra-ui/react";
import { EclipseIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SIGNOUT_EP = "/api/rski/dashboard/logout";
const MENUS = [
  {
    labelKey: "my_profile",
    icon: UserIcon,
    path: "/settings/profile",
  },
  {
    labelKey: "navs.settings",
    icon: SettingsIcon,
    path: "/settings",
  },
];

interface Props__MiniMyProfile extends StackProps {
  onClose?: () => void;
}
export const ProfileMenu = (props: Props__MiniMyProfile) => {
  // Props
  const { onClose, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);
  const ADM = useADM((s) => s.ADM);

  // Hooks
  const { colorMode, toggleColorMode } = useColorMode();
  const { req } = useRequest({
    id: "sign-out",
    loadingMessage: { ...l.loading_signout },
    successMessage: { ...l.success_signout },
  });
  const router = useRouter();
  router.prefetch("/");

  // States
  const user = getUserData();

  // Utils
  function onSignout() {
    back();

    const url = SIGNOUT_EP;
    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          removeStorage("__access_token");
          removeStorage("__user_data");
          removeAuth();
          router.push("/");
        },
        onError: () => {
          removeAuth();
          router.push("/");
        },
      },
    });
  }

  return (
    <CContainer
      rounded={themeConfig.radii.container}
      overflow={"clip"}
      color={"ibody"}
      {...restProps}
    >
      <CContainer>
        <Img
          src={user?.avatar || `${SVGS_PATH}/no-avatar.svg`}
          alt="avatar"
          aspectRatio={1}
          rounded={themeConfig.radii.component}
        />

        <CContainer bg={"body"} p={4} borderColor={"border.muted"}>
          <P fontWeight={"semibold"}>{user?.name || "Signed out"}</P>
          <P color={"fg.subtle"}>{user?.email || user?.username || "-"}</P>
        </CContainer>
      </CContainer>

      <Divider />

      <CContainer gap={1} p={"6px"}>
        {MENUS.map((menu) => {
          return (
            <NavLink key={menu.path} to={menu.path} w={"full"}>
              <Btn
                clicky={false}
                px={2}
                variant={"ghost"}
                justifyContent={"start"}
                pos={"relative"}
                onClick={() => {
                  onClose?.();
                }}
              >
                <AppIcon icon={menu.icon} />

                {pluckString(l, menu.labelKey)}
              </Btn>
            </NavLink>
          );
        })}

        {!ADM && (
          <Btn
            clicky={false}
            variant={"ghost"}
            px={2}
            onClick={toggleColorMode}
          >
            <AppIcon icon={EclipseIcon} />
            Dark Mode
            <DotIndicator
              color={colorMode === "dark" ? "fg.success" : "gray.muted"}
              ml={"auto"}
              mr={1}
            />
          </Btn>
        )}

        <ConfirmationDisclosureTrigger
          id="signout"
          title="Sign out"
          description={l.msg_signout}
          confirmLabel="Sign out"
          onConfirm={onSignout}
          confirmButtonProps={{
            color: "fg.error",
            colorPalette: "gray",
            variant: "outline",
          }}
          w={"full"}
          onClick={onClose}
        >
          <Btn
            clicky={false}
            px={2}
            variant={"ghost"}
            color={"fg.error"}
            justifyContent={"start"}
          >
            <Icon boxSize={BASE_ICON_BOX_SIZE}>
              <LucideIcon icon={LogOutIcon} />
            </Icon>
            Sign Out
          </Btn>
        </ConfirmationDisclosureTrigger>
      </CContainer>
    </CContainer>
  );
};

interface Props__ProfileMenuTrigger extends StackProps {
  popoverRootProps?: Omit<PopoverRootProps, "children">;
}
export const ProfileMenuTrigger = (props: Props__ProfileMenuTrigger) => {
  // Props
  const { popoverRootProps, ...restProps } = props;

  // Refss
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  useClickOutside(containerRef, onClose);

  // States
  const [open, setOpen] = useState<boolean>(false);

  // Utils
  function onOpen() {
    setOpen(true);
  }
  function onClose() {
    setOpen(false);
  }

  return (
    <Popover.Root open={open} {...popoverRootProps}>
      <Popover.Trigger asChild>
        <CContainer w={"fit"} onClick={onOpen} {...restProps} />
      </Popover.Trigger>

      <Popover.Content ref={containerRef} w={"225px"} zIndex={10}>
        <ProfileMenu onClose={onClose} />
      </Popover.Content>
    </Popover.Root>
  );
};
