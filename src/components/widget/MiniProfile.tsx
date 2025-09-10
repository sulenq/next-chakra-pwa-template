"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import useRequest from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { removeStorage } from "@/utils/client";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconLogout, IconUser } from "@tabler/icons-react";

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

        <P fontWeight={"semibold"}>{user?.name}</P>
        <P color={"fg.muted"}>{user?.email || user?.username || "-"}</P>
      </CContainer>

      <Divider />

      <CContainer p={1}>
        <Btn clicky={false} px={2} variant={"ghost"} justifyContent={"start"}>
          <Icon boxSize={5}>
            <IconUser stroke={1.5} />
          </Icon>
          {l.my_profile}
        </Btn>

        <Btn
          clicky={false}
          px={2}
          variant={"ghost"}
          colorPalette={"red"}
          justifyContent={"start"}
          onClick={() => {
            setConfirmationData({
              title: "Sign out?",
              description: l.msg_signout,
              confirmLabel: "Sign out",
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
