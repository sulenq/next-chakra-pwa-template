import { ButtonProps, MenuItemProps } from "@chakra-ui/react";

export type Type__ContainerDimension = {
  width: number;
  height: number;
};

export type Type__SortHandler = (
  aValue: any,
  bValue: any,
  direction: "asc" | "desc"
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
  | "basic"
  | "shortMonth"
  | "fullMonth"
  | "monthYear"
  | "period"
  | "shortMonthDay"
  | "fullMonthDay"
  | "weekdayBasic"
  | "weekdayShortMonth"
  | "weekdayFullMonth";
