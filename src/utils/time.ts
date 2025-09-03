import { Type__TimezoneObject } from "@/constants/types";
import { getStorage } from "@/utils/client";
import moment from "moment-timezone";

export const getTimezoneOffsetMs = (timeZoneKey: string): number => {
  return moment.tz(timeZoneKey).utcOffset() * 60 * 1000;
};

export const getLocalTimezone = (): Type__TimezoneObject => {
  const timeZone = moment.tz.guess();
  const autoTimeZoneLabel = `Auto (${timeZone})`;
  const offsetMinutes = moment.tz(timeZone).utcOffset();
  const offsetHours = offsetMinutes / 60;
  const formattedOffset = `UTC${offsetHours >= 0 ? "+" : ""}${String(
    offsetHours
  ).padStart(2, "0")}:00`;
  const abbreviation = moment.tz(timeZone).format("z");

  return {
    key: timeZone,
    label: autoTimeZoneLabel,
    offset: offsetHours,
    offsetMs: offsetMinutes * 60 * 1000,
    formattedOffset,
    localAbbr: abbreviation,
  };
};

export const getUserTimezone = (): Type__TimezoneObject => {
  const localTZ = getLocalTimezone();
  const storedTimeZone = getStorage("timeZone");

  if (!storedTimeZone) return localTZ;

  try {
    const parsedTimeZone = JSON.parse(storedTimeZone) as Type__TimezoneObject;
    if (parsedTimeZone.label.startsWith("Auto")) return localTZ;

    return parsedTimeZone;
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
  timeTo: string
): number => {
  const timeStart: Date = new Date(timeFrom);

  const timeEnd: Date = new Date(timeTo);

  const timeRange: number = timeEnd.getTime() - timeStart.getTime();

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

export const makeDateTime = (isoDate: string, time: string): Date => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const dateTime = new Date(isoDate);

  dateTime.setHours(hours, minutes, seconds, 0);

  return dateTime;
};

export const parseTimeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export const resetTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const timezones = () => {
  return moment.tz.names().map((tz) => {
    const offsetMinutes = moment.tz(tz).utcOffset();
    const abbreviation = moment.tz(tz).format("z");

    return {
      key: tz,
      label: tz,
      offset: offsetMinutes,
      offsetMs: offsetMinutes * 60 * 1000,
      formattedOffset: `UTC${moment.tz(tz).format("Z")}`,
      localAbbr: abbreviation,
    };
  });
};
