"use client";

import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { APP } from "@/constants/_meta";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { removeStorage, setStorage } from "@/utils/client";
import { HStack, Icon, InputGroup, StackProps, VStack } from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
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

const Signedin = (props: any) => {
  // Props
  const { indexRoute, ...restProps } = props;

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
    <VStack gap={4} m={"auto"} {...restProps}>
      <Avatar size={"2xl"} src={user?.avatar?.[0]?.fileUrl} />

      <VStack gap={0}>
        <P fontWeight={"semibold"}>Admin</P>
        <P>admin@gmail.com</P>
      </VStack>

      <VStack>
        <NavLink to={indexRoute}>
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
  const { indexRoute, signinAPI, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
    errorMessage: {
      400: {
        VALIDATION_FAILED: {
          ...l.error_signin_wrong_credentials,
        },
        INVALID_CREDENTIALS: {
          ...l.error_signin_wrong_credentials,
        },
      },
      403: {
        FORBIDDEN_ROLE: {
          ...l.error_signin_wrong_credentials,
        },
      },
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(l.msg_required_form),
      password: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = {
        email: values.identifier,
        password: values.password,
      };
      const config = {
        method: "post",
        url: signinAPI,
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            setStorage("__auth_token", r.data.data?.token);
            setStorage("__user_data", JSON.stringify(r.data.data?.user));
            setAuthToken(r.data.data?.token);
            setPermissions(r.data.data?.permissions);
            router.push(indexRoute);
          },
        },
      });
    },
  });

  return (
    <CContainer {...restProps}>
      <form id="signin_form" onSubmit={formik.handleSubmit}>
        <Field
          invalid={!!formik.errors.identifier}
          errorText={formik.errors.identifier as string}
          mb={4}
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
            />
          </InputGroup>
        </Field>

        <Btn
          type="submit"
          form="signin_form"
          w={"full"}
          mt={6}
          size={"lg"}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
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

const SigninForm = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const authToken = useAuthMiddleware((s) => s.verifiedAuthToken);

  // States
  const signinAPI = "/api/signin";
  const indexRoute = "/demo";

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
      {authToken ? (
        <Signedin indexRoute={indexRoute} />
      ) : (
        <>
          <CContainer gap={2} mb={2}>
            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {APP.name}
            </H1>

            <P textAlign={"center"} color={"fg.subtle"}>
              {l.msg_signin}
            </P>
          </CContainer>

          <BasicAuthForm signinAPI={signinAPI} indexRoute={indexRoute} />
        </>
      )}
    </CContainer>
  );
};

export default SigninForm;
