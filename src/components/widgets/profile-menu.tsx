"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Popover } from "@/components/ui/popover";
import { StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import { LucideIcon } from "@/components/widgets/icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { AUTH_API_SIGNOUT } from "@/constants/apis";
import { BACKDROP_BLUR_FILTER, BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useADM from "@/contexts/useADM";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useRequest } from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { back, removeStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Icon, PopoverRootProps, StackProps } from "@chakra-ui/react";
import {
  BellIcon,
  CircleCheckBigIcon,
  EclipseIcon,
  LogOutIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export const TodoList = (props: StackProps) => {
  return <StackV {...props}></StackV>;
};

export const TodoListTrigger = () => {
  return <></>;
};

// -----------------------------------------------------------------

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
  function handleSignout() {
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
    <StackV
      rounded={themeConfig.radii.container}
      overflow={"clip"}
      color={"fg.ibody"}
      {...restProps}
    >
      <StackV>
        <StackV p={1} pb={0}>
          <Avatar
            src={imgUrl(user?.avatar?.[0]?.filePath)}
            name={user?.name}
            w={"full"}
            h={"full"}
            aspectRatio={1}
            rounded={themeConfig.radii.component}
            fontSize={"4rem"}
          />
        </StackV>

        <StackV p={4} borderColor={"border.muted"}>
          <P fontWeight={"semibold"}>{user?.name || "Signed out"}</P>
          <P color={"fg.subtle"}>{user?.email || user?.username || "-"}</P>
        </StackV>
      </StackV>

      <Divider />

      <StackV gap={1} p={"6px"}>
        {!ADM && (
          <Btn
            clicky={false}
            variant={"ghost"}
            px={2}
            onClick={toggleColorMode}
          >
            <AppIconLucide
              icon={colorMode === "dark" ? EclipseIcon : SunIcon}
            />
            Dark mode
            <DotIndicator
              bg={colorMode === "dark" ? "fg.success" : "bg.muted"}
              ml={"auto"}
              mr={1}
            />
          </Btn>
        )}

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
          <AppIconLucide icon={CircleCheckBigIcon} />
          Todo list
        </Btn>

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
          <AppIconLucide icon={BellIcon} />

          {t.notification}
        </Btn>

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
            handleSignout();
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
            Sign out
          </Btn>
        </Confirmation.Trigger>
      </StackV>
    </StackV>
  );
};

// -----------------------------------------------------------------

interface ProfileMenuTriggerProps extends StackProps {
  popoverRootProps?: Omit<PopoverRootProps, "children">;
}

export const ProfileMenuTrigger = (props: ProfileMenuTriggerProps) => {
  // Props
  const { popoverRootProps, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [open, setOpen] = useState<boolean>(false);

  // Utils
  function handleClose() {
    setOpen(false);
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      {...popoverRootProps}
    >
      <Popover.Trigger asChild>
        <StackV w={"fit"} {...restProps} />
      </Popover.Trigger>

      <Popover.Content
        w={"225px"}
        bg={"bg.frosted"}
        backdropFilter={BACKDROP_BLUR_FILTER}
        rounded={themeConfig.radii.container}
        zIndex={10}
      >
        <ProfileMenu handleClose={handleClose} />
      </Popover.Content>
    </Popover.Root>
  );
};
