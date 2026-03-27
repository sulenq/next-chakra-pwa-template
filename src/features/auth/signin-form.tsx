"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { LucideIcon } from "@/components/widgets/icon";
import { Logo } from "@/components/widgets/logo";
import { UserIdCard } from "@/components/widgets/user-id-card";
import { APP } from "@/constants/_meta";
import { AUTH_API_SIGNIN } from "@/constants/apis";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import ResetPasswordDisclosureTrigger from "@/features/auth/reset-password";
import { useRequest } from "@/hooks/useRequest";
import { setAccessToken, setUserData } from "@/utils/auth";
import {
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  StackProps,
} from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { ArrowRight, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const INDEX_ROUTE = "/welcome";

// -----------------------------------------------------------------

const Signedin = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  return (
    <StackV gap={8} w={"220px"} m={"auto"}>
      <UserIdCard maskingTop={"8px"} withSignoutButton />

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
