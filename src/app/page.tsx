"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import Logo from "@/components/widget/Logo";
import SigninForm from "@/components/widget/SigninForm";
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
        <NavLink to="/demo">
          <Btn w={"140px"} colorPalette={themeConfig.colorPalette}>
            {l.access} App
          </Btn>
        </NavLink>

        <Btn
          w={"140px"}
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

const IndexRoute = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const authToken = useAuthMiddleware((s) => s.authToken);

  return (
    <CContainer minH={"100dvh"}>
      <SimpleGrid columns={[1, null, 2]} flex={1}>
        <CContainer
          display={["none", null, "flex"]}
          bg={themeConfig.primaryColor}
        >
          <Logo color="#fff" />
        </CContainer>

        <CContainer h={"full"} p={4}>
          <HStack justify={"center"}>
            <ColorModeButton />

            <LangMenu />
          </HStack>

          {authToken && <Signedin />}

          {!authToken && <SigninForm />}

          <BrandWatermark />
        </CContainer>
      </SimpleGrid>
    </CContainer>
  );
};

export default IndexRoute;
