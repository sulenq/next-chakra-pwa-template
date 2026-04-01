"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Logo } from "@/components/widgets/logo";
import { MContainerV } from "@/components/widgets/m-container";
import { APP } from "@/constants/_meta";
import { AUTH_API_SIGNOUT } from "@/constants/apis";
import { DUMMY_USER } from "@/constants/dummyData";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useRequest } from "@/hooks/useRequest";
import { clearAccessToken, clearUserData } from "@/utils/auth";
import { Box, Circle, StackProps, useToken } from "@chakra-ui/react";
import { LogOutIcon } from "lucide-react";

// -----------------------------------------------------------------

const SignoutButton = (props: BtnProps) => {
  // Props
  const { iconButton = true, ...restProps } = props;

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { t } = useLocale();
  const removeAuthContext = useAuthMiddleware((s) => s.removeAuthContext);

  // Hooks
  const { req, loading } = useRequest({
    id: "signout",
    loadingMessage: t.loading_signout,
    successMessage: t.success_signout,
  });

  // Utils
  function onSignout() {
    const url = AUTH_API_SIGNOUT;
    const config = {
      url,
      method: "POST",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          clearAccessToken();
          clearUserData();
          removeAuthContext();
          setRt((ps) => !ps);
        },
        onError: () => {
          removeAuthContext();
        },
      },
    });
  }

  return (
    <Btn
      iconButton={iconButton}
      variant={"outline"}
      onClick={onSignout}
      loading={loading}
      {...restProps}
    >
      <AppIconLucide icon={LogOutIcon} />

      {!iconButton && "Sign out"}
    </Btn>
  );
};

// -----------------------------------------------------------------

interface UserIdCardProps extends StackProps {
  maskingTop?: string;
  withSignoutButton?: boolean;
}

export const UserIdCard = (props: UserIdCardProps) => {
  // Props
  const { maskingTop = "0px", withSignoutButton = false, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Constants
  // TODO_DEV uncomment on real dev
  // const user = getUserData();
  const user = DUMMY_USER;
  const userAvatarSrc = user?.avatar?.[0]?.fileUrl;

  // SX
  const [logoColor] = useToken("colors", [
    `${themeConfig.colorPalette}.contrast`,
  ]);

  return (
    <StackV pos={"relative"} {...restProps}>
      {/* Card behind */}
      <StackV
        flex={1}
        aspectRatio={1 / 1.6}
        w={"full"}
        bg={`${themeConfig.colorPalette}.solid`}
        rounded={themeConfig.radii.component}
        shadow={"xs"}
        overflow={"clip"}
        pos={"absolute"}
        transform={"translate(-42px, -6px) rotate(12deg)"}
        zIndex={1}
      >
        <StackH
          align={"center"}
          gap={2}
          pos={"absolute"}
          bottom={"12px"}
          left={"72px"}
          transform={"rotate(-90deg)"}
          transformOrigin={"left bottom"}
          whiteSpace={"nowrap"}
          opacity={0.5}
        >
          <Logo size={40} color={logoColor} />
          <P fontSize={"48px"} fontWeight={"semibold"} color={logoColor}>
            {APP.name}
          </P>
        </StackH>
      </StackV>

      {/* Card */}
      <StackV
        flex={1}
        aspectRatio={1 / 1.6}
        bg={"bg.bodySolid"}
        rounded={themeConfig.radii.component}
        shadow={"sm"}
        overflow={"clip"}
        zIndex={2}
      >
        <Img src={userAvatarSrc} w={"full"} aspectRatio={1} />

        <StackV flex={1} justify={"space-between"} gap={4} p={4}>
          <StackV>
            <P fontSize={"lg"} fontWeight={"medium"}>
              {user?.name}
            </P>

            <P color={"fg.subtle"}>{user?.role?.name || "User's role name"}</P>
          </StackV>

          <StackH align={"end"} justify={"space-between"}>
            <HelperText color={"fg.muted"}>{APP.name}</HelperText>

            {withSignoutButton && (
              <SignoutButton
                variant={"ghost"}
                size={"xs"}
                pos={"absolute"}
                right={"10px"}
                bottom={"10px"}
                _hover={{
                  color: "fg.error",
                }}
              />
            )}
          </StackH>
        </StackV>
      </StackV>

      {/* Card accecories */}
      <>
        {/* Hole */}
        <Circle
          size={"12px"}
          bg={"bg.body"}
          rounded={"full"}
          pos={"absolute"}
          left={"50%"}
          top={"8px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        />

        {/* Hook */}
        <Box
          w={"8px"}
          h={"24px"}
          bg={"gray.400"}
          roundedBottom={"sm"}
          pos={"absolute"}
          left={"50%"}
          top={"-10px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        />
        <Box
          w={"40px"}
          h={"16px"}
          p={1}
          bg={"gray.500"}
          rounded={"full"}
          pos={"absolute"}
          left={"50%"}
          top={"-24px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        >
          <Box w={"full"} h={"full"} bg={"bg.body"} rounded={"full"} />
        </Box>

        {/* Strap */}
        <MContainerV
          maskingTop={maskingTop}
          maskingBottom={0}
          pos={"absolute"}
          left={"50%"}
          top={"-44px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        >
          <Box
            w={"30px"}
            h={"24px"}
            bg={`${themeConfig.colorPalette}.solid`}
            roundedBottom={"sm"}
          />
        </MContainerV>
      </>
    </StackV>
  );
};
