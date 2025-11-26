import { Type__TimezoneObject } from "@/constants/types";
import { getStorage } from "@/utils/client";

import * as DnsTz from "date-fns-tz";

// ----------------------------------------------------------------------
// TIMEZONE UTILITIES
// ----------------------------------------------------------------------

export const getTimezoneOffsetMs = (timezoneKey: string): number => {
  // Returns timezone offset in milliseconds
  return DnsTz.getTimezoneOffset(timezoneKey) * 60 * 1000;
};

export const getLocalTimezone = (): Type__TimezoneObject => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const autoTimezoneLabel = `Auto (${timezone})`;

  const offsetMs = DnsTz.getTimezoneOffset(timezone) * 60 * 1000;
  const offsetHours = offsetMs / 3600000;

  // Format offset (e.g., +07:00)
  const formattedOffset = `UTC${DnsTz.format(new Date(), "xxx", {
    timeZone: timezone,
  })}`;

  // Get timezone abbreviation (e.g., WIB)
  const abbreviation = DnsTz.format(new Date(), "z", { timeZone: timezone });

  return {
    key: timezone,
    label: autoTimezoneLabel,
    offset: offsetHours,
    offsetMs: offsetMs,
    formattedOffset,
    localAbbr: abbreviation,
  };
};

export const getUserTimezone = (): Type__TimezoneObject => {
  const localTZ = getLocalTimezone();
  const storedTimezone = getStorage("timezone");

  if (!storedTimezone) return localTZ;

  try {
    const parsedTimezone = JSON.parse(storedTimezone) as Type__TimezoneObject;
    if (parsedTimezone.label.startsWith("Auto")) return localTZ;

    return parsedTimezone;
  } catch {
    return localTZ;
  }
};

export const getUserNow = () => {
  const userTz = getUserTimezone();
  const localTz = getLocalTimezone();
  const userOffset = getTimezoneOffsetMs(userTz.key);
  const localOffset = getTimezoneOffsetMs(localTz.key);
  // Calculates 'now' adjusted for the user's selected timezone offset
  const now = new Date(new Date().getTime() - localOffset + userOffset);

  return now;
};

export const timezones = () => {
  // Use native JS Intl API for the list of time zones
  const allTimezones: string[] = Intl.supportedValuesOf("timeZone");

  return allTimezones.map((tz: string) => {
    // Note: DnsTz is still needed for offset calculations and formatting
    const offsetMinutes = DnsTz.getTimezoneOffset(tz);

    return {
      key: tz,
      label: tz,
      offset: offsetMinutes / 60,
      offsetMs: offsetMinutes * 60 * 1000,
      formattedOffset: `UTC${DnsTz.format(new Date(), "xxx", {
        timeZone: tz,
      })}`,
      localAbbr: DnsTz.format(new Date(), "z", { timeZone: tz }),
    };
  });
};

// ----------------------------------------------------------------------
// ISO / TIME / DURATION UTILITIES
// ----------------------------------------------------------------------

export const getDurationByClock = (
  timeFrom: string,
  timeTo: string
): number => {
  const timeStart: Date = new Date(timeFrom);
  const timeEnd: Date = new Date(timeTo);
  const timeRange: number = timeEnd.getTime() - timeStart.getTime();

  // Returns duration in seconds
  return timeRange / 1000;
};

export const getDurationInSeconds = (
  timeFrom: string,
  timeTo: string
): number => {
  const secondsFrom = parseTimeToSeconds(timeFrom);
  const secondsTo = parseTimeToSeconds(timeTo);

  const durationInSeconds =
    secondsTo >= secondsFrom
      ? secondsTo - secondsFrom
      : 24 * 3600 - secondsFrom + secondsTo;

  return durationInSeconds;
};

export const getHoursFromTime = (time: string | undefined | null): number => {
  if (!time) return 0;
  const [hours] = time.split(":");
  return parseInt(hours, 10) || 0;
};

export const getMinutesFromTime = (time: string | undefined | null): number => {
  if (!time) return 0;
  const [, minutes] = time.split(":");
  return parseInt(minutes, 10) || 0;
};

export const getSecondsFromTime = (time: string | undefined | null): number => {
  if (!time) return 0;
  const [, , seconds] = time.split(":");
  return parseInt(seconds, 10) || 0;
};

export const makeTime = (
  input: Date | string | number | undefined,
  format: "HH:mm:ss" | "HH:mm" | "hh:mm A" = "HH:mm:ss"
): string => {
  if (!input) return "";

  const date =
    typeof input === "string" || typeof input === "number"
      ? new Date(input)
      : input;

  if (isNaN(date.getTime())) return ""; // Handle invalid date

  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");

  switch (format) {
    case "HH:mm":
      return `${hh}:${mm}`;
    case "hh:mm A": {
      const hour12 = (parseInt(hh) % 12 || 12).toString().padStart(2, "0");
      const suffix = parseInt(hh) >= 12 ? "PM" : "AM";
      return `${hour12}:${mm} ${suffix}`;
    }
    default:
      return `${hh}:${mm}:${ss}`;
  }
};

export const makeLocalDateTime = (isoDate: string, time: string): Date => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const dateTime = new Date(isoDate);

  // Sets time components without affecting date components
  dateTime.setHours(hours, minutes, seconds, 0);

  return dateTime;
};

export const makeISODateTime = (isoDate: string, time: string): string => {
  const datePart = isoDate.split("T")[0];
  return `${datePart}T${time}Z`;
};

export const makeUTCISODateTime = (
  isoDate: string,
  time: string,
  options?: { timezoneKey?: string }
): string => {
  if (!isoDate || !time) return "";

  const datePart = isoDate.split("T")[0];
  const timezoneKey = options?.timezoneKey || getUserTimezone().key;
  const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;

  const combinedDateTime = `${datePart}T${normalizedTime}`;

  // Use formatTz to interpret the datetime string in the specified timezone,
  // then immediately format it as UTC ISO string.
  return DnsTz.format(combinedDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {
    timeZone: timezoneKey,
  });
};

export const extractTime = (
  input?: string | Date | null,
  options: { withSeconds?: boolean } = {}
): string => {
  if (!input) return "";

  // Converts input to ISO string for parsing
  const isoStr = typeof input === "string" ? input : input.toISOString();

  // Regex capture HH:mm or HH:mm:ss from ISO string
  const regex = options.withSeconds ? /T(\d{2}:\d{2}:\d{2})/ : /T(\d{2}:\d{2})/;
  const match = isoStr.match(regex);

  return match ? match[1] : "";
};

export const parseTimeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export const resetTime = (date: Date): Date => {
  // Creates a new Date object at the start of the day (00:00:00)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const addSecondsToTime = (
  time: string | null,
  secondsToAdd: number
): string => {
  if (!time) return "";

  const [h, m, s] = time.split(":").map(Number);
  const base = new Date();
  base.setHours(h, m, s, 0);
  const result = new Date(base.getTime() + secondsToAdd * 1000);

  const hh = String(result.getHours()).padStart(2, "0");
  const mm = String(result.getMinutes()).padStart(2, "0");
  const ss = String(result.getSeconds()).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

export const getRemainingSecondsUntil = (targetTime: string): number => {
  const [h, m, s] = targetTime.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, s, 0);

  const diffMs = target.getTime() - now.getTime();

  return Math.floor(diffMs / 1000);
};

export const addSecondsToISODate = (
  isoDate: string,
  seconds: number
): string => {
  const date = new Date(isoDate);
  date.setSeconds(date.getSeconds() + seconds);
  return date.toISOString();
};
