"use client";

import { P, PProps } from "@/components/ui/p";
import { DateVariant } from "@/constants/types";
import useDateFormat from "@/contexts/useDateFormat";
import { useLocale } from "@/contexts/useLocale";
import useTimezone from "@/contexts/useTimezone";
import { formatDate } from "@/utils/formatter";

// -----------------------------------------------------------------

export interface TodayProps extends PProps {
  dateVariant?: DateVariant;
}

export const Today = (props: TodayProps) => {
  // Props
  const { dateVariant = "numeric", ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const tz = useTimezone((s) => s.timeZone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

  return (
    <P {...restProps}>
      {formatDate(new Date().toISOString(), t, {
        variant: dateVariant,
        dateFormat: dateFormat,
        timezoneKey: tz.key,
      })}
    </P>
  );
};

// -----------------------------------------------------------------

export interface TodayWeekdayProps extends PProps {}
export const TodayWeekday = (props: TodayWeekdayProps) => {
  const { ...restProps } = props;

  const { t } = useLocale();
  const tz = useTimezone((s) => s.timeZone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

  return (
    <P {...restProps}>
      {formatDate(new Date().toISOString(), t, {
        variant: "weekday",
        dateFormat: dateFormat,
        timezoneKey: tz.key,
      })}
    </P>
  );
};
