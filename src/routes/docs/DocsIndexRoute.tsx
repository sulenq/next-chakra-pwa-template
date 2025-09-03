"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { P } from "@/components/ui/p";
import { HStack } from "@chakra-ui/react";
import { useState } from "react";

const DocsIndexRoute = () => {
  const [date, setDate] = useState<string[]>([]);

  return (
    <CContainer p={4} gap={8}>
      <HStack justify={"space-between"}>
        <P fontSize={"xl"} fontWeight={"bold"}>
          Docs
        </P>

        <ColorModeButton />
      </HStack>

      <CContainer>
        <DatePickerInput
          inputValue={date}
          onConfirm={(inputValue) => {
            setDate(inputValue);
          }}
          multiple
        />
      </CContainer>
    </CContainer>
  );
};

export default DocsIndexRoute;
