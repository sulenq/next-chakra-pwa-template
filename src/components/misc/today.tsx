"use client";

import { P, PProps } from "@/components/ui/p";
import { DateVariant, DateFormat } from "@/types/global.types";
import useDateFormatStore from "@/features/settings/views/regional/stores/use-date-format-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import useTimezoneStore from "@/features/settings/views/regional/stores/use-timezone-store";
import { formatDate } from "@/utils/formatter";

// -----------------------------------------------------------------

export interface TodayProps extends PProps {
  dateVariant?: DateVariant;
}

export const Today = (props: TodayProps) => {
  // Props
  const { dateVariant = "numeric", ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();
  const tz = useTimezoneStore((s) => s.timezone);
  const dateFormat = useDateFormatStore((s) => s.dateFormat);

  return (
    <P {...restProps}>
      {formatDate(new Date().toISOString(), t, {
        variant: dateVariant,
        dateFormat: dateFormat?.id as DateFormat,
        timezoneKey: tz.key,
      })}
    </P>
  );
};

// -----------------------------------------------------------------

export interface TodayWeekdayProps extends PProps {}
export const TodayWeekday = (props: TodayWeekdayProps) => {
  const { ...restProps } = props;

  const { t } = useLocaleStore();
  const tz = useTimezoneStore((s) => s.timezone);
  const dateFormat = useDateFormatStore((s) => s.dateFormat);

  return (
    <P {...restProps}>
      {formatDate(new Date().toISOString(), t, {
        variant: "weekday",
        dateFormat: dateFormat?.id as DateFormat,
        timezoneKey: tz.key,
      })}
    </P>
  );
};
