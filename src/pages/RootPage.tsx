"use client";

import Btn from "@/components/ui-custom/Btn";
import CContainer from "@/components/ui-custom/CContainer";
import P from "@/components/ui-custom/P";
import { Avatar } from "@/components/ui/avatar";
import SigninForm from "@/components/widget/SigninForm";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { getAuthToken } from "@/utils/authToken";
import { VStack } from "@chakra-ui/react";

const Signedin = () => {
  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    showLoadingToast: false,
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

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
          localStorage.removeItem("__auth_token");
          localStorage.removeItem("__user_data");
          // setAuthToken(undefined);
          // setPermissions(undefined);
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
        {/* <NavLink to="/workspace" w={"fit"}> */}
        <Btn w={"160px"} colorPalette={themeConfig.colorPalette}>
          Go to App
        </Btn>
        {/* </NavLink> */}

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

const RootPage = () => {
  // States
  const authToken = getAuthToken();

  return (
    <CContainer minH={"100dvh"}>
      {authToken && <Signedin />}

      {!authToken && <SigninForm />}
    </CContainer>
  );
};

export default RootPage;
