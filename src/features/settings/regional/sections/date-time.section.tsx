import { Divider } from "@/components/ui/divider";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { Item } from "@/components/container/item";
import { SelectTimezone } from "@/features/settings/regional/components/select-timezone";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import useDateFormatStore from "@/features/settings/regional/stores/use-date-format-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import useTimeFormatStore from "@/features/settings/regional/stores/use-time-format-store";
import useTimezoneStore from "@/features/settings/regional/stores/use-timezone-store";
import { SelectDateFormat } from "@/features/settings/regional/components/select-date-format";
import { SelectTimeFormat } from "@/features/settings/regional/components/select-time-format";
import { SelectOption } from "@/types/global.types";
import { getLocalTimezone } from "@/utils/time";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const DateFormatSetting = () => {
  // Store
  const { t } = useLocaleStore();
  const { dateFormat: dateFormatContext, setDateFormat: setDateFormatContext } =
    useDateFormatStore();

  // States
  const [dateFormat, setDateFormat] = useState<
    SelectOption[] | null | undefined
  >([dateFormatContext]);

  useEffect(() => {
    if (dateFormat?.[0]) setDateFormatContext(dateFormat[0]);
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
  // Store
  const { t } = useLocaleStore();
  const { timeFormat: timeFormatContext, setTimeFormat: setTimeFormatContext } =
    useTimeFormatStore();

  // States
  const [timeFormat, setTimeFormat] = useState<
    SelectOption[] | null | undefined
  >([timeFormatContext]);

  useEffect(() => {
    if (timeFormat?.[0]) setTimeFormatContext(timeFormat[0]);
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
  // Store
  const { t } = useLocaleStore();
  const { isAuto, enableAuto, disableAuto } = useTimezoneStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_auto_timezone.title}</P>

        <P color={"fg.subtle"}>{t.settings_auto_timezone.description}</P>
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
  // Store
  const { t } = useLocaleStore();
  const {
    isAuto,
    timezone: timezoneContext,
    setTimezone: setTimezoneContext,
  } = useTimezoneStore();

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

export const DateTimeSection = () => {
  // Store
  const { t } = useLocaleStore();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText>
        {t.settings_date_time_section.title}
      </SettingsHelperText>

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
