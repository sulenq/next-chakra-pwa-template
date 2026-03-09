import { NUMBER_LOCALE } from "@/constants/styles";
import { useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  duration: number;
  autoStart?: boolean;
  precision?: number;
  locale?: string;
}

export function useCountdown(options: UseCountdownOptions) {
  const {
    duration,
    autoStart = false,
    precision = 2,
    locale = NUMBER_LOCALE,
  } = options;

  const [countdown, setCountdown] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
      const remaining = Math.max(duration - elapsed, 0);

      setCountdown(Number(remaining.toFixed(precision)));

      if (remaining <= 0) {
        clear();
        setIsRunning(false);
      }
    }, 100);

    return clear;
  }, [isRunning, duration, precision]);

  const start = () => setIsRunning(true);

  const stop = () => {
    clear();
    setIsRunning(false);
  };

  const reset = () => {
    clear();
    setCountdown(duration);
    setIsRunning(false);
  };

  const isFinished = countdown === 0;

  const formattedCountdown = countdown.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  return {
    countdown,
    formattedCountdown,
    isRunning,
    isFinished,
    start,
    stop,
    reset,
  };
}
