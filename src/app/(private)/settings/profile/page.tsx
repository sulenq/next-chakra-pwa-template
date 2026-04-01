"use client";

import { AvatarUploadTrigger } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { ClampText } from "@/components/widgets/clamp-text";
import { DataFooter } from "@/components/widgets/data-footer";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { Item } from "@/components/widgets/item";
import { UserIdCard } from "@/components/widgets/user-id-card";
import { useViewContext } from "@/components/widgets/view";
import {
  DUMMY_USER,
  dummyActivityLogs,
  dummyAuthLogs,
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
import { Circle, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  ActivityIcon,
  ArrowDown,
  ArrowUp,
  LogInIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const { isSmContainer } = useViewContext();

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
    <Item.Root>
      <Item.Header borderless>
        <AppIconLucide icon={UserIcon} />

        <Item.Title>{t.personal_information}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <Stack flexDir={isSmContainer ? "column" : "row"}>
            <StackV minW={"280px"} pl={10} pr={8} pt={"28px"} pb={2}>
              <UserIdCard w={"220px"} mx={"auto"} />
            </StackV>

            <StackV flex={1} justify={"space-between"}>
              <form
                id={"personal-info-form"}
                onSubmit={formik.handleSubmit}
                {...restProps}
              >
                <FieldsetRoot disabled={loading}>
                  <Field
                    label={"Avatar"}
                    invalid={!!formik.errors.avatar}
                    errorText={`${formik.errors.avatar}`}
                  >
                    <StackV gap={2}>
                      <AvatarUploadTrigger formik={formik} user={initialData}>
                        <Btn w={"fit"} variant={"outline"}>
                          {t.upload_new_avatar}
                        </Btn>
                      </AvatarUploadTrigger>

                      <StackV gap={1}>
                        <HelperText>{t.msg_new_avatar_helper}</HelperText>
                        <HelperText>{`PNG, JPG ${t.is_allowed}`}</HelperText>
                      </StackV>
                    </StackV>
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
                      placeholder={"Jolitos Kurniawan"}
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
                      placeholder={"example@email.com"}
                    />
                  </Field>
                </FieldsetRoot>
              </form>

              <StackH justify={"space-between"} mt={8}>
                <ResetPasswordDisclosureTrigger>
                  <Btn variant={"outline"}>Reset password</Btn>
                </ResetPasswordDisclosureTrigger>

                <Btn
                  type={"submit"}
                  form={"personal-info-form"}
                  colorPalette={themeConfig.colorPalette}
                >
                  {t.save}
                </Btn>
              </StackH>
            </StackV>
          </Stack>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const AuthLog = () => {
  // Contexts
  const { t } = useLocale();

  // Refs

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
  } = useFetchData<{
    totalData: number;
    items: Interface__AuthLog[];
  }>({
    // TODO_DEV add url and set initial data to undefined
    initialData: {
      totalData: 100,
      items: dummyAuthLogs,
    },
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
        {data?.items?.map((log, idx) => {
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
    <Item.Root>
      <Item.Header borderless>
        <AppIconLucide icon={LogInIcon} />

        <Item.Title>{t.my_auth_logs}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body>
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
                    {data?.items && render.loaded}
                    {(!data?.items || isEmptyArray(data.items)) && render.empty}
                  </>
                )}
              </>
            )}
          </StackV>

          <DataFooter
            borderless
            limit={limit}
            setLimit={setLimit}
            dataLength={data?.items?.length}
            totalData={data?.totalData}
            page={page}
            setPage={setPage}
            totalPage={pagination?.meta?.totalPage}
          />
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const ActivityLog = () => {
  // Contexts
  const { t } = useLocale();

  // States
  const [search, setSearch] = useState("");
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
    // TODO_DEV create action sentence glosary
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
  } = useFetchData<{
    totalData: number;
    items: Interface__ActivityLog[];
  }>({
    // TODO_DEV add url and set initial data to undefined
    initialData: {
      totalData: 100,
      items: dummyActivityLogs,
    },
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
        {data?.items?.map((log, idx) => {
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
    <Item.Root>
      <Item.Header borderless>
        <AppIconLucide icon={ActivityIcon} />

        <Item.Title>{t.my_activity_logs}</Item.Title>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body>
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
                    {data?.items && render.loaded}
                    {(!data?.items || isEmptyArray(data?.items)) &&
                      render.empty}
                  </>
                )}
              </>
            )}
          </StackV>

          <DataFooter
            borderless
            limit={limit}
            setLimit={setLimit}
            dataLength={data?.items?.length}
            totalData={data?.totalData}
            page={page}
            setPage={setPage}
            totalPage={pagination?.meta?.totalPage}
          />
        </Item.Body>
      </StackV>
    </Item.Root>
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
