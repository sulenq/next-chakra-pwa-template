"use client";

import { AppIconLucide } from "@/components/branding/app-icon";
import { Logo } from "@/components/branding/logo";
import { LucideIcon } from "@/components/misc/icon";
import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { UserIdCard } from "@/components/user/user-id-card";
import { APP } from "@/constants/_meta";
import { WELCOME_ROUTE } from "@/constants/routes";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useAuthMiddlewareContext } from "@/contexts/use-auth-middleware-context";
import { ResetPasswordDisclosureTrigger } from "@/features/auth/components/reset-password";
import { useSignin } from "@/features/auth/hooks/use-auth";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { FieldsetRoot, Icon, InputGroup, StackProps } from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { ArrowRight, LogInIcon } from "lucide-react";
import * as yup from "yup";

// -----------------------------------------------------------------

const Signedin = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

  return (
    <StackV align={"center"} gap={8} w={"220px"} m={"auto"}>
      <UserIdCard maskingTop={"8px"} withSignoutButton maxW={"180px"} />

      <StackH gap={2} justify={"center"}>
        {/* TODO_DEV: Remove below component in real dev */}
        <>
          <NavLink to={"/test"} mx={"auto"}>
            <Btn variant={"ghost"} colorPalette={themeContext.colorPalette}>
              Test
            </Btn>
          </NavLink>

          <NavLink to={"/demo"} mx={"auto"}>
            <Btn variant={"ghost"} colorPalette={themeContext.colorPalette}>
              Demo
            </Btn>
          </NavLink>
        </>

        <NavLink to={WELCOME_ROUTE}>
          <Btn variant={"ghost"} colorPalette={themeContext.colorPalette}>
            {t.enter_app} <AppIconLucide icon={ArrowRight} />
          </Btn>
        </NavLink>
      </StackH>
    </StackV>
  );
};

// -----------------------------------------------------------------

const BasicAuthForm = (props: any) => {
  const ID = "signin-form";

  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

  // Hooks
  const signinMutation = useSignin();
  const loading = signinMutation.isPending;

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
      signinMutation.mutate(payload);
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
                name={"identifier"}
                onChange={(input) => {
                  formik.setFieldValue("identifier", input);
                }}
                inputValue={formik.values.identifier}
                placeholder={"Email"}
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
                name={"password"}
                onChange={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
                placeholder={"Password"}
                pl={"40px !important"}
                variant={"subtle"}
              />
            </InputGroup>
          </Field>
        </FieldsetRoot>

        <Btn
          type={"submit"}
          form={ID}
          w={"full"}
          mt={6}
          loading={loading}
          colorPalette={themeContext.colorPalette}
        >
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={LogInIcon} />
          </Icon>
          Sign in
        </Btn>
      </form>

      <StackH align={"center"} w={"full"} mt={4}>
        <Divider flex={1} />

        <ResetPasswordDisclosureTrigger>
          <Btn variant={"ghost"} colorPalette={themeContext.colorPalette}>
            Reset Password
          </Btn>
        </ResetPasswordDisclosureTrigger>

        <Divider flex={1} />
      </StackH>
    </StackV>
  );
};

// -----------------------------------------------------------------

export const SigninForm = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const verifiedAccessToken = useAuthMiddlewareContext(
    (s) => s.verifiedAccessToken,
  );

  return (
    <StackV
      m={"auto"}
      w={"full"}
      maxW={"360px"}
      p={4}
      gap={4}
      rounded={themeContext.radii.container}
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

          <BasicAuthForm />
        </>
      )}
    </StackV>
  );
};
