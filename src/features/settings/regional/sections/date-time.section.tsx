import { Item } from "@/components/container/item";
import { GroupItem } from "@/components/container/group-item";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { SettingsGroupTitle } from "@/components/ui/typography";
import { R_SPACING_MD } from "@/constants/styles";
import { SelectDateFormat } from "@/features/settings/regional/components/select-date-format";
import { SelectTimeFormat } from "@/features/settings/regional/components/select-time-format";
import { SelectTimezone } from "@/features/settings/regional/components/select-timezone";
import useDateFormatStore from "@/features/settings/regional/stores/use-date-format-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import useTimeFormatStore from "@/features/settings/regional/stores/use-time-format-store";
import useTimezoneStore from "@/features/settings/regional/stores/use-timezone-store";
import { SelectOption } from "@/types/global.types";
import { getLocalTimezone } from "@/utils/time";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const DateFormatSetting = () => {
  // Stores
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
    <GroupItem.Root>
      <StackV gap={1}>
        <P>{t.settings_date_format.title}</P>
      </StackV>

      <GroupItem.Target>
        <SelectDateFormat
          id={"settings-select-date-format"}
          value={dateFormat}
          onChange={(value) => {
            setDateFormat(value);
          }}
          w={"fit"}
          p={0}
          size={"xs"}
          variant={"plain"}
          color={"fg.subtle"}
        />
      </GroupItem.Target>
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

const TimeFormatSetting = () => {
  // Stores
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
    <GroupItem.Root>
      <StackV gap={1}>
        <P>{t.settings_time_format.title}</P>
      </StackV>

      <GroupItem.Target>
        <SelectTimeFormat
          id={"settings-select-time-format"}
          value={timeFormat}
          onChange={(value) => {
            setTimeFormat(value);
          }}
          w={"fit"}
          p={0}
          size={"xs"}
          variant={"plain"}
          color={"fg.subtle"}
        />
      </GroupItem.Target>
    </GroupItem.Root>
  );
};
// -----------------------------------------------------------------

const AutoTimezomeSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { isAuto, enableAuto, disableAuto } = useTimezoneStore();

  return (
    <GroupItem.Root>
      <StackV gap={1}>
        <P>{t.settings_auto_timezone.title}</P>

        <P color={"fg.subtle"}>{t.settings_auto_timezone.description}</P>
      </StackV>

      <GroupItem.Target>
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
      </GroupItem.Target>
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

const TimezoneSetting = () => {
  // Stores
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
    <GroupItem.Root disabled={isAuto}>
      <StackV gap={1}>
        <P>{t.settings_timezone.title}</P>
      </StackV>

      <GroupItem.Target>
        <SelectTimezone
          id={"settings-select-time-zone"}
          value={timezone}
          onChange={(value) => {
            setTimezone(value);
            if (value?.[0]?.data) setTimezoneContext(value[0].data);
          }}
          w={"fit"}
          p={0}
          variant={"plain"}
          size={"xs"}
          placeholder={`${t.select} ${t.timezone.toLocaleLowerCase()}`}
          color={"fg.subtle"}
        />
      </GroupItem.Target>
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

export const DateTimeSection = () => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsGroupTitle>
        {t.settings_date_time_section.title}
      </SettingsGroupTitle>

      <Item.Body>
        <DateFormatSetting />

        <Divider />

        <TimeFormatSetting />

        <Divider />

        <AutoTimezomeSetting />

        <Divider />

        <TimezoneSetting />
      </Item.Body>
    </Item.Root>
  );
};
