import { Type__Locales } from "@/constants/types";
import { getL } from "@/utils/string";
const l = getL();

export const getWeekdayNames = (l: Type__Locales) => {
  return [
    l.january,
    l.february,
    l.march,
    l.april,
    l.may,
    l.june,
    l.july,
    l.august,
    l.september,
    l.october,
    l.november,
    l.december,
  ];
};

export const L_WEEKDAYS_0_BASED = [
  l.sunday,
  l.monday,
  l.tuesday,
  l.wednesday,
  l.thursday,
  l.friday,
  l.saturday,
];

export const WEEKDAYS: Record<string, string[]> = {
  id: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
  en: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
};

export const WEEKDAYS_0_BASED: Record<string, string[]> = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};
