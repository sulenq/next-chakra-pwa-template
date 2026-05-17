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
import { Item } from "@/components/widgets/item";
import { SelectTimezone } from "@/components/widgets/select-timezone";
import { SettingItemContainer } from "@/components/widgets/settings-shell";
import { DATE_FORMATS } from "@/constants/date-formats";
import { LANGUAGES } from "@/constants/languages";
import { R_SPACING_MD } from "@/constants/styles";
import useDateFormat from "@/contexts/use-date-format-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import useTimeFormat from "@/contexts/use-time-format-context";
import useTimezone from "@/contexts/use-timezone-context";
import useUOMFormat from "@/contexts/use-uom-format-context";
import { SelectDateFormat } from "@/features/settings/components/select-date-format";
import { SelectTimeFormat } from "@/features/settings/components/select-time-format";
import {
  SelectAngleFormat,
  SelectAreaFormat,
  SelectDataFormat,
  SelectDataRateFormat,
  SelectDistanceFormat,
  SelectEnergyFormat,
  SelectHeightFormat,
  SelectLengthFormat,
  SelectMassFormat,
  SelectPowerFormat,
  SelectPressureFormat,
  SelectSpeedFormat,
  SelectTemperatureFormat,
  SelectVolumeFormat,
} from "@/features/settings/components/select-unit-format";
import { SelectOption, UnitKey, type LocaleOption } from "@/types/global.types";
import { getLocalTimezone } from "@/utils/time";
import { chakra, Text } from "@chakra-ui/react";
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
      label: DATE_FORMATS.find(
        (dateFormat) => dateFormat.key === dateFormatContext,
      )?.label,
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
        size={"xs"}
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
        size={"xs"}
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

  // Sync local state when context changes (e.g. auto toggle)
  useEffect(() => {
    setTimezone([
      {
        id: timezoneContext.key,
        label: timezoneContext.label,
        data: timezoneContext,
      },
    ]);
  }, [timezoneContext]);

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
          if (inputValue?.[0]?.data) setTimezoneContext(inputValue[0].data);
        }}
        w={"fit"}
        size={"xs"}
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

// Helper hook for a single UOM unit setting
const useUOMUnitState = (unitKey: UnitKey) => {
  const { UOM, setUOMUnit } = useUOMFormat();
  const currentValue = UOM[unitKey];

  const [value, setValue] = useState<SelectOption[] | null | undefined>([
    { id: currentValue, label: currentValue, data: currentValue },
  ]);

  // Sync local state with context if it changes externally
  useEffect(() => {
    setValue([{ id: currentValue, label: currentValue, data: currentValue }]);
  }, [currentValue]);

  const onChange = (inputValue: SelectOption[] | null | undefined) => {
    setValue(inputValue);
    if (inputValue?.[0]?.data) setUOMUnit(unitKey, inputValue[0].data);
  };

  return { value, onChange };
};

// -----------------------------------------------------------------

const WeightFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("mass");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_weight_format.title}</P>
      </StackV>
      <SelectMassFormat
        id="settings-select-mass-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const HeightFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("height");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_height_format.title}</P>
      </StackV>
      <SelectHeightFormat
        id="settings-select-height-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const LengthFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("length");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_length_format.title}</P>
      </StackV>
      <SelectLengthFormat
        id="settings-select-length-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DistanceFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("distance");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_distance_format.title}</P>
      </StackV>
      <SelectDistanceFormat
        id="settings-select-distance-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const AreaFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("area");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_area_format.title}</P>
      </StackV>
      <SelectAreaFormat
        id="settings-select-area-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const VolumeFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("volume");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_volume_format.title}</P>
      </StackV>
      <SelectVolumeFormat
        id="settings-select-volume-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const TemperatureFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("temperature");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_temperature_format.title}</P>
      </StackV>
      <SelectTemperatureFormat
        id="settings-select-temperature-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const SpeedFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("speed");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_speed_format.title}</P>
      </StackV>
      <SelectSpeedFormat
        id="settings-select-speed-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const EnergyFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("energy");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_energy_format.title}</P>
      </StackV>
      <SelectEnergyFormat
        id="settings-select-energy-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const PowerFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("power");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_power_format.title}</P>
      </StackV>
      <SelectPowerFormat
        id="settings-select-power-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const PressureFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("pressure");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_pressure_format.title}</P>
      </StackV>
      <SelectPressureFormat
        id="settings-select-pressure-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DataFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("data");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_format.title}</P>
      </StackV>
      <SelectDataFormat
        id="settings-select-data-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DataRateFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("dataRate");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_rate_format.title}</P>
      </StackV>
      <SelectDataRateFormat
        id="settings-select-data-rate-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const AngleFormatSetting = () => {
  const { t } = useLocale();
  const { value, onChange } = useUOMUnitState("angle");
  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_angle_format.title}</P>
      </StackV>
      <SelectAngleFormat
        id="settings-select-angle-format"
        inputValue={value}
        onChange={onChange}
        w="fit"
        size="xs"
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const UOMFormatSection = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <Item.Root px={R_SPACING_MD} pb={R_SPACING_MD}>
      <SettingsHelperText>{t.UOM_format}</SettingsHelperText>

      <Item.Body>
        <WeightFormatSetting />

        <Divider mx={4} />

        <HeightFormatSetting />

        <Divider mx={4} />

        <LengthFormatSetting />

        <Divider mx={4} />

        <DistanceFormatSetting />

        <Divider mx={4} />

        <AreaFormatSetting />

        <Divider mx={4} />

        <VolumeFormatSetting />

        <Divider mx={4} />

        <TemperatureFormatSetting />

        <Divider mx={4} />

        <SpeedFormatSetting />

        <Divider mx={4} />

        <EnergyFormatSetting />

        <Divider mx={4} />

        <PowerFormatSetting />

        <Divider mx={4} />

        <PressureFormatSetting />

        <Divider mx={4} />

        <DataFormatSetting />

        <Divider mx={4} />

        <DataRateFormatSetting />

        <Divider mx={4} />

        <AngleFormatSetting />

        {/* <SimpleGrid columns={[1, 2, 3]} gap={2}>
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
        </SimpleGrid> */}
      </Item.Body>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <LanguageSection />

      <DateTimeSection />

      <UOMFormatSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
