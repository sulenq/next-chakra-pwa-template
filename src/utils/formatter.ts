import { L_MONTHS } from "@/constants/months";
import {
  Type__DateFormat,
  Type__DateVariant,
  Type__TimeFormat,
} from "@/constants/types";
import { L_WEEKDAYS_0_BASED } from "@/constants/weekdays";
import { getStorage } from "@/utils/client";
import moment from "moment-timezone";
import { isDateObject } from "./date";
import { getTimezoneOffsetMs, getUserTimezone } from "./time";

export const formatDate = (
  date?: Date | string | undefined,
  options: {
    variant?: Type__DateVariant;
    withTime?: boolean;
    timeFormat?: string; // default HH:mm
    dateFormat?: Type__DateFormat;
    timezoneKey?: string;
  } = {}
): string => {
  if (!date) return "";

  // display format / timezone choices
  const dateFormat = options.dateFormat || getStorage("dateFormat") || "dmy";
  const timezoneKey = options.timezoneKey || getUserTimezone().key;

  // Build a moment object *interpreted* according to the input kind and target timezone.
  // We avoid manual offset math; let moment-timezone handle conversions.
  let localDate: moment.Moment;

  if (isDateObject(date)) {
    // If it's a Date object => it's an absolute instant, convert to target tz for display.
    localDate = moment(date as Date).tz(timezoneKey);
  } else if (typeof date === "string") {
    const s = date as string;
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    const isoWithOffsetRegex = /Z|[+-]\d{2}:\d{2}$/i; // ends with Z or +hh:mm / -hh:mm
    const isoWithoutOffsetRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/; // YYYY-MM-DDTHH:mm(:ss(.sss)?)

    if (dateOnlyRegex.test(s)) {
      // Treat pure date as date-only in the chosen timezone (no accidental day-shift).
      localDate = moment.tz(s, "YYYY-MM-DD", timezoneKey);
    } else if (isoWithOffsetRegex.test(s)) {
      // Has explicit timezone/offset -> parse preserving that offset, then convert to target tz.
      localDate = moment.parseZone(s).tz(timezoneKey);
    } else if (isoWithoutOffsetRegex.test(s)) {
      // Has time but no offset -> interpret this string as local time in the chosen timezone.
      localDate = moment.tz(s, timezoneKey);
    } else if (/^\d+$/.test(s)) {
      // numeric timestamp (ms)
      localDate = moment(Number(s)).tz(timezoneKey);
    } else {
      // fallback: let moment try to parse and convert to target tz
      localDate = moment(s).tz(timezoneKey);
    }
  } else {
    // fallback safety
    localDate = moment(date as any).tz(timezoneKey);
  }

  const day = localDate.date();
  const month = localDate.month(); // 0-based
  const year = localDate.year();
  const weekday = localDate.day();

  const monthName = L_MONTHS[month];
  const shortMonthName = monthName.substring(0, 3);
  const weekdayName = L_WEEKDAYS_0_BASED[weekday];
  const shortWeekdayName = weekdayName.substring(0, 3);

  const basicVariant = options.variant === "basic";

  const formatDateString = (
    dayVal: number,
    yearVal: number,
    monthOrName: string | number
  ) => {
    // If monthOrName is a number, it's 0-based -> convert to 1-based display
    const monthDisplay =
      typeof monthOrName === "number"
        ? String(monthOrName + 1)
        : String(monthOrName);

    switch (dateFormat.toLowerCase()) {
      case "dmy":
        return `${dayVal}${basicVariant ? "-" : " "}${monthDisplay}${
          basicVariant ? "-" : " "
        }${yearVal}`;
      case "mdy":
        return `${monthDisplay}${basicVariant ? "-" : " "}${dayVal}${
          basicVariant ? "-" : ", "
        }${yearVal}`;
      case "ymd":
        return `${yearVal}${basicVariant ? "-" : " "}${monthDisplay}${
          basicVariant ? "-" : " "
        }${dayVal}`;
      default:
        return `${dayVal} ${monthDisplay} ${yearVal}`;
    }
  };

  let formattedDate: string;

  switch (options.variant) {
    case "basic":
      formattedDate = formatDateString(day, year, month);
      break;
    case "shortMonth":
      formattedDate = formatDateString(day, year, shortMonthName);
      break;
    case "fullMonth":
      formattedDate = formatDateString(day, year, monthName);
      break;
    case "monthYear":
    case "period":
      formattedDate = `${monthName} ${year}`;
      break;
    case "shortMonthDay":
      formattedDate = `${day} ${shortMonthName}`;
      break;
    case "fullMonthDay":
      formattedDate = `${day} ${monthName}`;
      break;
    case "weekdayBasic":
      formattedDate = `${shortWeekdayName}, ${formatDateString(
        day,
        year,
        monthName
      )}`;
      break;
    case "weekdayShortMonth":
      formattedDate = `${shortWeekdayName}, ${formatDateString(
        day,
        year,
        shortMonthName
      )}`;
      break;
    case "weekdayFullMonth":
      formattedDate = `${weekdayName}, ${formatDateString(
        day,
        year,
        monthName
      )}`;
      break;
    default:
      formattedDate = formatDateString(day, year, monthName);
      break;
  }

  if (options.withTime) {
    const timeFormat = options.timeFormat || "HH:mm";
    const timeStr = localDate.format(timeFormat);
    return `${formattedDate} ${timeStr}`;
  }

  return formattedDate;
};

