"use client";

import { AvatarUploadTrigger } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { ClampText } from "@/components/widgets/clamp-text";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { Item } from "@/components/widgets/item";
import { Limitation } from "@/components/widgets/limitation";
import { Pagination } from "@/components/widgets/pagination";
import {
  dummyActivityLogs,
  dummyAuthLogs,
  DUMMY_USER,
} from "@/constants/dummyData";
import { ActivityActionEnum } from "@/constants/enums";
import {
  Interface__ActivityLog,
  Interface__AuthLog,
  Interface__User,
} from "@/constants/interfaces";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import ResetPasswordDisclosureTrigger from "@/features/auth/reset-password";
import { useFetchData } from "@/hooks/useFetchData";
import { useRequest } from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { imgUrl } from "@/utils/url";
import { Circle } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  ActivityIcon,
  ArrowDown,
  ArrowUp,
  LogInIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";

// -----------------------------------------------------------------

interface PersonalInformationProps {
  initialData?: Interface__User;
}

const PersonalInformation = (props: PersonalInformationProps) => {
  // Props
  const { initialData, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: "update-personal-info",
    loadingMessage: {
      title: `${t.saving} ${t.personal_information}`,
    },
    successMessage: {
      title: `${t.personal_information} ${t.updated}`,
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      avatar: null as any,
      deleteAvatarIds: [],
      name: "",
      email: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(t.msg_required_form),
      email: yup.string().required(t.msg_required_form),
    }),
    onSubmit: (values) => {
      const config = {
        url: `/update-users/${initialData?.id}`,
        method: "PATCH",
        data: {
          avatar: values.avatar,
          deleteAvatarIds: values.deleteAvatarIds,
          name: values.name,
          email: values.email,
        },
      };

      req({
        config,
      });
    },
  });

  // set initial values
  useEffect(() => {
    if (initialData) {
      formik.setValues({
        avatar: null,
        deleteAvatarIds: [],
        name: initialData.name,
        email: initialData.email,
      });
    }
  }, [initialData]);

  return (
    <Item.Container bg={"transparent"}>
      <Item.Header borderless>
        <AppIconLucide icon={UserIcon} />

        <Item.Title>{t.personal_information}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container p={4}>
          <form
            id="personal-info-form"
            onSubmit={formik.handleSubmit}
            {...restProps}
          >
            <FieldsetRoot disabled={loading}>
              <Field
                invalid={!!formik.errors.avatar}
                errorText={`${formik.errors.avatar}`}
              >
                <StackH align={"center"} gap={4}>
                  <ImgViewer
                    src={initialData?.avatar?.[0]?.fileUrl}
                    key={imgUrl(initialData?.avatar?.[0]?.filePath)}
                  >
                    <Img
                      src={initialData?.avatar?.[0]?.fileUrl}
                      key={imgUrl(initialData?.avatar?.[0]?.filePath)}
                      aspectRatio={1}
                      w={"100px"}
                      rounded={"full"}
                    />
                  </ImgViewer>

                  <StackV gap={2}>
                    <AvatarUploadTrigger formik={formik} user={initialData}>
                      <Btn w={"fit"} variant={"outline"}>
                        {t.upload_new_avatar}
                      </Btn>
                    </AvatarUploadTrigger>

                    <StackV color={"fg.subtle"}>
                      <P>{t.msg_new_avatar_helper}</P>
                      <P>{`PNG, JPG ${t.is_allowed}`}</P>
                    </StackV>
                  </StackV>
                </StackH>
              </Field>

              <Field
                label={t.name}
                invalid={!!formik.errors.name}
                errorText={`${formik.errors.name}`}
              >
                <StringInput
                  inputValue={formik.values.name}
                  onChange={(inputValue) => {
                    formik.setFieldValue("name", inputValue);
                  }}
                  placeholder="Jolitos Kurniawan"
                />
              </Field>

              <Field
                label={"Email"}
                invalid={!!formik.errors.email}
                errorText={`${formik.errors.email}`}
              >
                <StringInput
                  inputValue={formik.values.email}
                  onChange={(inputValue) => {
                    formik.setFieldValue("email", inputValue);
                  }}
                  placeholder="example@email.com"
                />
              </Field>
            </FieldsetRoot>
          </form>

          <StackH justify={"space-between"} mt={8}>
            <ResetPasswordDisclosureTrigger>
              <Btn variant={"outline"}>Reset password</Btn>
            </ResetPasswordDisclosureTrigger>

            <Btn
              type="submit"
              form={"personal-info-form"}
              colorPalette={themeConfig.colorPalette}
            >
              {t.save}
            </Btn>
          </StackH>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

// -----------------------------------------------------------------

const AuthLog = () => {
  // Contexts
  const { t } = useLocale();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [search, setSearch] = useState("");
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    pagination,
    page,
    setPage,
  } = useFetchData<Interface__AuthLog[]>({
    // TODO add url and set initial data to undefined
    initialData: dummyAuthLogs,
    url: ``,
    dependencies: [search],
  });

  // Render State Map
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.map((log, idx) => {
          const isSignin = log?.action === "Sign in";

          return (
            <StackH
              key={`${log.id}-${idx}`}
              align={"center"}
              gap={4}
              px={2}
              py={2}
              justify={"space-between"}
              borderTop={idx === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
            >
              <Circle p={1} bg={isSignin ? "bg.success" : "bg.error"}>
                <AppIconLucide
                  icon={isSignin ? ArrowDown : ArrowUp}
                  color={isSignin ? "fg.success" : "fg.error"}
                />
              </Circle>

              <StackV w={"full"}>
                <P>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>

                <P color={"fg.subtle"}>{log?.ip}</P>
              </StackV>

              <ClampText color={"fg.subtle"} textAlign={"right"} lineClamp={2}>
                {log?.userAgent}
              </ClampText>
            </StackH>
          );
        })}
      </>
    ),
  };

  return (
    <Item.Container ref={containerRef} bg={"transparent"}>
      <Item.Header borderless>
        <AppIconLucide icon={LogInIcon} />

        <Item.Title>{t.my_auth_logs}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container>
          <StackV p={4}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-my-log-auth"}
            />
          </StackV>

          <StackV px={3}>
            {initialLoading && render.loading}
            {!initialLoading && (
              <>
                {error && render.error}
                {!error && (
                  <>
                    {data && render.loaded}
                    {(!data || isEmptyArray(data)) && render.empty}
                  </>
                )}
              </>
            )}
          </StackV>

          <StackH
            justify={"space-between"}
            wrap={"wrap"}
            p={3}
            // borderTop={"1px solid"}
            borderColor={"border.muted"}
          >
            <Limitation limit={limit} setLimit={setLimit} />

            <Pagination
              page={page}
              setPage={setPage}
              totalPage={pagination?.meta?.totalPage}
            />
          </StackH>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

// -----------------------------------------------------------------

const ActivityLog = () => {
  // Contexts
  const { t } = useLocale();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [search, setSearch] = useState("");
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
    // TODO create action sentence glosary
    [ActivityActionEnum.CREATE_WORKSPACE]: (meta) =>
      `Created workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.UPDATE_WORKSPACE]: (meta) =>
      `Updated workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.DELETE_WORKSPACE]: (meta) =>
      `Deleted workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.CREATE_LAYER]: (meta) =>
      `Created layer "${meta?.layerName ?? "Unknown"}"`,

    [ActivityActionEnum.UPDATE_LAYER]: (meta) =>
      `Updated layer "${meta?.layerName ?? "Unknown"}"`,

    [ActivityActionEnum.DELETE_LAYER]: (meta) =>
      `Deleted layer "${meta?.layerName ?? "Unknown"}`,
  };
  const formatActivityLog = (log: Interface__ActivityLog): string => {
    return activityFormatter[log.action as ActivityActionEnum](log.metadata);
  };
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    pagination,
    page,
    setPage,
  } = useFetchData<Interface__ActivityLog[]>({
    // TODO add url and set initial data to undefined
    initialData: dummyActivityLogs,
    url: ``,
    dependencies: [search],
  });

  // Render State Map
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.map((log, idx) => {
          return (
            <StackH
              key={`${log.id}-${idx}`}
              justify={"space-between"}
              borderTop={idx === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
              px={2}
              py={2}
            >
              <StackV>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>
              </StackV>

              <P color={"fg.subtle"} textAlign={"right"}>
                {/* {log?.userAgent} */}
              </P>
            </StackH>
          );
        })}
      </>
    ),
  };

  return (
    <Item.Container ref={containerRef} bg={"transparent"}>
      <Item.Header borderless>
        <AppIconLucide icon={ActivityIcon} />

        <Item.Title>{t.my_activity_logs}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container>
          <StackV p={4}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-my-log-auth"}
            />
          </StackV>

          <StackV px={3}>
            {initialLoading && render.loading}
            {!initialLoading && (
              <>
                {error && render.error}
                {!error && (
                  <>
                    {data && render.loaded}
                    {(!data || isEmptyArray(data)) && render.empty}
                  </>
                )}
              </>
            )}
          </StackV>

          <StackH
            justify={"space-between"}
            wrap={"wrap"}
            p={3}
            // borderTop={"1px solid"}
            borderColor={"border.muted"}
          >
            <Limitation limit={limit} setLimit={setLimit} />

            <Pagination
              page={page}
              setPage={setPage}
              totalPage={pagination?.meta?.totalPage}
            />
          </StackH>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // States
  const { error, initialLoading, data, onRetry } =
    useFetchData<Interface__User>({
      initialData: DUMMY_USER,
      url: ``,
      dataResource: false,
    });

  // Render State Map
  const render = {
    loading: <Spinner m={"auto"} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        <PersonalInformation initialData={data} />

        <AuthLog />

        <ActivityLog />
      </>
    ),
  };

  return (
    <StackV gap={2}>
      {/* {render.loading} */}
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
    </StackV>
  );
}
