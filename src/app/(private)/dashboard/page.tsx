"use client";

import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import { Segmented } from "@/components/ui/segment-group";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/Page";
import { HStack } from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
  // States
  const [filter, setFilter] = useState<any>({
    startDate: null,
    endDate: null,
    prefixPeriod: "1D",
  });

  console.debug(filter);

  return (
    <PageContainer>
      <PageTitle justify={"space-between"}>
        <HStack>
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
      </PageTitle>
      <PageContent></PageContent>
    </PageContainer>
  );
}
