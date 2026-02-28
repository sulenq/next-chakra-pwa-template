"use client";

import { P } from "@/components/ui/p";
import { Props__ClockProps } from "@/constants/props";
import useTimezone from "@/context/useTimezone";
import { formatTime } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Clock(props: Props__ClockProps) {
  // Props
  const { showSeconds = false, showTimezone = false, ...restProps } = props;

  // Contexts
  const tz = useTimezone((s) => s.timeZone);
  const tzKey = tz?.key;

  // States
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);

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

  // Prevent hydration mismatch by returning null during SSR and initial client pass
  if (!mounted) {
    return (
      <HStack {...restProps} visibility="hidden">
        <P fontSize={props?.fontSize}>00:00:00</P>
      </HStack>
    );
  }

  return (
    <HStack {...restProps}>
      <P fontSize={props?.fontSize}>{time}</P>

      {showTimezone && (
        <P color={"fg.subtle"} fontSize={props?.fontSize}>
          {tz.localAbbr}
        </P>
      )}
    </HStack>
  );
}
