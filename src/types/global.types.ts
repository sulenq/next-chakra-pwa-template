import { ActivityActionEnum } from "@/constants/enums";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode } from "react";

import { translations } from "@/contexts/use-locale-context";
import { ConditionalValue, StackProps } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

export type ColorMode = "light" | "dark" | "system";

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type Gender = "MALE" | "FEMALE";

export type LocaleOption = "id" | "en"; // currently "en" | "id"
export type LocaleKey = keyof typeof translations;
export type Translations = (typeof translations)[LocaleKey];

export type UnitKey =
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

export type ChartData = Record<string, number | string>;

export type InputSize = ConditionalValue<
  "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs" | undefined
>;

export type InputVariant = ConditionalValue<
  "outline" | "subtle" | "flushed" | undefined
>;

export type ButtonSize = ConditionalValue<
  "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs" | undefined
>;

export type ButtonVariant = ConditionalValue<
  | "outline"
  | "solid"
  | "subtle"
  | "surface"
  | "ghost"
  | "plain"
  | "frosted"
  | undefined
>;

export type SortHandler = (
  aValue: any,
  bValue: any,
  direction: "asc" | "desc",
) => number;

export type Period = {
  month: number | null; // 0 = Jan
  year: number | null;
};

export type LatLon = {
  lat: number;
  lon: number;
};

export type TimezoneValue = {
  key: string;
  label: string;
  offset: number;
  offsetMs: number;
  formattedOffset: string;
  localAbbr: string;
};

export type TimeFormat = "24-hour" | "12-hour";

export type DateFormat = "dmy" | "mdy" | "ymd";

export type DisclosureSizes = "xs" | "sm" | "md" | "lg" | "xl";

export type DateVariant =
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

// Response
export interface BaseResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalPage: number;
  totalItems: number; // total records
}

// Request
export interface BaseDataListParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Locales
export interface LangObject {
  [key: string]: string;
}

// Auth
export interface ActivityLog extends CUD {
  id: string;
  userId: string;
  action: ActivityActionEnum | string;
  metadata?: Record<string, any>;
  user?: User;
}

export interface AuthLog extends CUD {
  id: string;
  ip: string;
  city: string;
  countryCode: string;
  userAgent: string;
  action: string; // "Sign in" | "Sign out" ;
}

export interface User extends CUD {
  id: string;
  avatar: StorageFile[];
  name: string;
  email: string;
  role: Role;
  accountStatus: string;
  // optional
  username?: string | null;
  gender: Gender | null;
  phoneNumber: string | null;
  birthDate: string | null;
  address: string | null;
  // audit timestamps
  lastLoginAt: string | null;
  lastChangePasswordAt: string | null;
  deactiveAt: string | null;

  // additional
  taskCount?: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Navs
export interface NavGroup {
  labelKey?: string;
  label?: string;
  navs: Nav[];
}

export interface Nav {
  icon?: LucideIcon;
  labelKey?: string;
  label?: string;
  path: string;
  backPath?: string;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  children?: NavGroup[];
  childrenInvisible?: boolean;
}

// Pdf Viewer
export interface PdfViewerUtils {
  setPageWidth: (width: number) => void;
  setPage: (p: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  handleDownload: () => void;
  toggleMode: () => void;
}

// Data List
export interface Pagination {
  currentPage: number;
  limit: number;
  totalData: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Data Table
export interface DataListConfig {
  headers?: FormattedTableHeader[];
  rows?: FormattedTableRow[];
  rowOptions?: RowOptionsTableOptionGenerator[];
  batchOptions?: BatchOptionsTableOptionGenerator[];
}

export interface FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: StackProps;
  wrapperProps?: StackProps;
  align?: string;
}

export interface FormattedTableRow<T = any> {
  id: string;
  index: number;
  item: T;
  dim?: boolean;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    bodyProps?: StackProps;
    wrapperProps?: StackProps;
    align?: string;
    dim?: boolean;
  }[];
}

export type RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: FormattedTableRow<T>,
  overloads?: any,
) => ReactNode | null | false;

export type BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any,
) => ReactNode | null | false;

// HTTP
export interface RequestState<T = any> {
  loading: boolean;
  status: number | null;
  error: any;
  response: AxiosResponse<T> | null;
}

export interface Req<T = any> {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<T>) => void;
    onError?: (e: any) => void;
  };
}

// CUD
export interface CUD {
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

// Storage
export interface StorageFile extends CUD {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileMimeType: string;
  fileSize: string;
}

// Select Input
export interface SelectOption {
  id: any;
  label: any;
  label2?: any;
  data?: any;
  disabled?: boolean;
}
