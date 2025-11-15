"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field } from "@/components/ui/field";
import { Img } from "@/components/ui/img";
import { ImgInput } from "@/components/ui/img-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import BackButton from "@/components/widget/BackButton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import ResetPasswordDisclosureTrigger from "@/components/widget/ResetPasswordDisclosure";
import {
  dummyActivityLogs,
  dummySigninLogs,
  dummyUser,
} from "@/constants/dummyData";
import { Enum__ActivityAction } from "@/constants/enums";
import {
  Interface__ActivityLog,
  Interface__SigninLog,
  Interface__User,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { imgUrl } from "@/utils/url";
import { FieldRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { IconActivity, IconLogin2, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";

interface Props__AvatarInputDisclosureTrigger {
  children: any;
  formik: any;
  user?: Interface__User;
}
const AvatarInputDisclosureTrigger = (
  props: Props__AvatarInputDisclosureTrigger
) => {
  // Props
  const { children, formik, user, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`avatar-input`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Avatar`} />
          </DisclosureHeader>

          <DisclosureBody>
            <ImgInput
              inputValue={formik.values.avatar}
              onChange={(inputValue) => {
                formik.setFieldValue(inputValue);
              }}
              existingFiles={user?.avatar}
              onDeleteFile={(fileData) => {
                formik.setFieldValue(
                  "deleteAvatarIds",
                  Array.from(
                    new Set([...formik.values.deleteAvatarIds, fileData.id])
                  )
                );
              }}
              onUndoDeleteFile={(fileData) => {
                formik.setFieldValue(
                  "deleteAvatarIds",
                  formik.values.deleteAvatarIds.filter(
                    (id: string) => id !== fileData.id
                  )
                );
              }}
            />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

interface Props__PersonalInformation {
  initialData?: Interface__User;
}
const PersonalInformation = (props: Props__PersonalInformation) => {
  // Props
  const { initialData, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: "update_personal_info",
    loadingMessage: {
      title: `${l.saving} ${l.personal_information}`,
    },
    successMessage: {
      title: `${l.personal_information} ${l.updated}`,
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
      name: yup.string().required(l.msg_required_form),
      email: yup.string().required(l.msg_required_form),
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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconUser stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.personal_information}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer p={4}>
        <form
          id="personal_info_form"
          onSubmit={formik.handleSubmit}
          {...restProps}
        >
          <FieldRoot gap={4} disabled={loading}>
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
                  <AvatarInputDisclosureTrigger
                    formik={formik}
                    user={initialData}
                  >
                    <Btn variant={"outline"} size={"xs"}>
                      {l.upload_new_avatar}
                    </Btn>
                  </AvatarInputDisclosureTrigger>

                  <CContainer color={"fg.subtle"}>
                    <P>{l.msg_new_avatar_helper}</P>
                    <P>{`PNG, JPG ${l.is_allowed}`}</P>
                  </CContainer>
                </CContainer>
              </HStack>
            </Field>

            <Field
              label={l.name}
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
          </FieldRoot>

          <HStack justify={"space-between"} mt={8}>
            <ResetPasswordDisclosureTrigger>
              <Btn variant={"outline"}>Reset password</Btn>
            </ResetPasswordDisclosureTrigger>

            <Btn
              type="submit"
              form={"personal_info_form"}
              colorPalette={themeConfig.colorPalette}
            >
              {l.save}
            </Btn>
          </HStack>
        </form>
      </CContainer>
    </ItemContainer>
  );
};

const SigninLog = () => {
  // Contexts
  const { l } = useLang();

  // States
  const { error, initialLoading, data, onRetry } = useDataState<
    Interface__SigninLog[]
  >({
    initialData: dummySigninLogs,
    url: ``,
    dataResource: false,
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
              p={4}
            >
              <CContainer>
                <P>
                  {formatDate(log?.createdAt, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>

                <P color={"fg.subtle"}>{log?.ip}</P>
              </CContainer>

              <P color={"fg.subtle"} textAlign={"right"}>
                {log?.userAgent}
              </P>
            </HStack>
          );
        })}
      </>
    ),
  };

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconLogin2 stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.my_signin_history}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer minH={"300px"}>
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
    </ItemContainer>
  );
};

const ActivityLog = () => {
  // Contexts
  const { l } = useLang();

  // States
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
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
  const { error, initialLoading, data, onRetry } = useDataState<
    Interface__ActivityLog[]
  >({
    initialData: dummyActivityLogs,
    url: ``,
    dataResource: false,
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
              p={4}
            >
              <CContainer>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, {
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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconActivity stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.my_activity_history}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer minH={"300px"}>
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
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={4} pb={4}>
        <PersonalInformation initialData={data} />

        <SigninLog />

        <ActivityLog />
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
