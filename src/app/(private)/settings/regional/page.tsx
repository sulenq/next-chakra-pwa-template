"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import {
  SettingsHelperText,
  SettingsSavedLocalyHelperText,
} from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { SelectTimezone } from "@/components/widgets/select-timezone";
import { SettingItemContainer } from "@/components/widgets/settings-shell";
import { DATE_FORMATS } from "@/constants/date-formats";
import { LANGUAGES } from "@/constants/languages";
import { R_SPACING_MD } from "@/constants/styles";
import { TIME_FORMATS } from "@/constants/time-formats";
import { UOM_FORMATS } from "@/constants/uom-formats";
import useDateFormat from "@/contexts/use-date-format-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import useTimeFormat from "@/contexts/use-time-format-context";
import useTimezone from "@/contexts/use-timezone-context";
import useUOMFormat from "@/contexts/use-uom-format-context";
import { SelectDateFormat } from "@/features/settings/components/select-date-format";
import { SelectTimeFormat } from "@/features/settings/components/select-time-format";
import {
  SelectOption,
  type DateFormat,
  type LocaleOption,
  type TimeFormat,
} from "@/types/global.types";
import { formatDate, formatTime } from "@/utils/formatter";
import { pluckString } from "@/utils/string";
import { getLocalTimezone, makeTime } from "@/utils/time";
import { chakra, SimpleGrid, Text } from "@chakra-ui/react";
import {
  CalendarIcon,
  HourglassIcon,
  RulerDimensionLineIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const NAVS_COLOR = "fg.muted";

// -----------------------------------------------------------------

const LanguageSection = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { t, locale, setLocale } = useLocale();

  return (
    <Item.Root px={R_SPACING_MD} pb={R_SPACING_MD}>
      <SettingsHelperText>{t.settings_locale.title}</SettingsHelperText>

      <Item.Body p={4} gap={4}>
        <StackH align={"center"} wrap={"wrap"} gap={2}>
          {LANGUAGES.map((item, i) => {
            const isSelected = locale === item.key;

            return (
              <Btn
                key={i}
                clicky={false}
                flex={"1 1 180px"}
                gap={3}
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
                <RadioItem checked={isSelected} />

                <Text fontWeight={"medium"} truncate>
                  {item.label}

                  <chakra.span color={"fg.subtle"} ml={2} fontWeight={"normal"}>
                    {item.code}
                  </chakra.span>
                </Text>
              </Btn>
            );
          })}
        </StackH>

        <P color={"fg.subtle"}>{t.settings_locale.description}</P>
      </Item.Body>

      <SettingsHelperText>{t.settings_locale.helper}</SettingsHelperText>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const DateFormatSetting = () => {
  // Contexts
  const { t } = useLocale();
  const { dateFormat: dateFormatContext, setDateFormat: setDateFormatContext } =
    useDateFormat();

  // States
  const [dateFormat, setDateFormat] = useState<
    SelectOption[] | null | undefined
  >([
    {
      id: dateFormatContext,
      label: dateFormatContext,
      data: dateFormatContext,
    },
  ]);

  useEffect(() => {
    if (dateFormat) setDateFormatContext(dateFormat?.[0].data);
  }, [dateFormat]);

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_date_format.title}</P>
      </StackV>

      <SelectDateFormat
        id={"settings-select-date-format"}
        inputValue={dateFormat}
        onChange={(inputValue) => {
          console.debug(inputValue);
          setDateFormat(inputValue);
        }}
        w={"fit"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const TimeFormatSetting = () => {
  // Contexts
  const { t } = useLocale();
  const { timeFormat: timeFormatContext, setTimeFormat: setTimeFormatContext } =
    useTimeFormat();

  // States
  const [timeFormat, setTimeFormat] = useState<
    SelectOption[] | null | undefined
  >([
    {
      id: timeFormatContext,
      label: timeFormatContext,
      data: timeFormatContext,
    },
  ]);

  useEffect(() => {
    if (timeFormat) setTimeFormatContext(timeFormat?.[0].data);
  }, [timeFormat]);

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_time_format.title}</P>
      </StackV>

      <SelectTimeFormat
        id={"settings-select-time-format"}
        inputValue={timeFormat}
        onChange={(inputValue) => {
          setTimeFormat(inputValue);
        }}
        w={"fit"}
      />
    </SettingItemContainer>
  );
};
// -----------------------------------------------------------------

const AutoTimezomeSetting = () => {
  // Contexts
  const { t } = useLocale();
  const { isAuto, enableAuto, disableAuto } = useTimezone();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_auto_timezone.title}</P>

        <P color="fg.subtle">{t.settings_auto_timezone.description}</P>
      </StackV>

      <Switch
        checked={isAuto}
        onCheckedChange={(e) => {
          if (e.checked) {
            enableAuto();
          } else {
            disableAuto(getLocalTimezone());
          }
        }}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const TimezoneSetting = () => {
  // Contexts
  const { t } = useLocale();
  const {
    isAuto,
    timezone: timezoneContext,
    setTimezone: setTimezoneContext,
  } = useTimezone();

  // States
  const [timezone, setTimezone] = useState<SelectOption[] | null | undefined>([
    {
      id: timezoneContext.key,
      label: timezoneContext.label,
      data: timezoneContext,
    },
  ]);

  console.debug({ isAuto, timezone });

  useEffect(() => {
    if (timezone) setTimezoneContext(timezone?.[0].data);
  }, [timezone]);

  return (
    <SettingItemContainer disabled={isAuto}>
      <StackV gap={1}>
        <P>{t.settings_timezone.title}</P>
      </StackV>

      <SelectTimezone
        id={"settings-select-time-zone"}
        inputValue={timezone}
        onChange={(inputValue) => {
          setTimezone(inputValue);
        }}
        w={"fit"}
        placeholder={`${t.select} ${t.timezone.toLocaleLowerCase()}`}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DateTimeSection = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <Item.Root px={R_SPACING_MD} pb={R_SPACING_MD}>
      <SettingsHelperText>{`${t.date} & ${t.time.toLowerCase()}`}</SettingsHelperText>

      <Item.Body>
        <DateFormatSetting />

        <Divider mx={4} />

        <TimeFormatSetting />

        <Divider mx={4} />

        <AutoTimezomeSetting />

        <Divider mx={4} />

        <TimezoneSetting />
      </Item.Body>
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
        <StackH align={"center"} gap={2}>
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
                  <StackH align={"center"} gap={2}>
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
        <StackH align={"center"} gap={2}>
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
                    setTimeFormat(item.key as TimeFormat);
                  }}
                  cursor={"pointer"}
                  _hover={{ bg: "bg.subtle" }}
                  _active={{ bg: "bg.subtle" }}
                  transition={"200ms"}
                >
                  <StackH align={"center"} gap={2}>
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
        <StackH align={"center"} gap={2}>
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
                  <StackH align={"center"} gap={2}>
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
      <LanguageSection />

      <DateTimeSection />

      <DateFormat />

      <TimeFormat />

      <UOMFormat />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