export const formatAbsDate = (
  date?: Date | string,
  options: Parameters<typeof formatDate>[1] = {}
): string => {
  return formatDate(date, {
    timezoneKey: "UTC",
    ...options,
  });
};

export const formatNumber = (
  numParam: number | string | undefined | null
): string => {
  if (numParam === null || numParam === undefined) return "";

  let num: number;

  if (typeof numParam === "string") {
    num = parseFloat(numParam.replace(",", "."));
  } else {
    num = numParam;
  }

  // has desimal?
  const hasDecimal = num.toString().includes(".");

  // format number
  const formattedNum = hasDecimal
    ? num.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20,
      })
    : num.toLocaleString("id-ID");

  return formattedNum;
};

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "kB", "mB", "gB", "tB", "pB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.ceil(bytes / Math.pow(k, i)) + " " + sizes[i];
};

export const formatCount = (number: number): string => {
  const units = ["", "K", "Jt", "Ml", "Tr", "P", "E"];
  let index = 0;

  while (number >= 1000 && index < units.length - 1) {
    number /= 1000;
    index++;
  }

  return `${number}${units[index]}`;
};

export const formatDuration = (
  seconds: number | undefined,
  format: "long" | "short" | "digital" = "long"
): string => {
  if (!seconds) return "0 detik";

  switch (format) {
    case "long": {
      const jam = Math.floor(seconds / 3600);
      const menit = Math.floor((seconds % 3600) / 60);
      const detik = seconds % 60;

      let result = "";
      if (jam > 0) result += `${jam} jam`;
      if (menit > 0) result += ` ${menit} menit`;
      if (detik > 0) result += ` ${detik} detik`;

      return result.trim();
    }

    case "short": {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours =
        hours > 0 ? `${String(hours).padStart(2, "0")}j` : "";
      const formattedMinutes =
        minutes > 0 ? `${String(minutes).padStart(2, "0")}m` : "";
      const formattedSeconds =
        remainingSeconds > 0
          ? `${String(remainingSeconds).padStart(2, "0")}d`
          : "";

      return [formattedHours, formattedMinutes, formattedSeconds]
        .filter(Boolean)
        .join(" ");
    }

    case "digital": {
      const absSeconds = Math.ceil(seconds);
      const hours = Math.floor(Math.abs(absSeconds) / 3600);
      const minutes = Math.floor((Math.abs(absSeconds) % 3600) / 60);
      const remainingSeconds = Math.abs(absSeconds) % 60;

      const formattedTime = [hours, minutes, remainingSeconds]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");

      return absSeconds < 0 ? `-${formattedTime}` : formattedTime;
    }

    default:
      return "0 detik";
  }
};

export const formatDBTableName = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "_");
};

export function formatTime(
  time?: string | null,
  options: {
    showSeconds?: boolean;
    prefixTimeFormat?: Type__TimeFormat;
    timezoneKey?: string;
    withSuffix?: boolean;
  } = {}
): string {
  if (!time) return "";

  const timeFormat =
    options.prefixTimeFormat || getStorage("timeFormat") || "24-hour";

  const timezoneKey = options.timezoneKey || getUserTimezone().key;
  const offsetMs = getTimezoneOffsetMs(timezoneKey);
  const offsetHours = offsetMs / (1000 * 60 * 60);

  const [hhNum, mm, ss = 0] = time.split(":").map(Number);
  let hh = hhNum + offsetHours;

  if (hh >= 24) hh -= 24;
  if (hh < 0) hh += 24;

  let formattedTime: string;
  if (timeFormat === "12-hour") {
    const suffix = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 || 12;
    formattedTime = `${hour12}:${String(mm).padStart(2, "0")}`;

    if (options.showSeconds) {
      formattedTime += `:${String(ss).padStart(2, "0")}`;
    }

    const withSuffix = options.withSuffix ?? true;
    if (withSuffix) {
      formattedTime += ` ${suffix}`;
    }
  } else {
    formattedTime = `${String(hh).padStart(2, "0")}:${String(mm).padStart(
      2,
      "0"
    )}`;

    if (options.showSeconds) {
      formattedTime += `:${String(ss).padStart(2, "0")}`;
    }
  }

  return formattedTime;
}
