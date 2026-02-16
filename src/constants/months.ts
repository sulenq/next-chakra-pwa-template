import { getL } from "@/utils/string";
const l = getL();

export const L_MONTHS = [
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

export const MONTHS: Record<string, string[]> = {
  id: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};
