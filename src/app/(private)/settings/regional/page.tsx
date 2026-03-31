"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackV } from "@/components/ui/stack";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { Limitation } from "@/components/widgets/limitation";
import { LocalSettingsHelperText } from "@/components/widgets/local-settings-helper-text";
import { Pagination } from "@/components/widgets/pagination";
import { DATE_FORMATS } from "@/constants/dateFormats";
import { LANGUAGES } from "@/constants/languages";
import { R_SPACING_MD } from "@/constants/styles";
import { TIME_FORMATS } from "@/constants/timeFormats";
import { TIME_ZONES } from "@/constants/timezone";
import {
  Type__DateFormat,
  Type__LanguageOptions,
  Type__TimeFormat,
} from "@/constants/types";
import { UOM_FORMATS } from "@/constants/uomFormats";
import useDateFormat from "@/contexts/useDateFormat";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import useTimeFormat from "@/contexts/useTimeFormat";
import useTimezone from "@/contexts/useTimezone";
import useUOMFormat from "@/contexts/useUOMFormat";
import { isEmptyArray } from "@/utils/array";
import { formatDate, formatTime } from "@/utils/formatter";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getLocalTimezone, makeTime } from "@/utils/time";
import { chakra, HStack, SimpleGrid, Text } from "@chakra-ui/react";
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
  const { themeConfig } = useThemeConfig();
  const { t, locale, setLocale } = useLocale();

  return (
    <Item.Content borderless bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={LanguagesIcon} />
          <Item.Title>{t.language}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Content p={4}>
          <HStack wrap={"wrap"}>
            {LANGUAGES.map((item, i) => {
              const isSelected = locale === item.key;

              return (
                <Btn
                  key={i}
                  clicky={false}
                  flex={"1 1 180px"}
                  px={3}
                  rounded={themeConfig.radii.component}
                  variant={"ghost"}
                  justifyContent={"start"}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setLocale(item.key as Type__LanguageOptions);
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
          </HStack>
        </Item.Content>
      </StackV>
    </Item.Content>
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
    <Item.Content borderless bg={"transparent"}>
      <Item.Header borderless justify={"space-between"}>
        <HStack>
          <AppIconLucide icon={GlobeIcon} />

          <Item.Title>{capitalizeWords(t.timezone)}</Item.Title>
        </HStack>

        <HStack>
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
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Content>
          <CContainer p={4}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-timezone-settings"}
            />
          </CContainer>

          <CContainer px={4}>
            {isEmptyArray(resolvedTimezones) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedTimezones) && (
              <SimpleGrid columns={[1, null, 2]} gap={2}>
                {resolvedTimezones
                  .slice((page - 1) * limit, page * limit)
                  .map((tz, idx) => {
                    const isSelected = timeZone.key === tz.key;

                    return (
                      <Tooltip
                        key={`${tz.key}-${idx}`}
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
          </CContainer>

          <HStack
            p={3}
            // borderTop={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
            wrap={"wrap"}
          >
            <CContainer w={"fit"} mb={[1, null, 0]}>
              <Limitation
                limit={limit}
                setLimit={setLimit}
                limitOptions={LIMIT_OPTIONS}
              />
            </CContainer>

            <CContainer w={"fit"}>
              <Pagination
                page={page}
                setPage={setPage}
                totalPage={
                  Math.floor(resolvedTimezones.length / limit) === 0
                    ? undefined
                    : Math.floor(resolvedTimezones.length / limit)
                }
              />
            </CContainer>
          </HStack>
        </Item.Content>
      </StackV>
    </Item.Content>
  );
};

// -----------------------------------------------------------------

const DateFormat = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { dateFormat, setDateFormat } = useDateFormat();

  return (
    <Item.Content borderless bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={CalendarIcon} />
          <Item.Title>{t.date_format}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Content p={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {DATE_FORMATS.map((item) => {
              const isSelected = item.key === dateFormat;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setDateFormat(item.key as Type__DateFormat);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </HStack>

                  <P color={"fg.muted"} mb={2}>
                    {item.description}
                  </P>

                  {/* Example */}
                  <P color={"fg.subtle"}>
                    {formatDate(new Date().toISOString(), t, {
                      variant: "weekdayDayShortMonthYear",
                      dateFormat: item.key as Type__DateFormat,
                    })}
                  </P>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </Item.Content>
      </StackV>
    </Item.Content>
  );
};

// -----------------------------------------------------------------

const TimeFormat = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { timeFormat, setTimeFormat } = useTimeFormat();

  return (
    <Item.Content borderless bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={HourglassIcon} />

          <Item.Title>{t.time_format}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Content p={4}>
          <SimpleGrid columns={[1, 2]} gap={2}>
            {TIME_FORMATS.map((item) => {
              const isSelected = item.key === timeFormat;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setTimeFormat(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </HStack>

                  <P>
                    {formatTime(makeTime(new Date().toISOString()), {
                      timeFormat: item.key as Type__TimeFormat,
                    })}
                  </P>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </Item.Content>
      </StackV>
    </Item.Content>
  );
};

// -----------------------------------------------------------------

const UOMFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { t } = useLocale();
  const { UOM, setUOM } = useUOMFormat();

  return (
    <Item.Content borderless bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={RulerDimensionLineIcon} />
          <Item.Title>{t.UOM_format}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Content gap={4} p={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {UOM_FORMATS.map((item) => {
              const isSelected = item.key === UOM;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isSelected ? "" : NAVS_COLOR}
                  onClick={() => {
                    setUOM(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isSelected && <DotIndicator />}
                  </HStack>

                  <P color={"fg.muted"} mb={2}>
                    {pluckString(t, item.descriptionKey)}
                  </P>

                  {/* Example */}
                  <HStack wrap={"wrap"} mt={"auto"}>
                    {Object.keys(item.units).map((key) => {
                      return (
                        <P key={key} color={"fg.subtle"}>
                          {item.units[key as keyof typeof item.units]}
                        </P>
                      );
                    })}
                  </HStack>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </Item.Content>
      </StackV>
    </Item.Content>
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

      <LocalSettingsHelperText />
    </StackV>
  );
}
