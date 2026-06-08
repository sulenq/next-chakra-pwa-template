"use client";

import { BackButton } from "@/components/navigation/back-button";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Field } from "@/components/ui/field";
import { HelperText } from "@/components/ui/typography";
import { PasswordInput } from "@/components/ui/password-input";
import { StringInput } from "@/components/ui/string-input";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { back } from "@/utils/client";
import { maskEmail } from "@/utils/string";
import { PinInput, PinInputInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { StackV } from "@/components/ui/stack";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { Translations } from "@/types/global.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod/v3";
import {
  useResetPasswordStep1,
  useResetPasswordStep2,
  useResetPasswordStep3,
} from "../hooks/use-auth";

// -----------------------------------------------------------------
// Step 1
// -----------------------------------------------------------------

type Step1Values = z.infer<ReturnType<typeof step1Schema>>;

const step1Schema = (t: Translations) =>
  z.object({
    email: z.string().min(1, t.msg_required_form).email(),
  });

interface Step1Props {
  setStep: (step: number) => void;
  setEmail: (email: string) => void;
}

const Step1 = (props: Step1Props) => {
  // Props
  const { setStep, setEmail } = props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema(t)),
    defaultValues: { email: "" },
  });

  // Hooks
  const { mutate, isPending } = useResetPasswordStep1({
    onSuccess: () => {
      setStep(2);
      setEmail(getValues("email"));
    },
  });

  const onSubmit = (values: Step1Values) => {
    mutate(values);
  };

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label={"Email"}
              invalid={!!errors.email}
              errorText={errors.email?.message}
              mb={4}
            >
              <StringInput
                placeholder={"example@email.com"}
                {...register("email")}
              />
            </Field>
          </form>

          <HelperText>{t.msg_reset_password_step_1}</HelperText>
        </StackV>
      </Disclosure.Body>

      <Disclosure.Footer>
        <BackButton />

        <Btn
          colorPalette={theme.colorPalette}
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
        >
          {t.recieve} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

// -----------------------------------------------------------------
// Step 2
// -----------------------------------------------------------------

type Step2Values = z.infer<ReturnType<typeof step2Schema>>;

const step2Schema = (t: Translations) =>
  z.object({
    email: z.string().min(1, t.msg_required_form).email(),
    otp: z.string().min(1, t.msg_required_form),
  });

interface Step2Props {
  email: string;
  setStep: (step: number) => void;
  setResetPasswordToken: (token: string) => void;
}

const Step2 = (props: Step2Props) => {
  // Props
  const { email, setResetPasswordToken, setStep } = props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema(t)),
    defaultValues: { email, otp: "" },
  });

  // Hooks
  const { mutate, isPending } = useResetPasswordStep2({
    onSuccess: (response) => {
      if (response?.data) {
        setResetPasswordToken(response.data.resetPasswordToken);
      }
      setStep(3);
    },
  });

  const onSubmit = (values: Step2Values) => {
    mutate(values);
  };

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label={"OTP"}
              invalid={!!errors.otp}
              errorText={errors.otp?.message}
              mb={4}
            >
              <Controller
                name="otp"
                control={control}
                render={({ field: { onChange } }) => (
                  <PinInput.Root
                    w={"full"}
                    size={"xl"}
                    colorPalette={theme.colorPalette}
                    onValueChange={(e) => {
                      onChange(e.value.join(""));
                    }}
                  >
                    <PinInput.HiddenInput />
                    <PinInput.Control w={"full"}>
                      {Array.from({ length: 6 }, (_, i) => {
                        return (
                          <PinInputInput
                            key={i}
                            index={i}
                            flex={1}
                            h={"60px"}
                            fontSize={"xl"}
                            fontWeight={"bold"}
                          />
                        );
                      })}
                    </PinInput.Control>
                  </PinInput.Root>
                )}
              />
            </Field>
          </form>

          <HelperText color={"fg.subtle"}>{`${t.otp_sent_to} ${maskEmail(
            email,
          )}`}</HelperText>
          <HelperText>{t.msg_reset_password_step_2}</HelperText>
        </StackV>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={theme.colorPalette}
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
        >
          {t.verify} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

// -----------------------------------------------------------------
// Step 3
// -----------------------------------------------------------------

type Step3Values = z.infer<ReturnType<typeof step3Schema>>;

const step3Schema = (t: Translations) =>
  z
    .object({
      resetPasswordToken: z.string().min(1, t.msg_required_form),
      newPassword: z.string().min(1, t.msg_required_form),
      newPasswordConfirmation: z.string().min(1, t.msg_required_form),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: t.msg_password_confirmation_not_match,
      path: ["newPasswordConfirmation"],
    });

interface Step3Props {
  resetPasswordToken: string;
}

const Step3 = (props: Step3Props) => {
  // Props
  const { resetPasswordToken } = props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema(t)),
    defaultValues: {
      resetPasswordToken,
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  // Hooks
  const { mutate, isPending } = useResetPasswordStep3({
    onSuccess: () => {
      back();
    },
  });

  const onSubmit = (values: Step3Values) => {
    mutate(values);
  };

  const newPassword = watch("newPassword");
  const newPasswordConfirmation = watch("newPasswordConfirmation");

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label={"Password"}
              invalid={!!errors.newPassword}
              errorText={errors.newPassword?.message}
              mb={4}
            >
              <PasswordInput {...register("newPassword")} />
            </Field>

            <Field
              label={t.password_confirmation}
              invalid={!!errors.newPasswordConfirmation}
              errorText={errors.newPasswordConfirmation?.message}
              mb={4}
            >
              <PasswordInput {...register("newPasswordConfirmation")} />
            </Field>
          </form>

          <HelperText>{t.msg_reset_password_step_3}</HelperText>
        </StackV>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={theme.colorPalette}
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={!!!(newPassword && newPasswordConfirmation)}
        >
          {t.save}
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

// -----------------------------------------------------------------

export const ResetPasswordDisclosureTrigger = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("reset-password"));

  // States
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [resetPasswordToken, setResetPasswordToken] = useState<string>("");

  const STEP_SECTION = {
    1: <Step1 setEmail={setEmail} setStep={setStep} />,
    2: (
      <Step2
        email={email}
        setResetPasswordToken={setResetPasswordToken}
        setStep={setStep}
      />
    ),
    3: <Step3 resetPasswordToken={resetPasswordToken} />,
  };

  useEffect(() => {
    if (open) setStep(1);
    setEmail("");
    setResetPasswordToken("");
  }, [open]);

  return (
    <>
      <StackV onClick={onOpen} {...restProps}>
        {children}
      </StackV>

      <Disclosure.Root open={open} lazyLoad size={"xs"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent title={`Reset Password`} />
          </Disclosure.Header>

          {STEP_SECTION[step as keyof typeof STEP_SECTION]}
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};
