"use client";

import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { LucideIcon } from "@/components/widget/Icon";
import { Logo } from "@/components/widget/Logo";
import { APP } from "@/constants/_meta";
import { BASE_ICON_BOX_SIZE } from "@/constants/sizes";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { getAccessToken, getUserData } from "@/utils/auth";
import { removeStorage } from "@/utils/client";
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
import { Btn } from "../ui/btn";
import { CContainer } from "../ui/c-container";
import { Divider } from "../ui/divider";
import { P } from "../ui/p";
import { PasswordInput } from "../ui/password-input";
import { StringInput } from "../ui/string-input";
import ResetPasswordDisclosureTrigger from "./ResetPasswordDisclosure";

interface Props extends StackProps {}

const BASE_SIGNIN_EP = `/api/login`;
const SIGNOUT_EP = "/api/rski/dashboard/logout";
const INDEX_ROUTE = "/demo";

const Signedin = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);
  const user = getUserData();

  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    loadingMessage: l.loading_signout,
    successMessage: l.success_signout,
  });

  // Utils
  function onSignout() {
    const url = SIGNOUT_EP;

    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          removeStorage("__access_token");
          removeStorage("__user_data");
          removeAuth();
        },
      },
    });
  }

  return (
    <VStack gap={4} m={"auto"} {...restProps}>
      <Avatar size={"2xl"} src={user?.avatar?.[0]?.fileUrl} />

      <VStack gap={0}>
        <P fontWeight={"semibold"}>Admin</P>
        <P>admin@gmail.com</P>
      </VStack>

      <VStack>
        <NavLink to={INDEX_ROUTE}>
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
const BasicAuthForm = (props: any) => {
  // Props
  const { signinAPI, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // TODO enable in real dev
  // const setAccessToken = useAuthMiddleware((s) => s.setAccessToken);
  // const setVerifiedAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);
  // const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const {
    // TODO enable in real dev
    // req,
    loading,
  } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      // TODO enable in real dev
      // identifier: yup.string().required(l.msg_required_form),
      // password: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      console.debug(values, signinAPI);

      // TODO enable in real dev
      // const payload = {
      //   email: values.identifier,
      //   password: values.password,
      // };
      // const config = {
      //   method: "POST",
      //   url: signinAPI,
      //   data: payload,
      // };
      // req({
      //   config,
      //   onResolve: {
      //     onSuccess: (r: any) => {
      //       const accessToken = r.data?.token;
      //       const userData = r.data?.user?.data;
      //       const permissionsData = r.data?.user?.data?.permissions;
      //       setAccessToken(accessToken);
      //       setUserData(userData);
      //       setAccessToken(accessToken);
      //       setVerifiedAuthToken(accessToken);
      //       setPermissions(permissionsData);
      //       router.push(INDEX_ROUTE);
      //     },
      //   },
      // });

      router.push(INDEX_ROUTE);
    },
  });

  return (
    <CContainer {...restProps}>
      {/* TODO disable in real dev */}
      <P
        maxW={"250px"}
        fontWeight={"medium"}
        textAlign={"center"}
        mx={"auto"}
        mb={2}
      >
        Just click the Sign In button to go to the demo page.
      </P>

      <form id="signin_form" onSubmit={formik.handleSubmit}>
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
          form="signin_form"
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

        <HStack mt={4}>
          <Divider h={"1px"} w={"full"} />

          <ResetPasswordDisclosureTrigger>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosureTrigger>

          <Divider h={"1px"} w={"full"} />
        </HStack>
      </form>
    </CContainer>
  );
};

export const SigninForm = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const authToken = getAccessToken();
  const verifiedAuthToken = useAuthMiddleware((s) => s.verifiedAuthToken);
  const resolvedAuthToken = authToken || verifiedAuthToken;

  // States
  const signinAPI = BASE_SIGNIN_EP;

  return (
    <CContainer
      m={"auto"}
      w={"full"}
      maxW={"380px"}
      p={6}
      gap={4}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {resolvedAuthToken ? (
        <Signedin />
      ) : (
        <>
          <CContainer align={"center"} gap={2} mb={4}>
            <Logo mb={2} />

            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {APP.name}
            </H1>

            <P textAlign={"center"} color={"fg.subtle"}>
              {l.msg_signin}
            </P>
          </CContainer>

          <BasicAuthForm signinAPI={signinAPI} />
        </>
      )}
    </CContainer>
  );
};
