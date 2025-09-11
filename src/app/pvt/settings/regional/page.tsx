"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import ItemHeaderContainer from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { DATE_FORMATS } from "@/constants/dateFormats";
import { LANGUAGES } from "@/constants/languages";
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
import useScreen from "@/hooks/useScreen";
import { formatDate, formatTime } from "@/utils/formatter";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getLocalTimezone, makeTime } from "@/utils/time";
import { chakra, HStack, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import {
  IconCalendar,
  IconClock12,
  IconLanguage,
  IconRulerMeasure,
  IconTimezone,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { AutoSizer, Grid, GridCellRenderer } from "react-virtualized";

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
        <SimpleGrid px={2} columns={[1, 2]}>
          {LANGUAGES.map((item, i) => {
            const active = lang === item.key;

            return (
              <Btn
                key={i}
                clicky={false}
                borderRadius={themeConfig.radii.component}
                gap={1}
                variant={"ghost"}
                justifyContent={"start"}
                px={[3, null, 3]}
                onClick={() => {
                  setLang(item.key as Type__LanguageOptions);
                }}
              >
                <Text fontWeight={"medium"} truncate>
                  {item.label}{" "}
                  <chakra.span color={"fg.subtle"} mx={2} fontWeight={"normal"}>
                    {item.code}
                  </chakra.span>
                </Text>

                {active && <DotIndicator />}
              </Btn>
            );
          })}
        </SimpleGrid>
      </CContainer>
    </ItemContainer>
  );
};
const Timezone = () => {
  // Contexts
  const { l } = useLang();
  const { timeZone, setTimeZone } = useTimezone();

  // Constants
  const autoTZ = useMemo(() => getLocalTimezone(), []);
  const resolverTimezone = useMemo(() => [autoTZ, ...TIME_ZONES], [autoTZ]);

  // States
  const [search, setSearch] = useState("");
  console.log(search);

  // Filtered Timezones
  const fd = useMemo(() => {
    if (!search) return resolverTimezone;
    const searchTerm = search.toLowerCase().normalize("NFD");
    return resolverTimezone.filter(({ key, formattedOffset, localAbbr }) =>
      `${key} ${formattedOffset} ${localAbbr}`
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [search, resolverTimezone]);

  // Utils
  const { sw } = useScreen();
  const iss = sw < 1000;
  const columnCount = iss ? 1 : 2;

  // Cell Renderer vz
  const cellRenderer: GridCellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style,
  }) => {
    const itemIndex = rowIndex * columnCount + columnIndex; // exceeds fd.length
    if (itemIndex >= fd.length) return null; // handle exceeds
    const item = fd[itemIndex];

    return (
      <div
        key={key}
        style={{
          ...style,
          paddingLeft: itemIndex % 2 === 0 || iss ? "8px" : "",
          paddingRight: itemIndex % 2 === 0 && !iss ? "" : "8px",
        }}
      >
        <Btn
          clicky={false}
          onClick={() => setTimeZone(item)}
          variant="ghost"
          justifyContent="start"
          px={[3, null, 3]}
          w={"full"}
        >
          <P fontWeight={"medium"} truncate>
            {item.label}
          </P>
          <P color="fg.subtle">{item.formattedOffset}</P>
          <P color="fg.subtle" ml={-1}>
            {`(${item.localAbbr})`}
          </P>
          {item.key === timeZone.key && <DotIndicator />}
        </Btn>
      </div>
    );
  };

  return (
    <ItemContainer>
      <ItemHeaderContainer borderless={iss} gap={2}>
        <HStack truncate w={"full"} justify={"space-between"}>
          <HStack>
            <Icon boxSize={5}>
              <IconTimezone stroke={1.5} />
            </Icon>

            <ItemHeaderTitle>{capitalizeWords(l.timezone)}</ItemHeaderTitle>
          </HStack>

          <P color="fg.subtle" truncate>
            {`${timeZone.key} ${timeZone.formattedOffset} (${timeZone.localAbbr})`}
          </P>
        </HStack>
      </ItemHeaderContainer>

      <CContainer>
        <CContainer px={3} mt={2}>
          <SearchInput
            onChange={(inputValue) => {
              setSearch(inputValue || "");
            }}
            inputValue={search}
            inputProps={{
              variant: "flushed",
              borderRadius: 0,
            }}
          />
        </CContainer>

        <CContainer h="178px" mb={2}>
          {fd.length === 0 ? (
            <FeedbackNoData />
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <Grid
                  width={width}
                  height={height}
                  columnCount={columnCount}
                  columnWidth={width / columnCount}
                  rowCount={Math.ceil(fd.length / columnCount)}
                  rowHeight={40}
                  cellRenderer={cellRenderer}
                  className="scrollY timezones-list"
                  style={{
                    paddingTop: "8px",
                    // paddingBottom: "8px",
                    overflowX: "clip",
                  }}
                />
              )}
            </AutoSizer>
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
        <SimpleGrid px={2} columns={[1, 2, 3]}>
          {DATE_FORMATS.map((item, i) => {
            const active = item.key === dateFormat;

            return (
              <CContainer
                key={i}
                px={[3, null, 3]}
                py={3}
                borderRadius={themeConfig.radii.component}
                onClick={() => {
                  setDateFormat(item.key as Type__DateFormat);
                }}
                cursor={"pointer"}
                _hover={{ bg: "gray.subtle" }}
                _active={{ bg: "gray.subtle" }}
                transition={"200ms"}
              >
                <HStack align={"start"}>
                  <P fontWeight={"medium"} truncate>
                    {item.label}
                  </P>

                  {active && <DotIndicator />}
                </HStack>

                <P color={"fg.muted"} mb={2}>
                  {item.description}
                </P>

                {/* Example */}
                <P color={"fg.subtle"}>
                  {formatDate(new Date().toISOString(), {
                    variant: "weekdayFullMonth",
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
        <SimpleGrid px={2} columns={[1, 2]}>
          {TIME_FORMATS.map((item, i) => {
            const active = item.key === timeFormat;

            return (
              <CContainer
                key={i}
                px={[3, null, 3]}
                py={3}
                borderRadius={themeConfig.radii.component}
                onClick={() => {
                  setTimeFormat(item.key);
                }}
                cursor={"pointer"}
                _hover={{ bg: "gray.subtle" }}
                _active={{ bg: "gray.subtle" }}
                transition={"200ms"}
              >
                <HStack align={"start"}>
                  <P fontWeight={"medium"} truncate>
                    {item.label}
                  </P>

                  {active && <DotIndicator />}
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
        <SimpleGrid px={2} columns={[1, 2, 3]}>
          {UOM_FORMATS.map((item, i) => {
            const active = item.key === UOM;

            return (
              <CContainer
                key={i}
                px={[3, null, 3]}
                py={3}
                borderRadius={themeConfig.radii.component}
                onClick={() => {
                  setUOM(item.key);
                }}
                cursor={"pointer"}
                _hover={{ bg: "gray.subtle" }}
                _active={{ bg: "gray.subtle" }}
                transition={"200ms"}
              >
                <HStack align={"start"}>
                  <P fontWeight={"medium"} truncate>
                    {item.label}
                  </P>

                  {active && <DotIndicator />}
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
