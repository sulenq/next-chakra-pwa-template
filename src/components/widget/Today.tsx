"use client";

import { P } from "@/components/ui/p";
import useDateFormat from "@/context/useDateFormat";
import useTimezone from "@/context/useTimezone";
import { formatDate } from "@/utils/formatter";
import { TextProps } from "@chakra-ui/react";

export const Today = (props: TextProps) => {
  // Contexts
  const tz = useTimezone((s) => s.timeZone);
  const dateFormat = useDateFormat((s) => s.dateFormat);

  return (
    <P {...props}>
      {formatDate(new Date().toISOString(), {
        timezoneKey: tz.key,
        dateFormat: dateFormat,
      })}
    </P>
  );
};
