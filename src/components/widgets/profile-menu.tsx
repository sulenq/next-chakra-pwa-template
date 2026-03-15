"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { Img, ImgFallback } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Popover } from "@/components/ui/popover";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import { LucideIcon } from "@/components/widgets/icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { AUTH_API_SIGNOUT } from "@/constants/apis";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useADM from "@/contexts/useADM";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRequest } from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { back, removeStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Icon, PopoverRootProps, StackProps } from "@chakra-ui/react";
import { EclipseIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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

interface ProfileMenuProps extends StackProps {
  handleClose?: () => void;
}
export const ProfileMenu = (props: ProfileMenuProps) => {
  // Props
  const { handleClose, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);
  const ADM = useADM((s) => s.ADM);

  // Hooks
  const { colorMode, toggleColorMode } = useColorMode();
  const { req } = useRequest({
    id: "sign-out",
    loadingMessage: { ...t.loading_signout },
    successMessage: { ...t.success_signout },
  });
  const router = useRouter();
  router.prefetch("/");

  // States
  const user = getUserData();

  // Utils
  function onSignout() {
    back();

    const url = AUTH_API_SIGNOUT;
    const config = {
      url,
      method: "POST",
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
      bg={"bg.body"}
      color={"fg.ibody"}
      {...restProps}
    >
      <CContainer>
        <CContainer p={1} pb={0}>
          <Img
            src={imgUrl(user?.avatar?.[0]?.filePath)}
            alt={"avatar"}
            aspectRatio={1}
            fallback={<ImgFallback icon={UserIcon} />}
            rounded={themeConfig.radii.component}
          />
        </CContainer>

        <CContainer bg={"bg.body"} p={4} borderColor={"border.muted"}>
          <P fontWeight={"semibold"}>{user?.name || "Signed out"}</P>
          <P color={"fg.subtle"}>{user?.email || user?.username || "-"}</P>
        </CContainer>
      </CContainer>

      <Divider />

      <CContainer gap={1} p={"6px"}>
        {!ADM && (
          <Btn
            clicky={false}
            variant={"ghost"}
            px={2}
            onClick={toggleColorMode}
          >
            <AppIconLucide icon={EclipseIcon} />
            Dark Mode
            <DotIndicator
              color={colorMode === "dark" ? "fg.success" : "bg.muted"}
              ml={"auto"}
              mr={1}
            />
          </Btn>
        )}

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
                  handleClose?.();
                }}
              >
                <AppIconLucide icon={menu.icon} />

                {pluckString(t, menu.labelKey)}
              </Btn>
            </NavLink>
          );
        })}

        <Confirmation.Trigger
          id="signout"
          title="Sign out"
          description={t.msg_signout}
          confirmLabel="Sign out"
          onConfirm={() => {
            onSignout();
            handleClose?.();
          }}
          confirmButtonProps={{
            color: "fg.error",
            colorPalette: "gray",
            variant: "outline",
          }}
          w={"full"}
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
        </Confirmation.Trigger>
      </CContainer>
    </CContainer>
  );
};

interface ProfileMenuTriggerProps extends StackProps {
  popoverRootProps?: Omit<PopoverRootProps, "children">;
}
export const ProfileMenuTrigger = (props: ProfileMenuTriggerProps) => {
  // Props
  const { popoverRootProps, ...restProps } = props;

  // Refss
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  useClickOutside(containerRef, handleClose);

  // States
  const [open, setOpen] = useState<boolean>(false);

  // Utils
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  return (
    <Popover.Root open={open} {...popoverRootProps}>
      <Popover.Trigger asChild>
        <CContainer w={"fit"} onClick={handleOpen} {...restProps} />
      </Popover.Trigger>

      <Popover.Content
        ref={containerRef}
        w={"225px"}
        // border={"none"}
        zIndex={10}
      >
        <ProfileMenu handleClose={handleClose} />
      </Popover.Content>
    </Popover.Root>
  );
};
