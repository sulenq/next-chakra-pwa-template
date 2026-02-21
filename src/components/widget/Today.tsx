"use client";

import { P } from "@/components/ui/p";
import { Props__Today } from "@/constants/props";
import useDateFormat from "@/context/useDateFormat";
import useLang from "@/context/useLang";
import useTimezone from "@/context/useTimezone";
import { formatDate } from "@/utils/formatter";

export const Today = (props: Props__Today) => {
  // Props
  const { dateVariant = "numeric", ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const tz = useTimezone((s) => s.timeZone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

  return (
    <P {...restProps}>
      {formatDate(new Date().toISOString(), l, {
        variant: dateVariant,
        dateFormat: dateFormat,
        timezoneKey: tz.key,
      })}
    </P>
  );
};
