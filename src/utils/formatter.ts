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
  date?: Date | string | null | undefined,
  options: {
    variant?: Type__DateVariant;
    withTime?: boolean;
    timeFormat?: string; // default HH:mm
    dateFormat?: Type__DateFormat;
    timezoneKey?: string;
  } = {}
): string => {
  if (!date) return "";

  const dateFormat = options.dateFormat || getStorage("dateFormat") || "dmy";
  const timezoneKey = options.timezoneKey || getUserTimezone().key;

  let localDate: moment.Moment;

  if (isDateObject(date)) {
    localDate = moment(date as Date).tz(timezoneKey);
  } else if (typeof date === "string") {
    const s = date as string;
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isoWithOffsetRegex = /Z|[+-]\d{2}:\d{2}$/i;
    const isoWithoutOffsetRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

    if (dateOnlyRegex.test(s)) {
      localDate = moment.tz(s, "YYYY-MM-DD", timezoneKey);
    } else if (isoWithOffsetRegex.test(s)) {
      localDate = moment.parseZone(s).tz(timezoneKey);
    } else if (isoWithoutOffsetRegex.test(s)) {
      localDate = moment.tz(s, timezoneKey);
    } else if (/^\d+$/.test(s)) {
      localDate = moment(Number(s)).tz(timezoneKey);
    } else {
      localDate = moment(s).tz(timezoneKey);
    }
  } else {
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

  const numericVariant = options.variant === "numeric";

  const formatDateString = (
    yearVal: number,
    monthOrName: string | number,
    dayVal: number
  ) => {
    const monthDisplay =
      typeof monthOrName === "number"
        ? String(monthOrName + 1)
        : String(monthOrName);

    switch (dateFormat.toLowerCase()) {
      case "dmy":
        return `${dayVal}${numericVariant ? "/" : " "}${monthDisplay}${
          numericVariant ? "/" : " "
        }${yearVal}`;
      case "mdy":
        return `${monthDisplay}${numericVariant ? "/" : " "}${dayVal}${
          numericVariant ? "/" : ", "
        }${yearVal}`;
      case "ymd":
        return `${yearVal}${numericVariant ? "/" : " "}${monthDisplay}${
          numericVariant ? "/" : " "
        }${dayVal}`;
      default:
        return `${dayVal} ${monthDisplay} ${yearVal}`;
    }
  };

  let formattedDate: string;

  switch (options.variant) {
    case "numeric":
      formattedDate = formatDateString(year, month, day);
      break;
    case "day":
      formattedDate = `${day}`;
      break;
    case "month":
      formattedDate = monthName;
      break;
    case "shortMonth":
      formattedDate = shortMonthName;
      break;
    case "year":
      formattedDate = `${year}`;
      break;
    case "shortYear":
      formattedDate = `${year}`;
      break;
    case "dayMonthYear":
      formattedDate = formatDateString(year, monthName, day);
      break;
    case "dayShortMonthYear":
      formattedDate = formatDateString(year, shortMonthName, day);
      break;
    case "monthYear":
      formattedDate = `${monthName} ${year}`;
      break;
    case "shortMonthYear":
      formattedDate = `${shortMonthName} ${year}`;
      break;
    case "dayMonth":
      formattedDate = `${day} ${monthName}`;
      break;
    case "dayShortMonth":
      formattedDate = `${day} ${shortMonthName}`;
      break;
    case "weekdayDayMonthYear":
      formattedDate = `${weekdayName}, ${formatDateString(
        year,
        monthName,
        day
      )}`;
      break;
    case "weekdayDayShortMonthYear":
      formattedDate = `${weekdayName}, ${formatDateString(
        year,
        shortMonthName,
        day
      )}`;
      break;
    case "shortWeekdayDayMonthYear":
      formattedDate = `${shortWeekdayName}, ${formatDateString(
        year,
        monthName,
        day
      )}`;
      break;
    case "shortWeekdayDayShortMonthYear":
      formattedDate = `${shortWeekdayName}, ${formatDateString(
        year,
        shortMonthName,
        day
      )}`;
      break;
    default:
      formattedDate = formatDateString(year, monthName, day);
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

export const formatDBTableName = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "_");
};

export function formatTime(
  time?: string | null,
  options: {
    showSeconds?: boolean;
    timeFormat?: Type__TimeFormat;
    timezoneKey?: string;
    withSuffix?: boolean;
  } = {}
): string {
  if (!time) return "";

  const timeFormat =
    options.timeFormat || getStorage("timeFormat") || "24-hour";

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
