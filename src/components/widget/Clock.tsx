import { P } from "@/components/ui/p";
import { Props__ClockProps } from "@/constants/props";
import useTimezone from "@/context/useTimezone";
import { formatTime } from "@/utils/formatter";
import { useEffect, useState } from "react";

export default function Clock(props: Props__ClockProps) {
  const { withSeconds = false, ...restProps } = props;

  const tz = useTimezone((s) => s.timeZone);
  const tzKey = tz?.key;

  // format UTC time string because `formatTime` expects UTC input
  function utcTimeString() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const ss = String(now.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  const [time, setTime] = useState(() =>
    formatTime(utcTimeString(), {
      showSeconds: withSeconds,
      timezoneKey: tzKey,
    })
  );

  useEffect(() => {
    const tick = () =>
      setTime(
        formatTime(utcTimeString(), {
          showSeconds: withSeconds,
          timezoneKey: tzKey,
        })
      );

    tick(); // immediate set to avoid waiting 1s
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [withSeconds, tzKey]);

  return <P {...restProps}>{time}</P>;
}
