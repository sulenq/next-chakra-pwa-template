"use client";

import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { Limitation } from "@/components/widgets/limitation";
import { SettingsSavedLocalyHelperText } from "@/components/widgets/local-settings-helper-text";
import { Pagination } from "@/components/widgets/pagination";
import { DATE_FORMATS } from "@/constants/date-formats";
import { LANGUAGES } from "@/constants/languages";
import { R_SPACING_MD } from "@/constants/styles";
import { TIME_FORMATS } from "@/constants/time-formats";
import { TIME_ZONES } from "@/constants/timezones";
import { UOM_FORMATS } from "@/constants/uom-formats";
import useDateFormat from "@/contexts/use-date-format-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import useTimeFormat from "@/contexts/use-time-format-context";
import useTimezone from "@/contexts/use-timezone-context";
import useUOMFormat from "@/contexts/use-uom-format-context";
import {
  type DateFormat,
  type LocaleOption,
  type TimeFormat,
} from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { formatDate, formatTime } from "@/utils/formatter";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getLocalTimezone, makeTime } from "@/utils/time";
import { chakra, SimpleGrid, Text } from "@chakra-ui/react";
import {
  CalendarIcon,
  GlobeIcon,
  HourglassIcon,
  LanguagesIcon,
  RulerDimensionLineIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const NAVS_COLOR = "fg.muted";

// -----------------------------------------------------------------

const Language = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { t, locale, setLocale } = useLocale();

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={LanguagesIcon} />

          <Item.Title>{t.language}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <StackH align={"center"} wrap={"wrap"}>
            {LANGUAGES.map((item, i) => {
              const isSelected = locale === item.key;

              return (
                <Btn
                  key={i}
                  clicky={false}
                  flex={"1 1 180px"}
                  px={3}
                  rounded={themeContext.radii.component}
                  variant={"ghost"}
                  justifyContent={"start"}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setLocale(item.key as LocaleOption);
                  }}
                  pos={"relative"}
                >
                  <Text fontWeight={"medium"} truncate>
                    {item.label}

                    <chakra.span
                      color={"fg.subtle"}
                      ml={2}
                      fontWeight={"normal"}
                    >
                      {item.code}
                    </chakra.span>
                  </Text>

                  {isSelected && <DotIndicator />}
                </Btn>
              );
            })}
          </StackH>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const Timezone = () => {
  const LIMIT_OPTIONS = [10, 20, 50, 100];

  // Contexts
  const { t } = useLocale();
  const { timeZone, setTimeZone } = useTimezone();

  // States
  const localTz = getLocalTimezone();
  const timezones = TIME_ZONES;
  const [limit, setLimit] = useState<number>(LIMIT_OPTIONS[0]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const resolvedTimezones = useMemo(() => {
    if (!search) return timezones;
    const searchTerm = search.toLowerCase().normalize("NFD");
    return timezones.filter(({ key, formattedOffset, localAbbr }) =>
      `${key} ${formattedOffset} ${localAbbr}`
        .toLowerCase()
        .includes(searchTerm),
    );
  }, [search, timezones]);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  return (
    <Item.Root>
      <Item.Header borderless justify={"space-between"}>
        <StackH align={"center"}>
          <AppIconLucide icon={GlobeIcon} />

          <Item.Title>{capitalizeWords(t.timezone)}</Item.Title>
        </StackH>

        <StackH align={"center"}>
          <Btn
            size={"xs"}
            variant={"outline"}
            onClick={() => {
              setTimeZone(localTz);
              toaster.info({
                title: t.info_timezone_auto.title,
                description: `${localTz.key} ${localTz.formattedOffset} (${localTz.localAbbr})`,
              });
            }}
          >
            Auto
          </Btn>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body>
          <StackV p={4}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-timezone-settings"}
            />
          </StackV>

          <StackV px={4}>
            {isEmptyArray(resolvedTimezones) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedTimezones) && (
              <SimpleGrid columns={[1, null, 2]} gap={2}>
                {resolvedTimezones
                  .slice((page - 1) * limit, page * limit)
                  .map((tz, index) => {
                    const isSelected = timeZone.key === tz.key;

                    return (
                      <Tooltip
                        key={`${tz.key}-${index}`}
                        content={`${tz.key} ${tz.localAbbr} (${tz.formattedOffset})`}
                      >
                        <Btn
                          clicky={false}
                          variant={"ghost"}
                          justifyContent={"start"}
                          px={3}
                          color={isSelected ? "" : NAVS_COLOR}
                          onClick={() => {
                            setTimeZone(tz);
                          }}
                          pos={"relative"}
                        >
                          <P textAlign={"left"} lineClamp={1}>
                            {tz.key}
                          </P>

                          <P
                            textAlign={"left"}
                            color={"fg.subtle"}
                          >{`${tz.localAbbr} (${tz.formattedOffset})`}</P>

                          {isSelected && <DotIndicator />}
                        </Btn>
                      </Tooltip>
                    );
                  })}
              </SimpleGrid>
            )}
          </StackV>

          <StackH
            align={"center"}
            p={3}
            // borderTop={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
            wrap={"wrap"}
          >
            <StackV w={"fit"} mb={[1, null, 0]}>
              <Limitation
                limit={limit}
                setLimit={setLimit}
                limitOptions={LIMIT_OPTIONS}
              />
            </StackV>

            <StackV w={"fit"}>
              <Pagination
                page={page}
                setPage={setPage}
                totalPage={
                  Math.floor(resolvedTimezones.length / limit) === 0
                    ? undefined
                    : Math.floor(resolvedTimezones.length / limit)
                }
              />
            </StackV>
          </StackH>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const DateFormat = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { dateFormat, setDateFormat } = useDateFormat();

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={CalendarIcon} />

          <Item.Title>{t.date_format}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {DATE_FORMATS.map((item) => {
              const isSelected = item.key === dateFormat;

              return (
                <StackV
                  key={item.key}
                  p={3}
                  rounded={themeContext.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setDateFormat(item.key as DateFormat);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <StackH align={"center"}>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </StackH>

                  <P color={"fg.muted"} mb={2}>
                    {item.description}
                  </P>

                  {/* Example */}
                  <P color={"fg.subtle"}>
                    {formatDate(new Date().toISOString(), t, {
                      variant: "weekdayDayShortMonthYear",
                      dateFormat: item.key as DateFormat,
                    })}
                  </P>
                </StackV>
              );
            })}
          </SimpleGrid>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const TimeFormat = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { timeFormat, setTimeFormat } = useTimeFormat();

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={HourglassIcon} />

          <Item.Title>{t.time_format}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <SimpleGrid columns={[1, 2]} gap={2}>
            {TIME_FORMATS.map((item) => {
              const isSelected = item.key === timeFormat;

              return (
                <StackV
                  key={item.key}
                  p={3}
                  rounded={themeContext.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setTimeFormat(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <StackH align={"center"}>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </StackH>

                  <P>
                    {formatTime(makeTime(new Date().toISOString()), {
                      timeFormat: item.key as TimeFormat,
                    })}
                  </P>
                </StackV>
              );
            })}
          </SimpleGrid>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const UOMFormat = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { t } = useLocale();
  const { UOM, setUOM } = useUOMFormat();

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={RulerDimensionLineIcon} />

          <Item.Title>{t.UOM_format}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body gap={4} p={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {UOM_FORMATS.map((item) => {
              const isSelected = item.key === UOM;

              return (
                <StackV
                  key={item.key}
                  p={3}
                  rounded={themeContext.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setUOM(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <StackH align={"center"}>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </StackH>

                  <P color={"fg.muted"} mb={2}>
                    {pluckString(t, item.descriptionKey)}
                  </P>

                  {/* Example */}
                  <StackH align={"center"} wrap={"wrap"} mt={"auto"}>
                    {Object.keys(item.units).map((key) => {
                      return (
                        <P key={key} color={"fg.subtle"}>
                          {item.units[key as keyof typeof item.units]}
                        </P>
                      );
                    })}
                  </StackH>
                </StackV>
              );
            })}
          </SimpleGrid>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <Language />

      <Timezone />

      <DateFormat />

      <TimeFormat />

      <UOMFormat />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
