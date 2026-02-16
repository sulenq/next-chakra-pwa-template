"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { LucideIcon } from "@/components/widget/Icon";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
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
  const { l } = useLang();
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
      mapboxToken: yup.string().required(l.msg_required_form),
      tinyMceToken: yup.string().required(l.msg_required_form),
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
    <ItemContainer borderless roundedless {...restProps}>
      <ItemHeaderContainer borderless>
        <HStack>
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={KeyRoundIcon} />
          </Icon>
          <ItemHeaderTitle>API Keys</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <form id="api_keys_form" onSubmit={formik.handleSubmit}>
            <FieldsetRoot disabled={loading}>
              <Field
                label={"Mapbox Token"}
                invalid={!!formik.errors.mapboxToken}
                errorText={formik.errors.mapboxToken as string}
              >
                <Textarea
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
                <Textarea
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
              form="api_keys_form"
              colorPalette={themeConfig.colorPalette}
            >
              {l.save}
            </Btn>
          </HStack>
        </CContainer>
      </CContainer>
    </ItemContainer>
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
