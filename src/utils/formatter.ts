import { MONTHS } from "@/constants/months";
import {
  Type__DateFormat,
  Type__DateVariant,
  Type__TimeFormat,
} from "@/constants/types";
import { WEEKDAYS_0_BASED } from "@/constants/weekdays";
import moment from "moment-timezone";
import { getStorage } from "@/utils/client";
import { dateObject } from "./date";
import { getLocalTimezone, getTimezoneOffsetMs, getUserTimezone } from "./time";

export const formatDate = (
  date?: Date | string | undefined,
  options: {
    variant?: Type__DateVariant;
    withTime?: boolean;
    prefixDateFormat?: Type__DateFormat;
    prefixTimezoneKey?: string;
  } = {}
) => {
  if (!date) return "";

  let resolvedDate;
  const localTimezoneOffsetMs = getTimezoneOffsetMs(getLocalTimezone().key);
  if (!dateObject(date)) {
    resolvedDate = new Date(new Date(date).getTime() - localTimezoneOffsetMs);
  } else {
    resolvedDate = date;
  }

  const lang = getStorage("lang") || "id";
  const dateFormat =
    options.prefixDateFormat || getStorage("dateFormat") || "dmy";
  const timezoneKey = options.prefixTimezoneKey || getUserTimezone().key;
  const localDate = moment.tz(resolvedDate, timezoneKey);
  const day = localDate.date();
  const month = localDate.month();
  const year = localDate.year();
  const weekday = localDate.day();

  const monthName = MONTHS[lang][month];
  const shortMonthName = monthName.substring(0, 3);
  const weekdayName = WEEKDAYS_0_BASED[lang][weekday];
  const shortWeekdayName = weekdayName.substring(0, 3);

  const basicVariant = options.variant === "basic";

  const formatDateString = (
    day: number,
    year: number,
    monthName: string | number
  ) => {
    switch (dateFormat.toLowerCase()) {
      case "dmy":
        return `${day}${basicVariant ? "-" : " "}${monthName}${
          basicVariant ? "-" : " "
        }${year}`;
      case "mdy":
        return `${monthName}${basicVariant ? "-" : " "}${day}${
          basicVariant ? "-" : ", "
        }${year}`;
      case "ymd":
        return `${year}${basicVariant ? "-" : " "}${monthName}${
          basicVariant ? "-" : " "
        }${day}`;
      default:
        return `${day} ${monthName} ${year}`;
    }
  };

  switch (options.variant) {
    case "basic":
      return formatDateString(day, year, month);
    case "shortMonth":
      return formatDateString(day, year, shortMonthName);
    case "fullMonth":
      return formatDateString(day, year, monthName);
    case "monthYear":
    case "period":
      return `${monthName} ${year}`;
    case "shortMonthDay":
      return `${day} ${shortMonthName}`;
    case "fullMonthDay":
      return `${day} ${monthName}`;
    case "weekdayBasic":
      return `${shortWeekdayName}, ${formatDateString(day, year, monthName)}`;
    case "weekdayShortMonth":
      return `${shortWeekdayName}, ${formatDateString(
        day,
        year,
        shortMonthName
      )}`;
    case "weekdayFullMonth":
      return `${weekdayName}, ${formatDateString(day, year, monthName)}`;
    default:
      return formatDateString(day, year, monthName);
  }
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
  time?: string,
  options: {
    showSeconds?: boolean;
    prefixTimeFormat?: Type__TimeFormat;
    prefixTimezoneKey?: string;
    withSuffix?: boolean;
  } = {}
): string {
  if (!time) return "";

  const timeFormat =
    options.prefixTimeFormat || getStorage("timeFormat") || "24-hour";

  const timezoneKey = options.prefixTimezoneKey || getUserTimezone().key;
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
