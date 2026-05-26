"use client";

import { BackButton } from "@/components/navigation/back-button";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Field } from "@/components/ui/field";
import { HelperText } from "@/components/ui/helper-text";
import { PasswordInput } from "@/components/ui/password-input";
import { StringInput } from "@/components/ui/string-input";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { back } from "@/utils/client";
import { maskEmail } from "@/utils/string";
import { PinInput, PinInputInput } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

import { StackV } from "@/components/ui/stack";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import {
  useResetPasswordStep1,
  useResetPasswordStep2,
  useResetPasswordStep3,
} from "../hooks/use-auth";

// -----------------------------------------------------------------

interface Step1Props {
  setStep: (step: number) => void;
  setEmail: (email: string) => void;
}

const Step1 = (props: Step1Props) => {
  // Props
  const { setStep, setEmail } = props;

  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { mutate, isPending } = useResetPasswordStep1({
    onSuccess: () => {
      setStep(2);
      setEmail(formik.values.email);
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = values;
      mutate(payload);
    },
  });

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form onSubmit={formik.handleSubmit}>
            <Field
              label={"Email"}
              invalid={!!formik.errors.email}
              errorText={formik.errors.email as string}
              mb={4}
            >
              <StringInput
                name={"email"}
                onChange={(input) => {
                  formik.setFieldValue("email", input);
                }}
                inputValue={formik.values.email}
                placeholder={"example@email.com"}
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
          onClick={formik.submitForm}
          loading={isPending}
        >
          {t.recieve} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

// -----------------------------------------------------------------

interface Step2Props {
  email: string;
  setStep: (step: number) => void;
  setResetPasswordToken: (token: string) => void;
}

const Step2 = (props: Step2Props) => {
  // Props
  const { email, setResetPasswordToken, setStep } = props;

  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { mutate, isPending } = useResetPasswordStep2({
    onSuccess: (response) => {
      if (response?.data) {
        setResetPasswordToken(response.data.resetPasswordToken);
      }
      setStep(3);
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: email, otp: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(t.msg_required_form),
      otp: yup.string().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = values;
      mutate(payload);
    },
  });

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form onSubmit={formik.handleSubmit}>
            <Field
              label={"OTP"}
              invalid={!!formik.errors.otp}
              errorText={formik.errors.otp as string}
              mb={4}
            >
              <PinInput.Root
                w={"full"}
                size={"xl"}
                colorPalette={theme.colorPalette}
                onValueChange={(e) => {
                  formik?.setFieldValue("otp", e.value.join(""));
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
          onClick={formik.submitForm}
          loading={isPending}
        >
          {t.verify} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

// -----------------------------------------------------------------

interface Step3Props {
  resetPasswordToken: string;
}

const Step3 = (props: Step3Props) => {
  // Props
  const { resetPasswordToken } = props;

  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { mutate, isPending } = useResetPasswordStep3({
    onSuccess: () => {
      back();
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      resetPasswordToken: resetPasswordToken,
      newPassword: "",
      newPasswordConfirmation: "",
    },
    validationSchema: yup.object().shape({
      resetPasswordToken: yup.string().required(t.msg_required_form),
      newPassword: yup.string().required(t.msg_required_form),
      newPasswordConfirmation: yup
        .string()
        .required(t.msg_required_form)
        .oneOf(
          [yup.ref("newPassword"), ""],
          t.msg_password_confirmation_not_match,
        ),
    }),
    onSubmit: (values) => {
      const payload = values;
      mutate(payload);
    },
  });

  return (
    <>
      <Disclosure.Body>
        <StackV>
          <form>
            <Field
              label={"Password"}
              invalid={!!formik.errors.newPassword}
              errorText={formik.errors.newPassword as string}
              mb={4}
            >
              <PasswordInput
                onChange={(input) => {
                  formik.setFieldValue("newPassword", input);
                }}
                inputValue={formik.values.newPassword}
              />
            </Field>

            <Field
              label={t.password_confirmation}
              invalid={!!formik.errors.newPasswordConfirmation}
              errorText={formik.errors.newPasswordConfirmation as string}
              mb={4}
            >
              <PasswordInput
                onChange={(input) => {
                  formik.setFieldValue("newPasswordConfirmation", input);
                }}
                inputValue={formik.values.newPasswordConfirmation}
              />
            </Field>
          </form>

          <HelperText>{t.msg_reset_password_step_3}</HelperText>
        </StackV>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={theme.colorPalette}
          onClick={formik.submitForm}
          loading={isPending}
          disabled={
            !!!(
              formik.values.newPassword && formik.values.newPasswordConfirmation
            )
          }
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
