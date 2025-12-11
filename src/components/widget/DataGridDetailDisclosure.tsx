"use client";

import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import BackButton from "@/components/widget/BackButton";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { StackProps, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export const DataGridDetailDisclosure = (props: any) => {
  // Props
  const { open, title, data, details } = props;

  // States
  const [search, setSearch] = useState<string>("");
  const resolvedDetails = details.filter((detail: any) => {
    return detail?.label?.toLowerCase()?.includes(search?.toLowerCase());
  });

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Detail ${title}`} />
        </DisclosureHeader>

        <DisclosureBody pb={2}>
          <CContainer mb={2}>
            <SearchInput
              queryKey="q_detail_grid"
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
            />
          </CContainer>

          <CContainer>
            {data && (
              <>
                {isEmptyArray(resolvedDetails) && <FeedbackNotFound />}

                {resolvedDetails?.map((detail: any, idx: number) => {
                  const isLast = idx === resolvedDetails.length - 1;

                  return (
                    <CContainer
                      key={idx}
                      gap={2}
                      px={1}
                      py={3}
                      borderBottom={!isLast ? "1px solid" : ""}
                      borderColor={"border.subtle"}
                      align={"start"}
                    >
                      <P fontWeight={"medium"} color={"fg.subtle"}>
                        {detail.label}
                      </P>

                      {detail.render}
                    </CContainer>
                  );
                })}
              </>
            )}
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

interface TirggerProps extends StackProps {
  id: string;
  title: string;
  data: any;
  details: {
    label: string;
    render: any;
  }[];
}
export const DataGridDetailDisclosureTrigger = (props: TirggerProps) => {
  // Props
  const { children, id, title, data, details, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`data-grid-detail-${id}`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DataGridDetailDisclosure
        open={open}
        title={title}
        data={data}
        details={details}
      />
    </>
  );
};
