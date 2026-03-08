"use client";

import { AvatarUploadTrigger } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StringInput } from "@/components/ui/string-input";
import { AppIcon } from "@/components/widgets/AppIcon";
import { ClampText } from "@/components/widgets/ClampText";
import FeedbackNoData from "@/components/widgets/FeedbackNoData";
import FeedbackNotFound from "@/components/widgets/FeedbackNotFound";
import FeedbackRetry from "@/components/widgets/FeedbackRetry";
import { ImgViewer } from "@/components/widgets/ImgViewer";
import { ItemContainer } from "@/components/widgets/ItemContainer";
import { ItemHeaderContainer } from "@/components/widgets/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widgets/ItemHeaderTitle";
import { Limitation } from "@/components/widgets/Limitation";
import { Pagination } from "@/components/widgets/Pagination";
import {
  dummyActivityLogs,
  dummyAuthLogs,
  dummyUser,
} from "@/constants/dummyData";
import { Enum__ActivityAction } from "@/constants/enums";
import {
  Interface__ActivityLog,
  Interface__AuthLog,
  Interface__User,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import useLang from "@/contexts/useLang";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import ResetPasswordDisclosureTrigger from "@/features/auth/ResetPassword";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { imgUrl } from "@/utils/url";
import { Circle, HStack } from "@chakra-ui/react";
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

interface PersonalInformationProps {
  initialData?: Interface__User;
}
const PersonalInformation = (props: PersonalInformationProps) => {
  // Props
  const { initialData, ...restProps } = props;

  // Contexts
  const { t } = useLang();
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
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={UserIcon} />
          <ItemHeaderTitle>{t.personal_information}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <ItemContainer>
          <CContainer p={4}>
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
                  <HStack gap={4}>
                    <ImgViewer
                      src={imgUrl(initialData?.avatar?.[0]?.filePath)}
                      key={imgUrl(initialData?.avatar?.[0]?.filePath)}
                    >
                      <Img
                        src={imgUrl(initialData?.avatar?.[0]?.filePath)}
                        key={imgUrl(initialData?.avatar?.[0]?.filePath)}
                        fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
                        aspectRatio={1}
                        w={"100px"}
                        rounded={"full"}
                      />
                    </ImgViewer>

                    <CContainer gap={2}>
                      <AvatarUploadTrigger formik={formik} user={initialData}>
                        <Btn w={"fit"} variant={"outline"} size={"xs"}>
                          {t.upload_new_avatar}
                        </Btn>
                      </AvatarUploadTrigger>

                      <CContainer color={"fg.subtle"}>
                        <P>{t.msg_new_avatar_helper}</P>
                        <P>{`PNG, JPG ${t.is_allowed}`}</P>
                      </CContainer>
                    </CContainer>
                  </HStack>
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

            <HStack justify={"space-between"} mt={8}>
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
            </HStack>
          </CContainer>
        </ItemContainer>
      </CContainer>
    </ItemContainer>
  );
};

const AuthLog = () => {
  // Contexts
  const { t } = useLang();

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
  } = useDataState<Interface__AuthLog[]>({
    // TODO add url and set initial data to undefined
    initialData: dummyAuthLogs,
    url: ``,
    dependencies: [search],
  });
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
            <HStack
              key={`${log.id}-${idx}`}
              gap={4}
              px={2}
              py={2}
              justify={"space-between"}
              borderTop={idx === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
            >
              <Circle p={1} bg={isSignin ? "bg.success" : "bg.error"}>
                <AppIcon
                  icon={isSignin ? ArrowDown : ArrowUp}
                  color={isSignin ? "fg.success" : "fg.error"}
                />
              </Circle>

              <CContainer>
                <P>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>

                <P color={"fg.subtle"}>{log?.ip}</P>
              </CContainer>

              <ClampText color={"fg.subtle"} textAlign={"right"} lineClamp={2}>
                {log?.userAgent}
              </ClampText>
            </HStack>
          );
        })}
      </>
    ),
  };

  return (
    <ItemContainer ref={containerRef} borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={LogInIcon} />

          <ItemHeaderTitle>{t.my_auth_logs}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <ItemContainer>
          <CContainer p={4} pb={3}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-my-log-auth"}
            />
          </CContainer>

          <CContainer px={3}>
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
          </CContainer>

          <HStack
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
          </HStack>
        </ItemContainer>
      </CContainer>
    </ItemContainer>
  );
};

const ActivityLog = () => {
  // Contexts
  const { t } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [search, setSearch] = useState("");
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
    // TODO create action sentence glosary
    [Enum__ActivityAction.CREATE_WORKSPACE]: (meta) =>
      `Created workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.UPDATE_WORKSPACE]: (meta) =>
      `Updated workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.DELETE_WORKSPACE]: (meta) =>
      `Deleted workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.CREATE_LAYER]: (meta) =>
      `Created layer "${meta?.layerName ?? "Unknown"}"`,

    [Enum__ActivityAction.UPDATE_LAYER]: (meta) =>
      `Updated layer "${meta?.layerName ?? "Unknown"}"`,

    [Enum__ActivityAction.DELETE_LAYER]: (meta) =>
      `Deleted layer "${meta?.layerName ?? "Unknown"}`,
  };
  const formatActivityLog = (log: Interface__ActivityLog): string => {
    return activityFormatter[log.action as Enum__ActivityAction](log.metadata);
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
  } = useDataState<Interface__ActivityLog[]>({
    // TODO add url and set initial data to undefined
    initialData: dummyActivityLogs,
    url: ``,
    dependencies: [search],
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.map((log, idx) => {
          return (
            <HStack
              key={`${log.id}-${idx}`}
              justify={"space-between"}
              borderTop={idx === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
              px={2}
              py={2}
            >
              <CContainer>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>
              </CContainer>

              <P color={"fg.subtle"} textAlign={"right"}>
                {/* {log?.userAgent} */}
              </P>
            </HStack>
          );
        })}
      </>
    ),
  };

  return (
    <ItemContainer ref={containerRef} borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={ActivityIcon} />

          <ItemHeaderTitle>{t.my_activity_logs}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <ItemContainer>
          <CContainer p={4} pb={3}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-my-log-auth"}
            />
          </CContainer>

          <CContainer px={3}>
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
          </CContainer>

          <HStack
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
          </HStack>
        </ItemContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default function Page() {
  // States
  const { error, initialLoading, data, onRetry } =
    useDataState<Interface__User>({
      initialData: dummyUser,
      url: ``,
      dataResource: false,
    });
  const render = {
    loading: <Spinner m={"auto"} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={3}>
        <PersonalInformation initialData={data} />

        <AuthLog />

        <ActivityLog />
      </CContainer>
    ),
  };

  return (
    <CContainer pb={4}>
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
    </CContainer>
  );
}
