"use client";

import { LucideIcon } from "@/components/misc/icon";
import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { ResetPasswordDisclosureTrigger } from "@/features/auth/components/reset-password";
import { useSignin } from "@/features/auth/hooks/use-auth";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { FieldsetRoot, Icon, InputGroup, StackProps } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLock, IconUser } from "@tabler/icons-react";
import { LogInIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SignedinState } from "./signed-in.state";

// -----------------------------------------------------------------

type BasicAuthSigninFormValues = z.infer<
  ReturnType<typeof basicAuthSigninSchema>
>;

const basicAuthSigninSchema = (t: { msg_required_form: string }) =>
  z.object({
    identifier: z.string().min(1, t.msg_required_form),
    password: z.string().min(1, t.msg_required_form),
  });

const BasicAuthForm = (props: any) => {
  const ID = "signin-form";

  const { ...restProps } = props;

  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  const signin = useSignin();
  const loading = signin.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicAuthSigninFormValues>({
    resolver: zodResolver(basicAuthSigninSchema(t)),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (values: BasicAuthSigninFormValues) => {
    signin.mutate({
      email: values.identifier,
      password: values.password,
    });
  };

  return (
    <StackV {...restProps}>
      <form id={ID} onSubmit={handleSubmit(onSubmit)}>
        <FieldsetRoot disabled={loading}>
          <Field
            invalid={!!errors.identifier}
            errorText={errors.identifier?.message}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconUser stroke={1.5} />
                </Icon>
              }
            >
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <StringInput
                    name={field.name}
                    onChange={(input) => field.onChange(input)}
                    inputValue={field.value}
                    placeholder={"Email"}
                    pl={"40px !important"}
                    variant={"subtle"}
                  />
                )}
              />
            </InputGroup>
          </Field>

          <Field
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconLock stroke={1.5} />
                </Icon>
              }
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    name={field.name}
                    onChange={(input) => field.onChange(input)}
                    inputValue={field.value}
                    placeholder={"Password"}
                    pl={"40px !important"}
                    variant={"subtle"}
                  />
                )}
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
          colorPalette={theme.colorPalette}
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
          <Btn variant={"ghost"} colorPalette={theme.colorPalette}>
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

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const accessToken = useAuthStore((s) => s.auth.accessToken);

  return (
    <StackV
      m={"auto"}
      w={"full"}
      maxW={"360px"}
      p={4}
      gap={4}
      rounded={theme.radii.container}
      {...restProps}
    >
      {accessToken ? (
        <SignedinState />
      ) : (
        <>
          <StackV align={"center"} gap={2} mb={4}>
            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              Welcome back!
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
