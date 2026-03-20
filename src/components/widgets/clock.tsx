"use client";

import { P } from "@/components/ui/p";
import { StackH } from "@/components/ui/stack";
import useTimezone from "@/contexts/useTimezone";
import { formatTime } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export interface ClockPropsProps extends StackProps {
  showSeconds?: boolean;
  showTimezone?: boolean;
}
export const Clock = (props: ClockPropsProps) => {
  // Props
  const { showSeconds = false, showTimezone = false, ...restProps } = props;

  // Contexts
  const tz = useTimezone((s) => s.timeZone);
  const tzKey = tz?.key;

  // States
  const [time, setTime] = useState("");

  // Utils
  function utcTimeString() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const ss = String(now.getUTCSeconds()).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  // Effect to handle mounting and ticking
  useEffect(() => {
    const tick = () => {
      setTime(
        formatTime(utcTimeString(), {
          showSeconds,
          timezoneKey: tzKey,
        }),
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [showSeconds, tzKey]);

  return (
    <StackH {...restProps}>
      <P fontSize={props?.fontSize} fontVariantNumeric={"tabular-nums"}>
        {time}
      </P>

      {showTimezone && <P fontSize={props?.fontSize}>{tz.localAbbr}</P>}
    </StackH>
  );
};
