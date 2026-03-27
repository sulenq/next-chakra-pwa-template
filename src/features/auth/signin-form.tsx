"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { LucideIcon } from "@/components/widgets/icon";
import { Logo } from "@/components/widgets/logo";
import { MContainerV } from "@/components/widgets/m-container";
import { APP } from "@/constants/_meta";
import { AUTH_API_SIGNIN, AUTH_API_SIGNOUT } from "@/constants/apis";
import { DUMMY_USER } from "@/constants/dummyData";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import ResetPasswordDisclosureTrigger from "@/features/auth/reset-password";
import { useRequest } from "@/hooks/useRequest";
import {
  clearAccessToken,
  clearUserData,
  setAccessToken,
  setUserData,
} from "@/utils/auth";
import {
  Box,
  Circle,
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  StackProps,
  useToken,
} from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { ArrowRight, LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const INDEX_ROUTE = "/welcome";

// -----------------------------------------------------------------

const SignoutButton = (props: BtnProps) => {
  // Props
  const { iconButton = true, ...restProps } = props;

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { t } = useLocale();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);

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
          removeAuth();
          setRt((ps) => !ps);
        },
        onError: () => {
          removeAuth();
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

const Signedin = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Constants
  // TODO uncomment on real dev
  // const user = getUserData();
  const user = DUMMY_USER;
  const userAvatarSrc = user?.avatar?.[0]?.fileUrl;

  // SX
  const [logoColor] = useToken("colors", [
    `${themeConfig.colorPalette}.contrast`,
  ]);

  return (
    <StackV gap={8} w={"220px"} m={"auto"}>
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
          border={"1px solid"}
          borderColor={"border.subtle"}
          rounded={themeConfig.radii.component}
          shadow={"xs"}
          overflow={"clip"}
          zIndex={2}
        >
          <Img src={userAvatarSrc} w={"full"} aspectRatio={1} />

          <StackV
            flex={1}
            justify={"space-between"}
            gap={4}
            p={4}
            bg={"bg.bodySolid"}
          >
            <StackV>
              <P fontSize={"lg"} fontWeight={"medium"}>
                {user?.name}
              </P>

              <P color={"fg.subtle"}>
                {user?.role?.name || "User's role name"}
              </P>
            </StackV>

            <StackH align={"end"} justify={"space-between"}>
              <HelperText color={"fg.muted"}>{APP.name}</HelperText>

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

      <StackV gap={2}>
        <NavLink to={INDEX_ROUTE}>
          <Btn variant={"ghost"} colorPalette={themeConfig.colorPalette}>
            {t.enter_app} <AppIconLucide icon={ArrowRight} />
          </Btn>
        </NavLink>
      </StackV>
    </StackV>
  );
};

// -----------------------------------------------------------------

const BasicAuthForm = (props: any) => {
  const ID = "signin-form";

  // Props
  const { signinAPI, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const setVerifiedAccessToken = useAuthMiddleware(
    (s) => s.setVerifiedAccessToken,
  );
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: t.loading_signin,
    successMessage: t.success_signin,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(t.msg_required_form),
      password: yup.string().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = {
        email: values.identifier,
        password: values.password,
      };
      const config = {
        method: "POST",
        url: signinAPI,
        data: payload,
      };
      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const accessToken = r.data?.data?.authToken;
            const userData = r.data?.data?.user;
            const permissionsData = r.data?.data?.user?.permissions;

            setAccessToken(accessToken);
            setUserData(userData);
            setVerifiedAccessToken(accessToken);
            setPermissions(permissionsData);

            router.push(INDEX_ROUTE);
          },
        },
      });
    },
  });

  return (
    <StackV {...restProps}>
      <form id={ID} onSubmit={formik.handleSubmit}>
        <FieldsetRoot disabled={loading}>
          <Field
            invalid={!!formik.errors.identifier}
            errorText={formik.errors.identifier as string}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconUser stroke={1.5} />
                </Icon>
              }
            >
              <StringInput
                name="identifier"
                onChange={(input) => {
                  formik.setFieldValue("identifier", input);
                }}
                inputValue={formik.values.identifier}
                placeholder="Email"
                pl={"40px !important"}
                variant={"subtle"}
              />
            </InputGroup>
          </Field>

          <Field
            invalid={!!formik.errors.password}
            errorText={formik.errors.password as string}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconLock stroke={1.5} />
                </Icon>
              }
            >
              <PasswordInput
                name="password"
                onChange={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
                placeholder="Password"
                pl={"40px !important"}
                variant={"subtle"}
              />
            </InputGroup>
          </Field>
        </FieldsetRoot>

        <Btn
          type="submit"
          form={ID}
          w={"full"}
          mt={6}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={LogInIcon} />
          </Icon>
          Sign in
        </Btn>
      </form>

      <HStack w={"full"} mt={4}>
        <Divider flex={1} />

        <ResetPasswordDisclosureTrigger>
          <Btn variant={"ghost"} colorPalette={themeConfig.colorPalette}>
            Reset Password
          </Btn>
        </ResetPasswordDisclosureTrigger>

        <Divider flex={1} />
      </HStack>
    </StackV>
  );
};

// -----------------------------------------------------------------

export const SigninForm = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const verifiedAccessToken = useAuthMiddleware((s) => s.verifiedAccessToken);

  // States
  const signinAPI = AUTH_API_SIGNIN;

  return (
    <StackV
      m={"auto"}
      w={"full"}
      maxW={"360px"}
      p={4}
      gap={4}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {verifiedAccessToken ? (
        <Signedin />
      ) : (
        <>
          <StackV align={"center"} gap={2} mb={4}>
            <Logo size={28} mb={2} />

            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {APP.name}
            </H1>

            <P textAlign={"center"} color={"fg.subtle"}>
              {t.msg_signin}
            </P>
          </StackV>

          <BasicAuthForm signinAPI={signinAPI} />
        </>
      )}

      {/* <NavLink to={"/demo"} mx={"auto"}>
        <Btn variant={"ghost"} colorPalette={themeConfig.colorPalette}>
          Demo Page
        </Btn>
      </NavLink> */}
    </StackV>
  );
};
