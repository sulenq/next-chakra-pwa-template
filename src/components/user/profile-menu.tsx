"use client";

import { AppIconLucide } from "@/components/branding/app-icon";
import { LucideIcon } from "@/components/misc/icon";
import { Confirmation } from "@/components/overlays/confirmation";
import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { ClampText } from "@/components/ui/clamp-text";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { DotIndicator } from "@/components/ui/indicator";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Popover } from "@/components/ui/popover";
import { StackH, StackV } from "@/components/ui/stack";
import {
  BACKDROP_BLUR_FILTER,
  BASE_ICON_BOX_SIZE,
  GAP,
} from "@/constants/styles";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useSignout } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/stores/use-auth-store";
import { back } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Icon, PopoverRootProps, Stack, StackProps } from "@chakra-ui/react";
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

// -----------------------------------------------------------------

const MENUS = [
  {
    labelKey: "profile",
    icon: UserIcon,
    path: "/settings/profile",
  },
  {
    labelKey: "navs.settings",
    icon: SettingsIcon,
    path: "/settings",
  },
];

// -----------------------------------------------------------------

export const TodoList = (props: StackProps) => {
  return <StackV {...props}></StackV>;
};

// -----------------------------------------------------------------

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

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  router.prefetch("/");

  const signoutMutation = useSignout({
    onSuccess: () => {
      router.push("/");
    },
    onError: () => {
      router.push("/");
    },
  });

  // States
  const user = useAuthStore((s) => s.auth.user);

  // Utils
  function handleSignout() {
    back();
    signoutMutation.mutate();
  }

  return (
    <StackV
      rounded={theme.radii.container}
      overflow={"clip"}
      color={"fg.ibody"}
      {...restProps}
    >
      <StackH align={"center"} gap={4} p={3}>
        <Avatar
          src={imgUrl(user?.avatar?.[0]?.path)}
          name={user?.name}
          size={"lg"}
        />

        <StackV borderColor={"border.muted"}>
          <P fontWeight={"medium"}>{user?.name || "Signed out"}</P>
          <ClampText color={"fg.subtle"}>
            {user?.email || user?.username || "-"}
          </ClampText>
        </StackV>
      </StackH>

      <Stack px={GAP}>
        <Divider />
      </Stack>

      <StackV gap={1} p={"6px"}>
        <Btn variant={"ghost"} px={2} onClick={toggleColorMode}>
          <AppIconLucide icon={colorMode === "dark" ? EclipseIcon : SunIcon} />
          Dark mode
          <DotIndicator
            bg={colorMode === "dark" ? "fg.success" : "bg.muted"}
            ml={"auto"}
            mr={1}
          />
        </Btn>

        <Btn
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
          id={"signout"}
          title={"Sign out"}
          description={t.msg_signout}
          confirmLabel={"Sign out"}
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

  // Stores
  const { theme } = useThemeStore();

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
        <StackV {...restProps} />
      </Popover.Trigger>

      <Popover.Content
        w={"225px"}
        bg={"bg.frosted"}
        backdropFilter={BACKDROP_BLUR_FILTER}
        rounded={theme.radii.container}
        zIndex={10}
      >
        <ProfileMenu handleClose={handleClose} />
      </Popover.Content>
    </Popover.Root>
  );
};
