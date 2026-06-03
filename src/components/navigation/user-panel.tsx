"use client";

import { AppIconLucide } from "@/components/branding/app-icon";
import { Item } from "@/components/container/item";
import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { ColorModeButton } from "@/components/ui/color-mode";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { ProfileMenuTrigger } from "@/components/user/profile-menu";
import { BACKDROP_BLUR_FILTER, R_SPACING_MD } from "@/constants/styles";
import { useAuthStore } from "@/stores/use-auth-store";
import { imgUrl } from "@/utils/url";
import {
  BellIcon,
  CircleCheckBigIcon,
  EllipsisVerticalIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

// -----------------------------------------------------------------

interface UserPanelProps {
  navsExpanded: boolean;
}

export const UserPanel = (props: UserPanelProps) => {
  // Props
  const { navsExpanded } = props;

  // Constants
  const user = useAuthStore((s) => s.auth.user);

  return (
    <Item.Body
      p={navsExpanded ? 0 : R_SPACING_MD}
      bg={navsExpanded ? "bg.frosted" : "transparent"}
      backdropFilter={BACKDROP_BLUR_FILTER}
      overflow={"clip"}
      // border={navsExpanded ? "1px solid" : "none"}
      // borderColor={"border.subtle"}
      // shadow={"soft"}
    >
      {/* Quick actions */}
      {navsExpanded && (
        <StackH justify={"space-between"} gap={R_SPACING_MD} p={R_SPACING_MD}>
          <ColorModeButton variant={"outline"} />

          <Btn iconButton clicky={false} variant={"outline"}>
            <AppIconLucide icon={CircleCheckBigIcon} />
          </Btn>

          <Btn iconButton clicky={false} variant={"outline"}>
            <AppIconLucide icon={BellIcon} />
          </Btn>

          <NavLink to={"/settings/profile"}>
            <Btn iconButton clicky={false} variant={"outline"}>
              <AppIconLucide icon={UserIcon} />
            </Btn>
          </NavLink>

          <NavLink to={"/settings"}>
            <Btn iconButton clicky={false} variant={"outline"}>
              <AppIconLucide icon={SettingsIcon} />
            </Btn>
          </NavLink>
        </StackH>
      )}

      {/* User */}
      <StackH
        align={"center"}
        gap={4}
        w={navsExpanded ? "full" : "36px"}
        p={navsExpanded ? R_SPACING_MD : 0}
        pos={"relative"}
      >
        {navsExpanded ? (
          <Avatar
            src={imgUrl(user?.avatar?.[0]?.path)}
            name={user?.name}
            size={"lg"}
            transition={"200ms"}
          />
        ) : (
          <ProfileMenuTrigger
            popoverRootProps={{
              positioning: {
                placement: "right-end",
                offset: {
                  mainAxis: 16,
                  crossAxis: 16,
                },
              },
            }}
            p={"2px"}
            rounded={"full"}
            transition={"200ms"}
            _hover={{
              bg: "bg.muted",
            }}
          >
            <Avatar
              src={imgUrl(user?.avatar?.[0]?.path)}
              name={user?.name}
              size={"xs"}
              transition={"200ms"}
              cursor={"pointer"}
            />
          </ProfileMenuTrigger>
        )}

        {navsExpanded && (
          <>
            <StackV>
              <P lineClamp={1} fontWeight={"medium"}>
                {user?.name || user?.email || "Signed out"}
              </P>

              <P lineClamp={1} color={"fg.subtle"}>
                {user?.name ? user?.email || user?.username : "-"}
              </P>
            </StackV>

            <ProfileMenuTrigger
              popoverRootProps={{
                positioning: {
                  placement: "right-end",
                  offset: {
                    mainAxis: 16,
                    crossAxis: 16,
                  },
                },
              }}
              ml={"auto"}
            >
              <Btn iconButton clicky={false} variant={"ghost"} w={"fit"}>
                <AppIconLucide icon={EllipsisVerticalIcon} />
              </Btn>
            </ProfileMenuTrigger>
          </>
        )}
      </StackH>
    </Item.Body>
  );
};
