"use client";

import { P, PProps } from "@/components/ui/p";
import { DateVariant } from "@/types/global.types";
import useDateFormat from "@/contexts/use-date-format-context";
import { useLocale } from "@/contexts/use-locale-context";
import useTimezone from "@/contexts/use-timezone-context";
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
  const tz = useTimezone((s) => s.timezone);
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
  const tz = useTimezone((s) => s.timezone);
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
