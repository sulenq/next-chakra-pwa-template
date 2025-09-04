"use client";

import {
  Props__DatePicker,
  Props__DatePickerInput,
  Props__SelectedDateList,
} from "@/constants/props";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { emptyArray } from "@/utils/array";
import { capitalizeWords } from "@/utils/string";
import {
  Group,
  HStack,
  Icon,
  List,
  SimpleGrid,
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
import { useThemeConfig } from "@/context/useThemeConfig";
import { getTimezoneOffsetMs, getUserTimezone } from "@/utils/time";
import moment from "moment-timezone";
import { addDays, startOfWeek } from "date-fns";
import { Tooltip } from "./tooltip";
import { formatDate } from "@/utils/formatter";
import { back } from "@/utils/client";
import FeedbackNoData from "../widget/FeedbackNoData";

const DEFAULT_PERIOD = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

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
        clicky={false}
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
        clicky={false}
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
const DatePicker = (props: Props__DatePicker) => {
  // Props
  const { inputValue, period, selected, setSelected, multiple, ...restProps } =
    props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const fullDates = () => {
    const firstDayOfMonth = new Date(period.year!, period.month!, 1);

    const startOfFirstWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

    const weekDates = [];
    let currentWeek = [];

    for (let i = 0; i < 6; i++) {
      currentWeek = [];

      for (let j = 0; j < 7; j++) {
        const fullDate = addDays(startOfFirstWeek, i * 7 + j);
        currentWeek.push({
          fullDate: fullDate,
          date: fullDate.getDate(),
          month: fullDate.getMonth(),
          year: fullDate.getFullYear(),
        });
      }

      weekDates.push(currentWeek);
    }

    return weekDates;
  };
  const WEEKDAYS = [
    l.monday,
    l.tuesday,
    l.wednesday,
    l.thursday,
    l.friday,
    l.saturday,
    l.sunday,
  ];

  return (
    <CContainer {...restProps}>
      <SimpleGrid
        columns={[7]}
        gap={2}
        borderBottom={"1px solid"}
        borderColor={"var(--d3)"}
        pb={2}
        mb={2}
      >
        {WEEKDAYS.map((day, i) => (
          <P key={i} fontWeight={"semibold"} textAlign={"center"}>
            {day.substring(0, 2)}
          </P>
        ))}
      </SimpleGrid>

      <CContainer gap={2}>
        {fullDates().map((weeks, i) => (
          <SimpleGrid columns={[7]} key={i} gap={2}>
            {weeks.map((date, ii) => {
              const today = new Date();
              const dateSelected = selected.some(
                (sd) =>
                  sd.getDate() === date.fullDate.getDate() &&
                  sd.getMonth() === date.month &&
                  sd.getFullYear() === date.year
              );
              const dateToday =
                date.date === today.getDate() &&
                date.month === today.getMonth() &&
                date.year === today.getFullYear();

              return (
                <Btn
                  key={ii}
                  clicky={false}
                  borderRadius={"full"}
                  onClick={() => {
                    if (multiple) {
                      const newSelectedDates = selected.some(
                        (sd) =>
                          sd.getDate() === date.fullDate.getDate() &&
                          sd.getMonth() === date.month &&
                          sd.getFullYear() === date.year
                      )
                        ? selected.filter(
                            (sd) =>
                              !(
                                sd.getDate() === date.fullDate.getDate() &&
                                sd.getMonth() === date.month &&
                                sd.getFullYear() === date.year
                              )
                          )
                        : [...selected, date.fullDate].sort(
                            (a, b) => a.getTime() - b.getTime()
                          );
                      setSelected(newSelectedDates);
                    } else {
                      if (dateSelected) {
                        setSelected([]);
                      } else {
                        setSelected([date.fullDate]);
                      }
                    }
                  }}
                  variant={dateSelected ? "outline" : "ghost"}
                  borderColor={dateSelected ? themeConfig.primaryColor : ""}
                  aspectRatio={1}
                >
                  <P
                    opacity={
                      date.month !== period.month && !dateSelected ? 0.3 : 1
                    }
                    color={dateToday ? themeConfig.primaryColor : ""}
                    fontWeight={dateToday ? "extrabold" : ""}
                  >
                    {`${date.date}`}
                  </P>
                </Btn>
              );
            })}
          </SimpleGrid>
        ))}
      </CContainer>
    </CContainer>
  );
};
const SelectedDateList = (props: Props__SelectedDateList) => {
  // Props
  const { id, selected, formattedSelectedLabel } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`${id}-selected-date-list`, open, onOpen, onClose);

  return (
    <>
      <CContainer
        mt={-2}
        borderColor={"border.muted"}
        bg={"bg.muted"}
        p={3}
        borderRadius={6}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <P
          textAlign={"center"}
          fontWeight={"semibold"}
          maxW={"calc(100% - 16px)"}
          mx={"auto"}
          truncate
        >
          {formattedSelectedLabel}
        </P>
      </CContainer>

      <DisclosureRoot open={open} size={"xs"} scrollBehavior={"inside"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title="Tanggal dipilih" />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer px={2} pl={4} pt={1}>
              <List.Root gap={2}>
                {emptyArray(selected) && <FeedbackNoData />}
                {!emptyArray(selected) &&
                  selected.map((item, i) => {
                    return (
                      <List.Item key={i}>
                        {formatDate(item, {
                          variant: "weekdayFullMonth",
                        })}
                      </List.Item>
                    );
                  })}
              </List.Root>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
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
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || `date-picker-input`, open, onOpen, onClose);

  // States
  const userTz = getUserTimezone();
  const offsetInMs = moment.tz(userTz.key).utcOffset() * 60 * 1000;
  const [selected, setSelected] = useState<Date[]>(
    inputValue
      ? inputValue.map(
          (item: any) =>
            new Date(new Date(item).getTime() - getTimezoneOffsetMs(userTz.key))
        )
      : []
  );
  const [period, setPeriod] = useState<Type__Period>(DEFAULT_PERIOD);
  const resolvedPlaceholder = placeholder || l.select_date;
  const formattedSelectedLabel =
    selected && selected?.length > 0
      ? selected
          .map((date) =>
            formatDate(new Date(date), {
              prefixTimeZoneKey: userTz.key,
              variant:
                selected.length > 1 ? "weekdayShortMonth" : "weekdayFullMonth",
            })
          )
          .join(", ")
      : resolvedPlaceholder;
  const formattedButtonLabel =
    inputValue && inputValue?.length > 0
      ? inputValue
          .map((date) =>
            formatDate(new Date(date), {
              prefixTimeZoneKey: userTz.key,
              variant:
                inputValue.length > 1
                  ? "weekdayShortMonth"
                  : "weekdayFullMonth",
            })
          )
          .join(", ")
      : resolvedPlaceholder;

  // Utils
  function onConfirmSelected() {
    if (!required || selected.length > 0) {
      onConfirm?.(
        selected.map((item) =>
          new Date(
            item.getTime() + getTimezoneOffsetMs(userTz.key)
          ).toISOString()
        )
      );
      back();
    }
  }

  return (
    <>
      <Tooltip
        content={inputValue ? formattedButtonLabel : resolvedPlaceholder}
      >
        <Btn
          w={"full"}
          clicky={false}
          variant={"outline"}
          justifyContent={"start"}
          onClick={() => {
            if (inputValue) {
              setSelected(
                inputValue.map(
                  (item) => new Date(new Date(item).getTime() - offsetInMs)
                )
              );
            }
            onOpen();
          }}
          borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
          {...restProps}
        >
          <HStack w={"full"} justify={"space-between"}>
            {!emptyArray(inputValue) && <P>{formattedButtonLabel}</P>}

            {emptyArray(inputValue) && (
              <P color={"placeholder"}>{l.select_date}</P>
            )}

            <Icon color={"fg.subtle"}>
              <IconCalendar stroke={1.5} />
            </Icon>
          </HStack>
        </Btn>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={capitalizeWords(l.select_date)} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={4}>
              <PeriodPicker period={period} setPeriod={setPeriod} />

              <DatePicker
                inputValue={inputValue}
                period={period}
                selected={selected}
                setSelected={setSelected}
                multiple={!!multiple}
              />

              <SelectedDateList
                id={id}
                selected={selected}
                formattedSelectedLabel={formattedSelectedLabel}
              />
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              variant={"outline"}
              onClick={() => {
                setSelected([]);
                setPeriod(DEFAULT_PERIOD);
              }}
            >
              Reset
            </Btn>

            <Btn
              colorPalette={themeConfig.colorPalette}
              disabled={required && selected.length === 0}
              onClick={onConfirmSelected}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
