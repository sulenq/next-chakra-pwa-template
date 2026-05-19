"use client";

import { P, PProps } from "@/components/ui/p";
import { DateVariant, DateFormat } from "@/types/global.types";
import useDateFormat from "@/features/settings/regional/contexts/use-date-format-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import useTimezone from "@/features/settings/regional/contexts/use-timezone-context";
import { formatDate } from "@/utils/formatter";

// -----------------------------------------------------------------

export interface TodayProps extends PProps {
  dateVariant?: DateVariant;
}

export const Today = (props: TodayProps) => {
  // Props
  const { dateVariant = "numeric", ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const tz = useTimezone((s) => s.timezone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

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

  const { t } = useLocaleContext();
  const tz = useTimezone((s) => s.timezone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

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
