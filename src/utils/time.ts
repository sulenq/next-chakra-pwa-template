import { Type__TimezoneObject } from "@/constants/types";
import { getStorage } from "@/utils/client";
import {
  parseISO,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  addSeconds,
} from "date-fns";
import { getTimezoneOffset, formatInTimeZone } from "date-fns-tz";

export const getTimezoneOffsetMs = (timezoneKey: string): number => {
  return getTimezoneOffset(timezoneKey);
};

export const getLocalTimezone = (): Type__TimezoneObject => {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const TZ_ALIAS: Record<string, string> = {
    "Asia/Bangkok": "Asia/Jakarta",
    "Asia/Ho_Chi_Minh": "Asia/Jakarta",
    "Asia/Phnom_Penh": "Asia/Jakarta",
    "Asia/Vientiane": "Asia/Jakarta",
  };

  const timezone = TZ_ALIAS[detected] ?? detected;
  const autoTimezoneLabel = `Auto (${timezone})`;

  const offsetMs = getTimezoneOffset(timezone);
  const offsetMinutes = offsetMs / (60 * 1000);
  const offsetHours = offsetMinutes / 60;

  const offsetSign = offsetHours >= 0 ? "+" : "";
  const formattedOffset = `UTC${offsetSign}${String(
    Math.abs(offsetHours),
  ).padStart(2, "0")}:00`;

  const abbreviation = formatInTimeZone(new Date(), timezone, "z");

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

  const now = new Date(new Date().getTime() - localOffset + userOffset);

  return now;
};

export const getDurationByClock = (
  timeFrom: string,
  timeTo: string,
): number => {
  const timeStart: Date = new Date(timeFrom);
  const timeEnd: Date = new Date(timeTo);
  const timeRange: number = timeEnd.getTime() - timeStart.getTime();

  return timeRange / 1000;
};

export const getDurationInSeconds = (
  timeFrom: string,
  timeTo: string,
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
  formatString: "HH:mm:ss" | "HH:mm" | "hh:mm A" = "HH:mm:ss",
): string => {
  if (!input) return "";

  const date =
    typeof input === "string" || typeof input === "number"
      ? new Date(input)
      : input;

  if (isNaN(date.getTime())) return "";

  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");

  switch (formatString) {
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

export const makeDateTime = (isoDate: string, time: string): Date => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  let dateTime = new Date(isoDate);

  dateTime = setHours(dateTime, hours);
  dateTime = setMinutes(dateTime, minutes);
  dateTime = setSeconds(dateTime, seconds);

  return dateTime;
};

export const makeISODateTime = (isoDate: string, time: string): string => {
  const datePart = isoDate.split("T")[0];
  return `${datePart}T${time}Z`;
};

export const makeUTCISODateTime = (
  isoDate: string,
  time: string,
  options?: { timezoneKey?: string },
): string => {
  if (!isoDate || !time) return "";

  const datePart = isoDate.split("T")[0];
  const timezoneKey = options?.timezoneKey || getUserTimezone().key;
  const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;

  const dateTimeString = `${datePart} ${normalizedTime}`;

  const dateInZone = parse(dateTimeString, "yyyy-MM-dd HH:mm:ss", new Date());

  const offsetMs = getTimezoneOffset(timezoneKey);

  const utcDate = new Date(dateInZone.getTime() - offsetMs);

  return utcDate.toISOString();
};

export const dateNow = () => {
  const now = new Date();
  const iso = now.toISOString();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  // based on user timezone preference
  return makeUTCISODateTime(iso, time);
};

export const extractTime = (
  input?: string | Date | null,
  options: { withSeconds?: boolean } = {},
): string => {
  if (!input) return "";

  const isoStr = typeof input === "string" ? input : input.toISOString();

  const regex = options.withSeconds ? /T(\d{2}:\d{2}:\d{2})/ : /T(\d{2}:\d{2})/;
  const match = isoStr.match(regex);

  return match ? match[1] : "";
};

export const parseTimeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export const resetTime = (date: Date): Date => {
  return startOfDay(date);
};

export const timezones = () => {
  const timezonesArray = Intl.supportedValuesOf("timeZone");

  return timezonesArray.map((tz) => {
    const offsetMs = getTimezoneOffset(tz);
    const offsetMinutes = offsetMs / (60 * 1000);
    const offsetHours = offsetMinutes / 60;

    let abbreviation = "";
    try {
      abbreviation = formatInTimeZone(new Date(), tz, "z");
    } catch {
      abbreviation = tz;
    }

    return {
      key: tz,
      label: tz,
      offset: offsetHours,
      offsetMs: offsetMs,
      formattedOffset: `UTC${offsetHours >= 0 ? "+" : ""}${formatInTimeZone(
        new Date(),
        tz,
        "HH:mm",
      )}`,
      localAbbr: abbreviation,
    };
  });
};

export const addSecondsToTime = (
  time: string | null,
  secondsToAdd: number,
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
  seconds: number,
): string => {
  const date = parseISO(isoDate);

  const result = addSeconds(date, seconds);

  return result.toISOString();
};
