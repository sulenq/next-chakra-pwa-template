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
  const [time, setTime] = useState(() =>
    formatTime(utcTimeString(), {
      showSeconds: showSeconds,
      timezoneKey: tzKey,
    }),
  );

  // Utils
  function utcTimeString() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const ss = String(now.getUTCSeconds()).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  // handle tick
  useEffect(() => {
    const tick = () =>
      setTime(
        formatTime(utcTimeString(), {
          showSeconds: showSeconds,
          timezoneKey: tzKey,
        }),
      );

    tick(); // immediate set to avoid waiting 1s
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [showSeconds, tzKey]);

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
