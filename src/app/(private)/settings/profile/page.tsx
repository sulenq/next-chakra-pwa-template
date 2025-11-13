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
import { Img } from "@/components/ui/img";
import { ImgInput } from "@/components/ui/img-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/widget/BackButton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { dummyUser } from "@/constants/dummyData";
import { Interface__User } from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import { disclosureId } from "@/utils/disclosure";
import { imgUrl } from "@/utils/url";
import { HStack, useDisclosure } from "@chakra-ui/react";

interface Props__AvatarInputDisclosureTrigger {
  children: any;
}
const AvatarInputDisclosureTrigger = (
  props: Props__AvatarInputDisclosureTrigger
) => {
  // Props
  const { children, ...restProps } = props;

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
            <ImgInput />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();

  // States
  const { error, initialLoading, data, onRetry } =
    useDataState<Interface__User>({
      initialData: dummyUser,
      url: ``,
      dependencies: [],
      dataResource: false,
    });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <HStack
        flexDir={["column", null, "row"]}
        flex={1}
        gap={4}
        pb={4}
        overflowY={"auto"}
        align={"stretch"}
      >
        <CContainer gap={4} flex={[null, null, 3]}>
          <ItemContainer flex={1}>
            <ItemHeaderContainer>
              <ItemHeaderTitle>{l.personal_information}</ItemHeaderTitle>
            </ItemHeaderContainer>

            <CContainer flex={1} p={4}>
              <HStack gap={4}>
                <Img
                  src={imgUrl(data?.photoProfile?.[0]?.filePath)}
                  fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
                  aspectRatio={1}
                  w={"140px"}
                  rounded={"full"}
                />

                <CContainer gap={2}>
                  <AvatarInputDisclosureTrigger>
                    <Btn variant={"outline"} size={"md"}>
                      {l.upload_new_avatar}
                    </Btn>
                  </AvatarInputDisclosureTrigger>

                  <CContainer color={"fg.subtle"}>
                    <P>{l.msg_new_avatar_helper}</P>
                    <P>{`JPG, PNG ${l.is_allowed.toLowerCase()}`}</P>
                  </CContainer>
                </CContainer>
              </HStack>
            </CContainer>
          </ItemContainer>

          <ItemContainer flex={1}></ItemContainer>
        </CContainer>

        <ItemContainer flex={[null, null, 2]}></ItemContainer>
      </HStack>
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
