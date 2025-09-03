"use client";

import { Props__DatePickerInput } from "@/constants/props";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { emptyArray } from "@/utils/array";
import { capitalizeWords } from "@/utils/string";
import {
  Group,
  HStack,
  Icon,
  useDisclosure,
  useFieldContext,
} from "@chakra-ui/react";
import {
  IconCalendar,
  IconCaretLeftFilled,
  IconCaretRightFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import BackButton from "../widget/BackButton";
import { Btn } from "./btn";
import { CContainer } from "./c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "./disclosure";
import { DisclosureHeaderContent } from "./disclosure-header-content";
import { P } from "./p";
import { PeriodPickerInput } from "./period-picker-input";

const PeriodPicker = (props: any) => {
  // Props
  const { period, setPeriod, ...restProps } = props;

  // Utils
  function cycleMonth(type: "decrement" | "increment") {
    const currentMonth = period.month ?? 0;
    const currentYear = period.year ?? new Date().getFullYear();

    let newMonth = currentMonth;
    let newYear = currentYear;

    if (type === "decrement") {
      if (currentMonth === 0) {
        newMonth = 11; // Des
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0; // Jan
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }

    setPeriod({ month: newMonth, year: newYear });
  }

  return (
    <Group w={"full"}>
      <Btn
        iconButton
        variant={"outline"}
        onClick={() => cycleMonth("decrement")}
        size={"md"}
      >
        <Icon boxSize={4}>
          <IconCaretLeftFilled />
        </Icon>
      </Btn>

      <PeriodPickerInput
        flex={1}
        size={"md"}
        justifyContent="center"
        inputValue={period}
        invalid={false}
        onConfirm={(inputValue) => {
          setPeriod(inputValue);
        }}
        {...restProps}
      />

      <Btn
        iconButton
        variant={"outline"}
        onClick={() => cycleMonth("increment")}
        size={"md"}
      >
        <Icon boxSize={4}>
          <IconCaretRightFilled />
        </Icon>
      </Btn>
    </Group>
  );
};
const DatePicker = (props: any) => {
  // Props
  const { selected, setSelected, ...restProps } = props;

  return <CContainer></CContainer>;
};

export const DatePickerInput = (props: Props__DatePickerInput) => {
  // Props
  const {
    id,
    title,
    inputValue,
    onConfirm,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    multiple,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || `date-picker-input`, open, onOpen, onClose);

  // States
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState<Type__Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  return (
    <>
      <Btn
        w={"full"}
        clicky={false}
        variant={"outline"}
        justifyContent={"start"}
        onClick={onOpen}
        borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
        {...restProps}
      >
        <HStack w={"full"} justify={"space-between"}>
          <P color={emptyArray(selected) ? "placeholder" : "current"}>
            {l.select_date}
          </P>

          <Icon color={"fg.subtle"}>
            <IconCalendar stroke={1.5} />
          </Icon>
        </HStack>
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={capitalizeWords(l.select_date)} />
          </DisclosureHeader>

          <DisclosureBody>
            <PeriodPicker period={period} setPeriod={setPeriod} />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
