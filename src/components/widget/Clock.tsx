import { P } from "@/components/ui/p";
import { Props__ClockProps } from "@/constants/props";
import { useEffect, useState } from "react";
import { formatTime } from "@/utils/formatter";

export default function Clock(props: Props__ClockProps) {
  const { withSeconds = false, ...restProps } = props;

  const formatNow = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    return formatTime(timeStr, { showSeconds: withSeconds });
  };

  const [time, setTime] = useState(formatNow);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatNow());
    }, 1000);

    return () => clearInterval(interval);
  }, [withSeconds]);

  return <P {...restProps}>{time}</P>;
}
