"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { DotIndicator } from "@/components/widget/Indicator";
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import useRequest from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { back, removeStorage } from "@/utils/client";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

export const MiniProfile = (props: StackProps) => {
  // Contexts
  const { l } = useLang();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);

  // Hooks
  const { req } = useRequest({
    id: "sign_out",
    loadingMessage: { ...l.loading_signout },
    successMessage: { ...l.success_signout },
  });
  const router = useRouter();
  router.prefetch("/");
  const pathname = usePathname();

  // States
  const user = getUserData();
  const confirmationOnOpen = useConfirmationDisclosure(
    (s) => s.confirmationOnOpen
  );
  const setConfirmationData = useConfirmationDisclosure(
    (s) => s.setConfirmationData
  );

  // Utils
  function onSignout() {
    back();

    const url = `/api/signout`;
    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          removeStorage("__auth_token");
          removeStorage("__user_data");
          removeAuth();
          router.push("/");
        },
      },
    });
  }

  return (
    <CContainer {...props}>
      <CContainer align={"center"} p={2} mb={2}>
        <Avatar
          src={user?.photoProfile?.file_url}
          name={user?.name}
          size={"2xl"}
          mx={"auto"}
          my={2}
        />

        <P fontWeight={"semibold"}>{user?.name || "Signed out"}</P>
        <P color={"fg.muted"}>{user?.email || user?.username || "-"}</P>
      </CContainer>

      <Divider />

      <CContainer gap={1} p={"6px"}>
        <NavLink to={"/pvt/profile"}>
          <Btn
            clicky={false}
            px={2}
            variant={"ghost"}
            justifyContent={"start"}
            pos={"relative"}
          >
            <Icon boxSize={5}>
              <IconUser stroke={1.5} />
            </Icon>

            {l.my_profile}

            {pathname.includes("/profile") && <DotIndicator mr={1} />}
          </Btn>
        </NavLink>

        <Btn
          clicky={false}
          px={2}
          variant={"ghost"}
          color={"fg.error"}
          justifyContent={"start"}
          onClick={() => {
            setConfirmationData({
              title: "Sign out?",
              description: l.msg_signout,
              confirmLabel: "Sign out",
              confirmButtonProps: { colorPalette: "red" },
              onConfirm: onSignout,
            });
            confirmationOnOpen();
          }}
        >
          <Icon boxSize={5}>
            <IconLogout stroke={1.5} />
          </Icon>
          Sign Out
        </Btn>
      </CContainer>
    </CContainer>
  );
};
