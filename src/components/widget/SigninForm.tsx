"use client";

import { Field } from "@/components/ui/field";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { setStorage } from "@/utils/client";
import { HStack, Icon, InputGroup, StackProps } from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Btn } from "../ui/btn";
import { CContainer } from "../ui/c-container";
import { P } from "../ui/p";
import { PasswordInput } from "../ui/password-input";
import { StringInput } from "../ui/string-input";
import { Divider } from "../ui/divider";
import ResetPasswordDisclosure from "./ResetPasswordDisclosure";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { useRouter } from "next/navigation";
import { APP } from "@/constants/_meta";

interface Props extends StackProps {}

const SigninForm = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
    errorMessage: {
      400: {
        INVALID_CREDENTIALS: {
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
        url: "/api/signin",
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
            router.push("/demo");
          },
        },
      });
    },
  });

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
      <CContainer gap={1}>
        <P textAlign={"center"} fontWeight={"bold"} fontSize={"lg"}>
          {APP.name}
        </P>

        <P textAlign={"center"}>{l.msg_signin}</P>
      </CContainer>

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
              placeholder="Email/Username"
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
          Login
        </Btn>

        <HStack mt={4}>
          <Divider h={"1px"} w={"full"} />

          <ResetPasswordDisclosure>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosure>

          <Divider h={"1px"} w={"full"} />
        </HStack>
      </form>
    </CContainer>
  );
};

export default SigninForm;
