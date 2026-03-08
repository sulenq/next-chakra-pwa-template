"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { TextareaInput } from "@/components/ui/textarea-input";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { LucideIcon } from "@/components/widgets/icon";
import { Item } from "@/components/widgets/item";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLocale from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { FieldsetRoot, HStack, Icon } from "@chakra-ui/react";
import { useFormik } from "formik";
import { KeyRoundIcon } from "lucide-react";
import { useEffect } from "react";
import * as yup from "yup";

const APIKeys = (props: any) => {
  // Props
  const { apiKeys, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: "",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      mapboxToken: "",
      tinyMceToken: "",
    },
    validationSchema: yup.object().shape({
      mapboxToken: yup.string().required(t.msg_required_form),
      tinyMceToken: yup.string().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      // console.debug(values);

      const config = {
        url: ``,
        method: "PATCH",
        data: values,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  // initial values
  useEffect(() => {
    formik.setValues({
      mapboxToken: apiKeys?.mapboxToken,
      tinyMceToken: apiKeys?.tinyMceToken,
    });
  }, [apiKeys]);

  return (
    <Item.Container borderless roundedless {...restProps}>
      <Item.HeaderContainer borderless>
        <HStack>
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={KeyRoundIcon} />
          </Icon>
          <Item.HeaderTitle>API Keys</Item.HeaderTitle>
        </HStack>
      </Item.HeaderContainer>

      <CContainer px={4}>
        <CContainer
          p={4}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <form id={"api-keys-form"} onSubmit={formik.handleSubmit}>
            <FieldsetRoot disabled={loading}>
              <Field
                label={"Mapbox Token"}
                invalid={!!formik.errors.mapboxToken}
                errorText={formik.errors.mapboxToken as string}
              >
                <TextareaInput
                  inputValue={formik.values.mapboxToken}
                  onChange={(inputValue) => {
                    formik.setFieldValue("mapboxToken", inputValue);
                  }}
                  // variant={"subtle"}
                />
              </Field>

              <Field
                label={"Tiny MCE Token"}
                invalid={!!formik.errors.tinyMceToken}
                errorText={formik.errors.tinyMceToken as string}
              >
                <TextareaInput
                  inputValue={formik.values.tinyMceToken}
                  onChange={(inputValue) => {
                    formik.setFieldValue("tinyMceToken", inputValue);
                  }}
                  // variant={"subtle"}
                />
              </Field>
            </FieldsetRoot>
          </form>

          <HStack justify={"end"} mt={8}>
            <Btn
              type="submit"
              form="api-keys-form"
              colorPalette={themeConfig.colorPalette}
            >
              {t.save}
            </Btn>
          </HStack>
        </CContainer>
      </CContainer>
    </Item.Container>
  );
};

export default function Page() {
  // States
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: {
      apiKeys: {
        mapboxToken: "some token",
        tinyMceToken: "some token",
      },
    },
    url: ``,
    dataResource: false,
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer gap={4} bg={"bgContent"}>
        <APIKeys apiKeys={data?.apiKeys} />
      </CContainer>
    ),
  };

  return (
    <>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {!data && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
}
