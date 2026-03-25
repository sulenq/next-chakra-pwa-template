"use client";

import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { LucideIcon } from "@/components/widgets/icon";
import { Logo } from "@/components/widgets/logo";
import { APP } from "@/constants/_meta";
import { AUTH_API_SIGNIN, AUTH_API_SIGNOUT } from "@/constants/apis";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useRequest } from "@/hooks/useRequest";
import {
  clearAccessToken,
  clearUserData,
  getUserData,
  setAccessToken,
  setUserData,
} from "@/utils/auth";
import {
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { StringInput } from "@/components/ui/string-input";
import ResetPasswordDisclosureTrigger from "@/features/auth/reset-password";

const INDEX_ROUTE = "/welcome";

const SignoutButton = () => {
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
    <Btn w={"140px"} variant={"ghost"} onClick={onSignout} loading={loading}>
      Sign out
    </Btn>
  );
};

const Signedin = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const user = getUserData();

  return (
    <VStack gap={4} m={"auto"} {...restProps}>
      <Avatar size={"2xl"} src={user?.avatar?.[0]?.fileUrl} />

      <VStack gap={0}>
        <P fontWeight={"semibold"}>{user?.name}</P>
        <P>{user?.email}</P>
      </VStack>

      <VStack>
        <NavLink to={INDEX_ROUTE}>
          <Btn w={"140px"} colorPalette={themeConfig.colorPalette}>
            {t.access} App
          </Btn>
        </NavLink>

        <SignoutButton />
      </VStack>
    </VStack>
  );
};

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
    <CContainer {...restProps}>
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
          size={"lg"}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={LogInIcon} />
          </Icon>
          Sign in
        </Btn>

        <HStack w={"full"} mt={4}>
          <Divider flex={1} />

          <ResetPasswordDisclosureTrigger>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosureTrigger>

          <Divider flex={1} />
        </HStack>
      </form>
    </CContainer>
  );
};

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
    <CContainer
      m={"auto"}
      w={"full"}
      maxW={"380px"}
      p={4}
      gap={4}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {verifiedAccessToken ? (
        <Signedin />
      ) : (
        <>
          <CContainer align={"center"} gap={2} mb={4}>
            <Logo mb={2} />

            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {APP.name}
            </H1>

            <P textAlign={"center"} color={"fg.subtle"}>
              {t.msg_signin}
            </P>
          </CContainer>

          <BasicAuthForm signinAPI={signinAPI} />
        </>
      )}

      <NavLink to={"/demo"} mx={"auto"}>
        <Btn variant={"ghost"} colorPalette={themeConfig.colorPalette}>
          Demo Page
        </Btn>
      </NavLink>
    </CContainer>
  );
};
