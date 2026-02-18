"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { toaster } from "@/components/ui/toaster";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { Limitation } from "@/components/widget/Limitation";
import { LocalSettingsHelperText } from "@/components/widget/LocalSettingsHelperText";
import { Pagination } from "@/components/widget/Pagination";
import { DATE_FORMATS } from "@/constants/dateFormats";
import { LANGUAGES } from "@/constants/languages";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/styles";
import { TIME_FORMATS } from "@/constants/timeFormats";
import { TIME_ZONES } from "@/constants/timezone";
import {
  Type__DateFormat,
  Type__LanguageOptions,
  Type__TimeFormat,
} from "@/constants/types";
import { UOM_FORMATS } from "@/constants/uomFormats";
import useDateFormat from "@/context/useDateFormat";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useTimeFormat from "@/context/useTimeFormat";
import useTimezone from "@/context/useTimezone";
import useUOM from "@/context/useUOM";
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
import { useEffect, useMemo, useRef, useState } from "react";

const NAVS_COLOR = "fg.muted";

const Language = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { lang, setLang, l } = useLang();

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={LanguagesIcon} />
          <ItemHeaderTitle>{l.language}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <HStack wrap={"wrap"}>
            {LANGUAGES.map((item, i) => {
              const isActive = lang === item.key;

              return (
                <Btn
                  key={i}
                  clicky={false}
                  flex={"1 1 180px"}
                  px={3}
                  rounded={themeConfig.radii.component}
                  variant={"ghost"}
                  justifyContent={"start"}
                  color={isActive ? "" : NAVS_COLOR}
                  onClick={() => {
                    setLang(item.key as Type__LanguageOptions);
                  }}
                  pos={"relative"}
                >
                  <Text fontWeight={"medium"} truncate>
                    {item.label}{" "}
                    <chakra.span
                      color={"fg.subtle"}
                      mx={2}
                      fontWeight={"normal"}
                    >
                      {item.code}
                    </chakra.span>
                  </Text>

                  {isActive && <DotIndicator />}
                </Btn>
              );
            })}
          </HStack>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const Timezone = () => {
  const LIMIT_OPTIONS = [14, 28, 56, 100];

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { timeZone, setTimeZone } = useTimezone();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const localTz = getLocalTimezone();
  const timezones = TIME_ZONES;
  const [limit, setLimit] = useState<number>([14, 28, 56][0]);
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
    <ItemContainer ref={containerRef} borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={GlobeIcon} />

          <ItemHeaderTitle>{capitalizeWords(l.timezone)}</ItemHeaderTitle>
        </HStack>

        <HStack>
          <Btn
            size={"xs"}
            variant={"ghost"}
            onClick={() => {
              setTimeZone(localTz);
              toaster.info({
                title: l.info_timezone_auto.title,
                description: `${localTz.key} ${localTz.formattedOffset} (${localTz.localAbbr})`,
              });
            }}
          >
            Auto
          </Btn>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <CContainer p={3}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q_timezone_settings"}
            />
          </CContainer>

          <CContainer
            className={"scrollY"}
            px={3}
            pr={`calc(8px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
          >
            {isEmptyArray(resolvedTimezones) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedTimezones) && (
              <SimpleGrid columns={[1, null, 2]} gap={2}>
                {resolvedTimezones
                  .slice((page - 1) * limit, page * limit)
                  .map((tz, idx) => {
                    const isActive = timeZone.key === tz.key;

                    return (
                      <Btn
                        key={`${tz.key}-${idx}`}
                        clicky={false}
                        variant={"ghost"}
                        justifyContent={"start"}
                        px={3}
                        color={isActive ? "" : NAVS_COLOR}
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
                        >{`${tz.formattedOffset} (${tz.localAbbr})`}</P>

                        {isActive && <DotIndicator />}
                      </Btn>
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
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const DateFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { dateFormat, setDateFormat } = useDateFormat();

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={CalendarIcon} />
          <ItemHeaderTitle>{l.date_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {DATE_FORMATS.map((item) => {
              const isActive = item.key === dateFormat;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isActive ? "" : NAVS_COLOR}
                  onClick={() => {
                    setDateFormat(item.key as Type__DateFormat);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "gray.subtle" }}
                  _active={{ bg: "gray.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isActive && <DotIndicator />}
                  </HStack>

                  <P color={"fg.muted"} mb={2}>
                    {item.description}
                  </P>

                  {/* Example */}
                  <P color={"fg.subtle"}>
                    {formatDate(new Date().toISOString(), {
                      variant: "weekdayDayShortMonthYear",
                      dateFormat: item.key as Type__DateFormat,
                    })}
                  </P>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const TimeFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { timeFormat, setTimeFormat } = useTimeFormat();

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={HourglassIcon} />

          <ItemHeaderTitle>{l.time_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <SimpleGrid columns={[1, 2]} gap={2}>
            {TIME_FORMATS.map((item) => {
              const isActive = item.key === timeFormat;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isActive ? "" : NAVS_COLOR}
                  onClick={() => {
                    setTimeFormat(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "gray.subtle" }}
                  _active={{ bg: "gray.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isActive && <DotIndicator />}
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
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const UOMFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { UOM, setUOM } = useUOM();

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={RulerDimensionLineIcon} />
          <ItemHeaderTitle>{l.UOM_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <SimpleGrid columns={[1, 2, 3]} gap={2}>
            {UOM_FORMATS.map((item) => {
              const isActive = item.key === UOM;

              return (
                <CContainer
                  key={item.key}
                  p={3}
                  rounded={themeConfig.radii.component}
                  color={isActive ? "" : NAVS_COLOR}
                  onClick={() => {
                    setUOM(item.key);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "gray.subtle" }}
                  _active={{ bg: "gray.subtle" }}
                  transition={"200ms"}
                >
                  <HStack>
                    <P fontWeight={"medium"} truncate>
                      {item.label}
                    </P>

                    {isActive && <DotIndicator />}
                  </HStack>

                  <P color={"fg.muted"} mb={2}>
                    {pluckString(l, item.descriptionKey)}
                  </P>

                  {/* Example */}
                  <HStack wrap={"wrap"} mt={"auto"}>
                    <P color={"fg.subtle"}>{item.units.mass}</P>
                    <P color={"fg.subtle"}>{item.units.length}</P>
                    <P color={"fg.subtle"}>{item.units.height}</P>
                    <P color={"fg.subtle"}>{item.units.volume}</P>
                    <P color={"fg.subtle"}>{item.units.area}</P>
                    <P color={"fg.subtle"}>{item.units.speed}</P>
                  </HStack>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default function Page() {
  return (
    <CContainer flex={1} gap={3}>
      <Language />

      <Timezone />

      <DateFormat />

      <TimeFormat />

      <UOMFormat />

      <LocalSettingsHelperText />
    </CContainer>
  );
}
