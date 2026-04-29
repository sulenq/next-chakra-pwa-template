"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import {
  ButtonVariant,
  DateVariant,
  DisclosureSizes,
  Period,
} from "@/constants/types";
import { getWeekdayNames } from "@/constants/weekdays";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
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
  GroupProps,
  List,
  SimpleGrid,
  Stack,
  StackProps,
  useFieldContext,
} from "@chakra-ui/react";
import { addDays, startOfWeek } from "date-fns";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export const DEFAULT_PERIOD = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

// -----------------------------------------------------------------

interface PeriodPickerProps extends GroupProps {
  period: Period;
  setPeriod: React.Dispatch<Period>;
}

export const PeriodPicker = (props: PeriodPickerProps) => {
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
          if (inputValue) setPeriod(inputValue);
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
        <AppIconLucide icon={ChevronUpIcon} />
      </Btn>

      <Btn
        iconButton
        variant={"ghost"}
        onClick={() => cycleMonth("increment")}
        size={"sm"}
      >
        <AppIconLucide icon={ChevronDownIcon} />
      </Btn>
    </Group>
  );
};

// -----------------------------------------------------------------

export interface DatePickerProps extends StackProps {
  inputValue?: string[];
  period: Period;
  selected?: Date[];
  setSelected?: React.Dispatch<Date[]>;
  multiple?: boolean;
}

export const DatePicker = (props: DatePickerProps) => {
  // Props
  const { period, selected, setSelected, multiple, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Derived States
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
  const weekdays = getWeekdayNames(t);

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
        {weekdays.map((weekday, index) => (
          <P key={index} fontWeight={"medium"} textAlign={"center"}>
            {weekday.substring(0, 2)}
          </P>
        ))}
      </SimpleGrid>

      <CContainer gap={2}>
        {fullDates().map((weeks, index) => (
          <SimpleGrid columns={[7]} key={index} gap={2}>
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

// -----------------------------------------------------------------

export interface SelectedDateListProps {
  id?: string;
  selected: Date[];
  formattedSelected: string;
}

const SelectedDateList = (props: SelectedDateListProps) => {
  // Props
  const { id, selected, formattedSelected } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`${id}-selected-date-list`),
  );

  // Constants
  const userTz = getUserTimezone();

  return (
    <>
      <CContainer
        mt={-2}
        borderColor={"border.muted"}
        bg={"bg.muted"}
        p={2}
        h={"36px"}
        rounded={themeConfig.radii.component}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <P
          maxW={"calc(100% - 16px)"}
          fontWeight={"medium"}
          textAlign={"center"}
          color={formattedSelected === t.selected_date ? "fg.subtle" : ""}
          truncate
          mx={"auto"}
        >
          {formattedSelected}
        </P>
      </CContainer>

      <Disclosure.Root open={open} size={"xs"} scrollBehavior={"inside"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent
              title={capitalizeWords(t.selected_date)}
            />
          </Disclosure.Header>

          <Disclosure.Body>
            <CContainer px={2} pl={4} pt={1}>
              <List.Root gap={2}>
                {isEmptyArray(selected) && <FeedbackNoData />}
                {!isEmptyArray(selected) &&
                  selected.map((item, i) => {
                    return (
                      <List.Item key={i}>
                        {formatDate(item, t, {
                          variant:
                            selected.length > 1
                              ? "weekdayDayShortMonthYear"
                              : "weekdayDayMonthYear",
                          timezoneKey: userTz.key,
                          // withTime: true,
                        })}
                      </List.Item>
                    );
                  })}
              </List.Root>
            </CContainer>
          </Disclosure.Body>

          <Disclosure.Footer>
            <BackButton />
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};

// -----------------------------------------------------------------

export interface DatePickerInputProps extends Omit<BtnProps, "onChange"> {
  id?: string;
  title?: string;
  inputValue?: string[] | null;
  onChange?: (inputValue: DatePickerInputProps["inputValue"]) => void;
  showTimezone?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  multiple?: boolean;
  variant?: ButtonVariant;
  labelFormatVariant?: DateVariant;
}

export const DatePickerInput = (props: DatePickerInputProps) => {
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
    labelFormatVariant = "shortWeekdayDayShortMonthYear",
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(id || "date-picker-input"),
  );

  // States
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

  // Constants
  const userTz = getUserTimezone();
  const localTz = getLocalTimezone();
  const localTzOffsetInMs = getTimezoneOffsetMs(localTz.key);

  // Derived Values
  const resolvedPlaceholder = placeholder ?? t.select_date;
  const resolvedInvalid = invalid ?? fc?.invalid;
  const formattedSelected =
    selected && selected?.length > 0
      ? selected
          .map((date) =>
            formatDate(new Date(date), t, {
              variant: "shortWeekdayDayShortMonthYear",
              timezoneKey: localTz.key,
              // withTime: true,
            }),
          )
          .join(", ")
      : t.selected_date;
  const formattedButtonLabel =
    inputValue && inputValue?.length > 0
      ? inputValue
          .map((date) =>
            formatAbsDate(new Date(date), t, {
              variant: labelFormatVariant,
              // withTime: true,
            }),
          )
          .join(", ")
      : resolvedPlaceholder;

  // Utils
  function handleConfirm() {
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

          <AppIconLucide icon={CalendarIcon} color={"fg.subtle"} mr={-1} />
        </Btn>
      </Tooltip>

      <Disclosure.Root open={open} lazyLoad size={disclosureSize}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent
              title={capitalizeWords(title || t.select_date)}
            />
          </Disclosure.Header>

          <Disclosure.Body>
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
                formattedSelected={formattedSelected}
              />
            </CContainer>
          </Disclosure.Body>

          <Disclosure.Footer>
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
              onClick={handleConfirm}
            >
              {t.confirm}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};
