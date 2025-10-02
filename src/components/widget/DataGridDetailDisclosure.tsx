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
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import BackButton from "@/components/widget/BackButton";
import { ImgViewer } from "@/components/widget/ImgViewer";
import useBackOnClose from "@/hooks/useBackOnClose";
import { disclosureId } from "@/utils/disclosure";
import { formatDate, formatTime } from "@/utils/formatter";
import { imgUrl } from "@/utils/url";
import { StackProps, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

const RenderData = (props: any) => {
  // Props
  const { data, dataType } = props;

  switch (dataType) {
    case "image":
      return (
        <ImgViewer src={imgUrl(data?.[0]?.filePath)}>
          <Img src={imgUrl(data?.[0]?.filePath)} w={"full"} h={"auto"} fluid />
        </ImgViewer>
      );
    case "date":
      return <P>{formatDate(data)}</P>;
    case "timestamp":
      return <P>{formatDate(data, { variant: "numeric", withTime: true })}</P>;
    case "time":
      return <P>{formatTime(data)}</P>;
    default: // string
      return <P>{data}</P>;
  }
};
export const DataGridDetailDisclosure = (props: any) => {
  // Props
  const { open, data, specs } = props;

  // States
  const [search, setSearch] = useState<string>("");
  const resolvedDataKeys = Object.keys(data).filter((key) => {
    return specs[key].label.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent
            title={`Detail ${specs?.["title"]?.label}`}
          />
        </DisclosureHeader>

        <DisclosureBody p={0}>
          <CContainer p={3} pt={2}>
            <SearchInput
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
              inputProps={{
                variant: "flushed",
                rounded: 0,
              }}
            />
          </CContainer>

          <CContainer>
            {data &&
              resolvedDataKeys.map((key) => {
                const isLast = key === Object.keys(data).at(-1);

                return (
                  <CContainer
                    key={key}
                    gap={2}
                    px={4}
                    py={3}
                    borderBottom={!isLast ? "1px solid" : ""}
                    borderColor={"d1"}
                  >
                    <P fontWeight={"medium"} color={"fg.subtle"}>
                      {specs[key].label}
                    </P>

                    <RenderData
                      data={data[key]}
                      dataType={specs[key].dataType}
                    />
                  </CContainer>
                );
              })}
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
  data: any;
  specs: Record<
    string,
    {
      label: string;
      dataType: string; // "string" | "number" | "date" | "timestap" | "time" |
    }
  >;
}
export const DataGridDetailDisclosureTrigger = (props: TirggerProps) => {
  // Props
  const { children, id, data, specs, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`data-grid-detail-${id}`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DataGridDetailDisclosure open={open} data={data} specs={specs} />
    </>
  );
};
