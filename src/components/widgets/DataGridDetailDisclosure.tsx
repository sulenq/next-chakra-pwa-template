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
import { BackButton } from "@/components/widgets/BackButton";
import FeedbackNotFound from "@/components/widgets/FeedbackNotFound";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { useState } from "react";

interface DataGridDetailDisclosureProps extends StackProps {
  open: boolean;
  title: string;
  data: any;
  details: any;
}
export const DataGridDetailDisclosure = (
  props: DataGridDetailDisclosureProps,
) => {
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
              queryKey={"q-data-grid-detail"}
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

interface DataGridDetailDisclosureTriggerProps extends StackProps {
  id: string;
  title: string;
  data: any;
  details: {
    label: string;
    render: any;
  }[];
}
export const DataGridDetailDisclosureTrigger = (
  props: DataGridDetailDisclosureTriggerProps,
) => {
  // Props
  const { children, id, title, data, details, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`data-grid-detail-${id}`),
  );

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
