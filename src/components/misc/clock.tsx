"use client";

import { TNum, P } from "@/components/ui/p";
import { StackH } from "@/components/ui/stack";
import useTimezoneStore from "@/features/settings/regional/stores/use-timezone-store";
import { formatTime } from "@/utils/formatter";
import { Span, StackProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface ClockPropsProps extends StackProps {
  showSeconds?: boolean;
  showAbbr?: boolean;
}

export const Clock = (props: ClockPropsProps) => {
  // Props
  const { showSeconds = false, showAbbr = true, ...restProps } = props;

  // Stores
  const tz = useTimezoneStore((s) => s.timezone);
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
    <StackH w={"fit"} {...restProps}>
      <P fontSize={props?.fontSize}>
        <TNum>{time}</TNum>
        {/* {time} */}

        <Span ml={2} fontSize={"inherit"}>
          {showAbbr && tz.localAbbr}
        </Span>
      </P>
    </StackH>
  );
};
