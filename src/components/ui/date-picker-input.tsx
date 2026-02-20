"use client";

import { LucideIcon } from "@/components/widget/Icon";
import {
  Props__DatePicker,
  Props__DatePickerInput,
  Props__SelectedDateList,
} from "@/constants/props";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatAbsDate, formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import {
  getLocalTimezone,
  getTimezoneOffsetMs,
  getUserTimezone,
} from "@/utils/time";
import {
  Group,
  Icon,
  List,
  SimpleGrid,
  Stack,
  useDisclosure,
  useFieldContext,
} from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import { addDays, startOfWeek } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import BackButton from "../widget/BackButton";
import FeedbackNoData from "../widget/FeedbackNoData";
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
import { Tooltip } from "./tooltip";

export const DEFAULT_PERIOD = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

export const PeriodPicker = (props: any) => {
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
    <Group w={"full"} {...restProps}>
      <PeriodPickerInput
        flex={1}
        size={"sm"}
        px={3}
        inputValue={period}
        variant={"ghost"}
        invalid={false}
        onChange={(inputValue) => {
          setPeriod(inputValue);
        }}
        withIcon={false}
        required
      />

      <Btn
        iconButton
        variant={"ghost"}
        onClick={() => cycleMonth("decrement")}
        size={"sm"}
      >
        <Icon boxSize={4}>
          <IconCaretDownFilled />
        </Icon>
      </Btn>

      <Btn
        iconButton
        variant={"ghost"}
        onClick={() => cycleMonth("increment")}
        size={"sm"}
      >
        <Icon boxSize={4}>
          <IconCaretUpFilled />
        </Icon>
      </Btn>
    </Group>
  );
};
export const DatePicker = (props: Props__DatePicker) => {
  // Props
  const { period, selected, setSelected, multiple, ...restProps } = props;

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
        borderColor={"border.muted"}
        pb={2}
        mb={2}
        color={"fg.muted"}
      >
        {WEEKDAYS.map((day, i) => (
          <P key={i} fontWeight={"medium"} textAlign={"center"}>
            {day.substring(0, 2)}
          </P>
        ))}
      </SimpleGrid>

      <CContainer gap={2}>
        {fullDates().map((weeks, i) => (
          <SimpleGrid columns={[7]} key={i} gap={2}>
            {weeks.map((date, ii) => {
              const today = new Date();
              const isDateSelected = selected?.some(
                (sd) =>
                  sd.getDate() === date.fullDate.getDate() &&
                  sd.getMonth() === date.month &&
                  sd.getFullYear() === date.year,
              );
              const isDateToday =
                date.date === today.getDate() &&
                date.month === today.getMonth() &&
                date.year === today.getFullYear();
              const isOutsideMonthAndUnselected =
                date.month !== period.month && !isDateSelected;

              return (
                <Btn
                  key={ii}
                  clicky={false}
                  rounded={"full"}
                  size={"md"}
                  onClick={() => {
                    if (multiple) {
                      const newSelectedDates = selected?.some(
                        (sd) =>
                          sd.getDate() === date.fullDate.getDate() &&
                          sd.getMonth() === date.month &&
                          sd.getFullYear() === date.year,
                      )
                        ? selected?.filter(
                            (sd) =>
                              !(
                                sd.getDate() === date.fullDate.getDate() &&
                                sd.getMonth() === date.month &&
                                sd.getFullYear() === date.year
                              ),
                          )
                        : [...(selected ?? []), date.fullDate].sort(
                            (a, b) => a.getTime() - b.getTime(),
                          );

                      setSelected?.(newSelectedDates);
                    } else {
                      if (isDateSelected) {
                        setSelected?.([]);
                      } else {
                        setSelected?.([date.fullDate]);
                      }
                    }
                  }}
                  variant={isDateSelected ? "outline" : "ghost"}
                  borderColor={isDateSelected ? themeConfig.primaryColor : ""}
                  aspectRatio={1}
                >
                  <P
                    color={
                      isOutsideMonthAndUnselected
                        ? "d4"
                        : isDateToday
                          ? themeConfig.primaryColor
                          : isDateSelected
                            ? ""
                            : "fg.muted"
                    }
                    fontWeight={isDateToday ? "extrabold" : ""}
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

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${id}-selected-date-list`),
    open,
    onOpen,
    onClose,
  );

  // States
  const userTz = getUserTimezone();

  return (
    <>
      <CContainer
        mt={-2}
        borderColor={"border.muted"}
        bg={"bg.muted"}
        p={2}
        h={"36px"}
        rounded={6}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <P
          maxW={"calc(100% - 16px)"}
          fontWeight={"medium"}
          textAlign={"center"}
          color={formattedSelectedLabel === l.selected_date ? "fg.subtle" : ""}
          truncate
          mx={"auto"}
        >
          {formattedSelectedLabel}
        </P>
      </CContainer>

      <DisclosureRoot open={open} size={"xs"} scrollBehavior={"inside"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={capitalizeWords(l.selected_date)} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer px={2} pl={4} pt={1}>
              <List.Root gap={2}>
                {isEmptyArray(selected) && <FeedbackNoData />}
                {!isEmptyArray(selected) &&
                  selected.map((item, i) => {
                    return (
                      <List.Item key={i}>
                        {formatDate(item, {
                          // withTime: true,
                          variant:
                            selected.length > 1
                              ? "weekdayDayShortMonthYear"
                              : "weekdayDayMonthYear",
                          timezoneKey: userTz.key,
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
    title = "",
    inputValue,
    onChange,
    showTimezone,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    multiple,
    variant = "outline",
    labelFormatVariant = "weekdayDayShortMonthYear",
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(id || `date-picker-input`),
    open,
    onOpen,
    onClose,
  );

  // States
  const resolvedInvalid = invalid ?? fc?.invalid;
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Type__Period>(DEFAULT_PERIOD);
  const userTz = getUserTimezone();
  const localTz = getLocalTimezone();
  const localTzOffsetInMs = getTimezoneOffsetMs(localTz.key);
  const resolvedPlaceholder = placeholder || l.select_date;
  const formattedSelectedLabel =
    selected && selected?.length > 0
      ? selected
          .map((date) =>
            formatDate(new Date(date), {
              // withTime: true,
              timezoneKey: localTz.key,
              variant: "weekdayDayShortMonthYear",
            }),
          )
          .join(", ")
      : l.selected_date;
  const formattedButtonLabel =
    inputValue && inputValue?.length > 0
      ? inputValue
          .map((date) =>
            formatAbsDate(new Date(date), {
              // withTime: true,
              variant: labelFormatVariant,
            }),
          )
          .join(", ")
      : resolvedPlaceholder;

  // Utils
  function onConfirmSelected() {
    if (!required) {
      if (!isEmptyArray(selected)) {
        onChange?.(
          selected.map((item) =>
            new Date(
              item.getTime() + getTimezoneOffsetMs(localTz.key),
            ).toISOString(),
          ),
        );
      } else {
        onChange?.(null);
      }
      back();
    }
  }

  // set selected date on open
  useEffect(() => {
    if (inputValue && !isEmptyArray(inputValue)) {
      const localDates = inputValue.map((item) => {
        return new Date(new Date(item).getTime() - localTzOffsetInMs);
      });

      setSelected(localDates);

      // Use the last date in the array for period
      const lastDate = localDates[localDates.length - 1];
      setPeriod({
        month: lastDate.getMonth(),
        year: lastDate.getFullYear(),
      });
    }
  }, [open]);

  return (
    <>
      <Tooltip
        content={inputValue ? formattedButtonLabel : resolvedPlaceholder}
      >
        <Btn
          w={"full"}
          gap={4}
          justifyContent={"space-between"}
          borderColor={
            resolvedInvalid
              ? "border.error"
              : variant === "subtle"
                ? "transparent"
                : "border.muted"
          }
          onClick={onOpen}
          variant={variant}
          {...restProps}
        >
          {!isEmptyArray(inputValue) && (
            <P lineClamp={1} textAlign={"left"}>
              {formattedButtonLabel}
            </P>
          )}

          {isEmptyArray(inputValue) && (
            <P color={"placeholder"} lineClamp={1} textAlign={"left"}>
              {resolvedPlaceholder}
            </P>
          )}

          <Icon
            boxSize={BASE_ICON_BOX_SIZE}
            color={"fg.subtle"}
            flexShrink={0}
            mr={-1}
          >
            <LucideIcon icon={CalendarIcon} />
          </Icon>
        </Btn>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(title || l.select_date)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={4}>
              <PeriodPicker period={period} setPeriod={setPeriod} zIndex={2} />

              <DatePicker
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
            {showTimezone && (
              <Stack
                flexDir={["row", null, "column"]}
                justify={"space-between"}
                mr={[0, null, "auto"]}
              >
                <P
                  color={"fg.subtle"}
                  fontSize={"sm"}
                  lineHeight={1}
                >{`${userTz.key}`}</P>
                <P
                  color={"fg.subtle"}
                  fontSize={"sm"}
                  lineHeight={1}
                >{`${userTz.formattedOffset}`}</P>
              </Stack>
            )}

            <Btn
              variant={"outline"}
              onClick={() => {
                setSelected([]);
                setPeriod(DEFAULT_PERIOD);
              }}
            >
              Clear
            </Btn>

            <Btn
              colorPalette={themeConfig.colorPalette}
              disabled={required && isEmptyArray(selected)}
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
