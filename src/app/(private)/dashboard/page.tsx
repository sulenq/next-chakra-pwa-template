"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/Page";
import SimplePopover from "@/components/widget/SimplePopover";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { formatNumber } from "@/utils/formatter";
import { isDimensionValid } from "@/utils/style";
import { Badge, HStack, Icon, SimpleGrid, StackProps } from "@chakra-ui/react";
import { ArrowUpIcon, InfoIcon } from "lucide-react";
import { useRef, useState } from "react";

const DEFAULT_FILTER = {
  startDate: null,
  endDate: null,
  prefixPeriod: "1D",
};

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack {...restProps}>
      <DateRangePickerInput
        id="date_period"
        inputValue={{
          startDate: filter.startDate,
          endDate: filter.endDate,
        }}
        onChange={(inputValue) => {
          setFilter({
            ...filter,
            startDate: inputValue?.startDate,
            endDate: inputValue?.endDate,
          });
        }}
        w={"270px"}
        size={"sm"}
      />

      <Segmented
        items={["1D", "1W", "1M", "3M", "1Y"]}
        inputValue={filter.prefixPeriod}
        onChange={(inputValue) => {
          setFilter({ ...filter, prefixPeriod: inputValue });
        }}
        size={"sm"}
      />
    </HStack>
  );
};
const OverviewItem = (props: StackProps) => {
  return (
    <CContainer
      p={4}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={"md"}
      {...props}
    >
      <HStack gap={1}>
        <P fontWeight={"medium"} color={"fg.muted"}>
          Title here
        </P>

        <SimplePopover
          content={
            "Minim ad voluptate commodo aliqua sunt anim occaecat laboris mollit tempor est consectetur ipsum."
          }
        >
          <Btn
            iconButton
            size={"2xs"}
            rounded={"full"}
            variant={"ghost"}
            color={"fg.subtle"}
          >
            <Icon>
              <LucideIcon icon={InfoIcon} />
            </Icon>
          </Btn>
        </SimplePopover>
      </HStack>

      <P fontSize={"2xl"} fontWeight={"medium"}>
        {formatNumber(1234)}
      </P>

      <HStack mt={1}>
        <Badge w={"fit"} colorPalette={"green"}>
          <Icon boxSize={2.5}>
            <LucideIcon icon={ArrowUpIcon} />
          </Icon>
          12.5%
        </Badge>

        <HelperText>since last month</HelperText>
      </HStack>
    </CContainer>
  );
};
export default function Page() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useContainerDimension(containerRef);

  // States
  const isValidDimension = isDimensionValid(dimension);
  const isSmContainer = dimension.width < 600;
  const [filter, setFilter] = useState<any>(DEFAULT_FILTER);

  return (
    <PageContainer ref={containerRef}>
      <PageTitle justify={"space-between"} pr={3}>
        {!isSmContainer && <DataUtils filter={filter} setFilter={setFilter} />}
      </PageTitle>

      {isValidDimension && (
        <PageContent>
          {isSmContainer && (
            <HScroll px={3} flexShrink={0}>
              <DataUtils filter={filter} setFilter={setFilter} w={"max"} />
            </HScroll>
          )}

          <SimpleGrid
            w={"full"}
            columns={isSmContainer ? 2 : 4}
            gap={isSmContainer ? 2 : 3}
            px={3}
            pos={"relative"}
          >
            {Array.from({ length: 4 }).map((_, idx) => {
              return <OverviewItem key={idx} />;
            })}
          </SimpleGrid>
        </PageContent>
      )}
    </PageContainer>
  );
}
