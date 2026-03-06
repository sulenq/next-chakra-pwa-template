"use client";

import { P } from "@/components/ui/p";
import { DateVariant } from "@/constants/types";
import useDateFormat from "@/context/useDateFormat";
import useLang from "@/context/useLang";
import useTimezone from "@/context/useTimezone";
import { formatDate } from "@/utils/formatter";
import { TextProps } from "@chakra-ui/react";

export interface TodayProps extends TextProps {
  dateVariant?: DateVariant;
}
export const Today = (props: TodayProps) => {
  // Props
  const { dateVariant = "numeric", ...restProps } = props;

  // Contexts
  const { t } = useLang();
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
