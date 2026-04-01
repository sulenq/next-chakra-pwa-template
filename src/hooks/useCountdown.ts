import { NUMBER_LOCALE } from "@/constants/styles";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

interface UseCountdownOptions {
  duration: number;
  autoStart?: boolean;
  precision?: number;
  locale?: string;
}

export function useCountdown(options: UseCountdownOptions) {
  // Options
  const {
    duration,
    autoStart = false,
    precision = 0,
    locale = NUMBER_LOCALE,
  } = options;

  // Refs
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // States
  const [countdown, setCountdown] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Constants
  const formattedCountdown = countdown.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  // Derived Values
  const isCountdownFinished = countdown === 0;

  // Utils
  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  function startCountdown() {
    setIsRunning(true);
  }
  function stopCountdown() {
    clear();
    setIsRunning(false);
  }
  function resetCountdown() {
    clear();
    setCountdown(duration);
    setIsRunning(false);
  }

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

  return {
    countdown,
    formattedCountdown,
    isRunning,
    isCountdownFinished,
    startCountdown,
    stopCountdown,
    resetCountdown,
  };
}
