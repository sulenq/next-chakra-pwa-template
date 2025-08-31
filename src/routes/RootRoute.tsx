"use client";

import Btn from "@/components/ui-custom/Btn";
import CContainer from "@/components/ui-custom/CContainer";
import Img from "@/components/ui-custom/Img";
import LangSwitcher from "@/components/ui-custom/LangSwitcher";
import NavLink from "@/components/ui-custom/NavLink";
import P from "@/components/ui-custom/P";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import ExiumWatermark from "@/components/widget/ExiumWatermark";
import SigninForm from "@/components/widget/SigninForm";
import { APP } from "@/constants/_app";
import { SVGS_PATH } from "@/constants/paths";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { removeStorage } from "@/utils/client";
import { HStack, SimpleGrid, VStack } from "@chakra-ui/react";

const Signedin = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);

  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    loadingMessage: l.loading_signout,
    successMessage: l.success_signout,
  });

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
    <VStack gap={4} m={"auto"}>
      <Avatar size={"2xl"} />

      <VStack gap={0}>
        <P fontWeight={"semibold"}>Admin</P>
        <P>admin@gmail.com</P>
      </VStack>

      <VStack>
        <NavLink to="/maintenance2" w={"fit"}>
          <Btn w={"160px"} colorPalette={themeConfig.colorPalette}>
            {l.access} App
          </Btn>
        </NavLink>

        <Btn
          w={"160px"}
          variant={"ghost"}
          onClick={onSignout}
          loading={loading}
        >
          Signin
        </Btn>
      </VStack>
    </VStack>
  );
};

const RootRoute = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const authToken = useAuthMiddleware((s) => s.authToken);

  return (
    <CContainer minH={"100dvh"}>
      <SimpleGrid columns={[1, null, 2]} flex={1}>
        <CContainer h={"full"} p={4}>
          <HStack justify={"center"}>
            <ColorModeButton />

            <LangSwitcher />
          </HStack>

          {authToken && <Signedin />}

          {!authToken && <SigninForm />}

          <ExiumWatermark />
        </CContainer>

        <CContainer
          display={["none", null, "flex"]}
          bg={themeConfig.primaryColor}
        >
          <Img
            alt={APP.name}
            src={`${SVGS_PATH}/logo_light.svg`}
            w={"full"}
            maxW={"120px"}
            m={"auto"}
          />
        </CContainer>
      </SimpleGrid>
    </CContainer>
  );
};

export default RootRoute;
