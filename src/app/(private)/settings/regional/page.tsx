"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { toaster } from "@/components/ui/toaster";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { DATE_FORMATS } from "@/constants/dateFormats";
import { LANGUAGES } from "@/constants/languages";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/sizes";
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
import { chakra, HStack, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import {
  IconCalendar,
  IconClock12,
  IconLanguage,
  IconRulerMeasure,
  IconSparkles,
  IconTimezone,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const Language = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { lang, setLang, l } = useLang();

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconLanguage stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.language}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={2}>
        <HStack wrap={"wrap"} px={2}>
          {LANGUAGES.map((item, i) => {
            const isActive = lang === item.key;

            return (
              <Btn
                key={i}
                clicky={false}
                flex={"1 1 180px"}
                px={[3, null, 3]}
                rounded={themeConfig.radii.component}
                variant={"ghost"}
                justifyContent={"start"}
                onClick={() => {
                  setLang(item.key as Type__LanguageOptions);
                }}
                pos={"relative"}
              >
                <Text fontWeight={"medium"} truncate>
                  {item.label}{" "}
                  <chakra.span color={"fg.subtle"} mx={2} fontWeight={"normal"}>
                    {item.code}
                  </chakra.span>
                </Text>

                {isActive && <DotIndicator ml={0} />}
              </Btn>
            );
          })}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};
const Timezone = () => {
  // Contexts
  const { l } = useLang();
  const { timeZone, setTimeZone } = useTimezone();

  // States
  const localTz = getLocalTimezone();
  const timezones = TIME_ZONES;
  const [search, setSearch] = useState("");
  const resolvedTimezones = useMemo(() => {
    if (!search) return timezones;
    const searchTerm = search.toLowerCase().normalize("NFD");
    return timezones.filter(({ key, formattedOffset, localAbbr }) =>
      `${key} ${formattedOffset} ${localAbbr}`
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [search, timezones]);

  return (
    <ItemContainer>
      <ItemHeaderContainer gap={2} pr={3}>
        <HStack truncate w={"full"} justify={"space-between"}>
          <HStack>
            <Icon boxSize={5}>
              <IconTimezone stroke={1.5} />
            </Icon>

            <ItemHeaderTitle>{capitalizeWords(l.timezone)}</ItemHeaderTitle>
          </HStack>

          <HStack>
            <Btn
              size={"xs"}
              variant={"outline"}
              pl={2}
              onClick={() => {
                setTimeZone(localTz);
                toaster.info({
                  title: l.info_timezone_auto.title,
                  description: `${localTz.key} ${localTz.formattedOffset} (${localTz.localAbbr})`,
                  action: {
                    label: "Close",
                    onClick: () => {},
                  },
                });
              }}
            >
              <Icon>
                <IconSparkles />
              </Icon>
              Auto
            </Btn>
          </HStack>
        </HStack>
      </ItemHeaderContainer>

      <CContainer>
        <CContainer px={1} mt={1}>
          <SearchInput
            onChange={(inputValue) => {
              setSearch(inputValue || "");
            }}
            inputValue={search}
            inputProps={{
              variant: "flushed",
              rounded: 0,
            }}
          />
        </CContainer>

        <CContainer
          className={"scrollY"}
          h={"220px"}
          p={2}
          pr={`calc(8px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          {isEmptyArray(resolvedTimezones) && <FeedbackNoData />}

          {!isEmptyArray(resolvedTimezones) && (
            <SimpleGrid columns={[1, null, 2]} gap={2}>
              {resolvedTimezones.map((tz, idx) => {
                const isActive = timeZone.key === tz.key;

                return (
                  <Btn
                    key={`${tz.key}-${idx}`}
                    clicky={false}
                    variant={"ghost"}
                    justifyContent={"start"}
                    px={2}
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

                    {isActive && <DotIndicator ml={0} />}
                  </Btn>
                );
              })}
            </SimpleGrid>
          )}
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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconCalendar stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.date_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={2}>
        <SimpleGrid px={2} columns={[1, 2, 3]} gap={1}>
          {DATE_FORMATS.map((item) => {
            const isActive = item.key === dateFormat;

            return (
              <CContainer
                key={item.key}
                px={[3, null, 3]}
                py={3}
                rounded={themeConfig.radii.component}
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

                  {isActive && <DotIndicator ml={0} />}
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
    </ItemContainer>
  );
};
const TimeFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { timeFormat, setTimeFormat } = useTimeFormat();

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconClock12 stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.time_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={2}>
        <SimpleGrid px={2} columns={[1, 2]} gap={1}>
          {TIME_FORMATS.map((item) => {
            const isActive = item.key === timeFormat;

            return (
              <CContainer
                key={item.key}
                px={[3, null, 3]}
                py={3}
                rounded={themeConfig.radii.component}
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

                  {isActive && <DotIndicator ml={0} />}
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
    </ItemContainer>
  );
};
const UOMFormat = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { UOM, setUOM } = useUOM();

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconRulerMeasure stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.UOM_format}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={2}>
        <SimpleGrid px={2} columns={[1, 2, 3]} gap={1}>
          {UOM_FORMATS.map((item) => {
            const isActive = item.key === UOM;

            return (
              <CContainer
                key={item.key}
                px={[3, null, 3]}
                py={3}
                rounded={themeConfig.radii.component}
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

                  {isActive && <DotIndicator ml={0} />}
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
    </ItemContainer>
  );
};

const SettingsRegionalRoute = () => {
  // Contexts
  const { l } = useLang();

  return (
    <CContainer>
      <CContainer gap={4}>
        <Language />

        <Timezone />

        <DateFormat />

        <TimeFormat />

        <UOMFormat />
      </CContainer>

      <CContainer p={4}>
        <HelperText>{l.msg_settings_saved_locally}</HelperText>
      </CContainer>
    </CContainer>
  );
};
export default SettingsRegionalRoute;
