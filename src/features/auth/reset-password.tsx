import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { Field } from "@/components/ui/field";
import { HelperText } from "@/components/ui/helper-text";
import { PasswordInput } from "@/components/ui/password-input";
import { StringInput } from "@/components/ui/string-input";
import { BackButton } from "@/components/widgets/back-button";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useRequest } from "@/hooks/useRequest";
import { back } from "@/shared/utils/client";
import { maskEmail } from "@/shared/utils/string";
import {
  PinInputControl,
  PinInputHiddenInput,
  PinInputInput,
  PinInputRoot,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/shared/utils/disclosure";

const ID = "forgot-password";

const Step1 = (props: any) => {
  // Props
  const { setStep, setEmail } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      const url = `/api/send-otp`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setStep(2);
            setEmail(values.email);
          },
        },
      });
    },
  });

  return (
    <>
      <Disclosure.Body>
        <CContainer>
          <form>
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
        </CContainer>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
        >
          {t.recieve} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};
const Step2 = (props: any) => {
  // Props
  const { email, setOtp, setStep } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: email, otp: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(t.msg_required_form),
      otp: yup.string().email().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      const url = `/api/verify-otp`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setOtp(values.otp);
            setStep(3);
          },
        },
      });
    },
  });

  return (
    <>
      <Disclosure.Body>
        <CContainer>
          <form>
            <Field
              label={"OTP"}
              invalid={!!formik.errors.otp}
              errorText={formik.errors.otp as string}
              mb={4}
            >
              <PinInputRoot
                colorPalette={themeConfig.colorPalette}
                w={"full"}
                size={"xl"}
                onValueChange={(e) => {
                  formik?.setFieldValue("otp", e.value);
                }}
              >
                <PinInputHiddenInput />
                <PinInputControl w={"full"}>
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
                </PinInputControl>
              </PinInputRoot>
            </Field>
          </form>

          <HelperText color={"fg.subtle"}>{`${t.otp_sent_to} ${maskEmail(
            email,
          )}`}</HelperText>
          <HelperText>{t.msg_reset_password_step_2}</HelperText>
        </CContainer>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
        >
          {t.verify} OTP
        </Btn>
      </Disclosure.Footer>
    </>
  );
};
const Step3 = (props: any) => {
  // Props
  const { email, otp } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: email,
      otp: otp,
      password: "",
      password_confirmation: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(t.msg_required_form),
      otp: yup.string().required(t.msg_required_form),
      password: yup.string().required(t.msg_required_form),
      password_confirmation: yup
        .string()
        .required(t.msg_required_form)
        .oneOf(
          [yup.ref("password"), ""],
          t.msg_password_confirmation_not_match,
        ),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      payload.append("otp", values.otp);
      payload.append("password", values.password);
      payload.append("password_confirmation", values.password_confirmation);
      const url = `/api/reset-password`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            back();
          },
        },
      });
    },
  });

  return (
    <>
      <Disclosure.Body>
        <CContainer>
          <form>
            <Field
              label={"Password"}
              invalid={!!formik.errors.password}
              errorText={formik.errors.password as string}
              mb={4}
            >
              <PasswordInput
                onChange={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
              />
            </Field>

            <Field
              label={t.password_confirmation}
              invalid={!!formik.errors.password_confirmation}
              errorText={formik.errors.password_confirmation as string}
              mb={4}
            >
              <PasswordInput
                onChange={(input) => {
                  formik.setFieldValue("password_confirmation", input);
                }}
                inputValue={formik.values.password_confirmation}
              />
            </Field>
          </form>

          <HelperText>{t.msg_reset_password_step_3}</HelperText>
        </CContainer>
      </Disclosure.Body>
      <Disclosure.Footer>
        <BackButton />
        <Btn
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
          disabled={
            !!!(formik.values.password && formik.values.password_confirmation)
          }
        >
          {t.save}
        </Btn>
      </Disclosure.Footer>
    </>
  );
};

const ResetPasswordDisclosureTrigger = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("rese.t-password"));

  // States
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const STEP_SECTION = {
    1: <Step1 setEmail={setEmail} setStep={setStep} />,
    2: <Step2 email={email} setOtp={setOtp} setStep={setStep} />,
    3: <Step3 email={email} otp={otp} />,
  };

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  return (
    <>
      <CContainer onClick={onOpen} w={"fit"} {...restProps}>
        {children}
      </CContainer>

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

export default ResetPasswordDisclosureTrigger;
