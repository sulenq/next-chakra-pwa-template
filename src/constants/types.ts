import { translations } from "@/context/useLang";
import { ButtonProps, ConditionalValue, MenuItemProps } from "@chakra-ui/react";

export type Type__LangKey = keyof typeof translations; // "en" | "id"
export type Type__Locales = (typeof translations)[Type__LangKey];

export type Type__UnitKey =
  | "mass"
  | "length"
  | "distance"
  | "height"
  | "area"
  | "volume"
  | "temperature"
  | "speed"
  | "energy"
  | "power"
  | "pressure"
  | "data"
  | "dataRate"
  | "angle";

export type Type__ChartData = Record<string, number | string>;

export type Type__ButtonSize = ConditionalValue<
  "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs" | undefined
>;

export type Type__BasicVariant = ConditionalValue<
  "outline" | "solid" | "subtle" | "surface" | "ghost" | "plain" | undefined
>;

export type Type__ExtendedPermissionState =
  | "prompt"
  | "denied"
  | "granted-once"
  | "granted-forever";

export type Type__ContainerDimension = {
  width: number;
  height: number;
};

export type Type__SortHandler = (
  aValue: any,
  bValue: any,
  direction: "asc" | "desc",
) => number;

export type Type__Period = {
  month: number | null; // 0 = Jan
  year: number | null;
};

export type Type__LanguageOptions = "id" | "en";

export type Type__LatLong = {
  lat: number;
  lon: number;
};

export type Type__TimezoneObject = {
  key: string;
  label: string;
  offset: number;
  offsetMs: number;
  formattedOffset: string;
  localAbbr: string;
};

export type Type__TimeFormat = "24-hour" | "12-hour";

export type Type__DateFormat = "dmy" | "mdy" | "ymd";

export type Type__DisclosureSizes = "xs" | "sm" | "md" | "lg" | "xl";

export type Type__DateRange = {
  from: Date | string | undefined;
  to: Date | string | undefined;
};

export type Type__DateRangePresets =
  | "thisWeek"
  | "nextWeek"
  | "thisMonth"
  | "nextMonth";

export type Type__TimeRange = {
  from: string | undefined;
  to: string | undefined;
};

export type Type__TableOptions = (
  | {
      label: string;
      icon?: any;
      callback?: (dataParams: any) => void;
      independent?: boolean;
      component?: any;
      confirmation?: (dataParams: any) => {
        id: string;
        title: string;
        description: string;
        confirmLabel: string;
        confirmCallback: () => void;
        confirmButtonProps?: ButtonProps;
      };
      subMenu?: any; // unused yet
      menuItemProps?: MenuItemProps;
      disabled?: (rowData: any) => boolean | boolean;
    }
  | "divider"
)[];

export type Type__DateVariant =
  | "numeric" // 15-1-2025
  | "day" // 15
  | "month" // January
  | "shortMonth" // Jan
  | "year" // 2025
  | "shortYear" // 2025
  | "dayMonthYear" // 15 January 2025
  | "dayShortMonthYear" // 15 Jan 2025
  | "monthYear" // January 2025
  | "shortMonthYear" // Jan 2025
  | "dayMonth" // 15 January
  | "dayShortMonth" // 15 Jan
  | "weekday" // Wednesday
  | "shortWeekday" // Wed
  | "weekdayDayMonthYear" // Wednesday, 15 January 2025
  | "weekdayDayShortMonthYear" // Wednesday, 15 Jan 2025
  | "shortWeekdayDayMonthYear" // Wed, 15 January 2025
  | "shortWeekdayDayShortMonthYear"; // Wed, 15 Jan 2025
