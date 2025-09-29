import { BtnProps } from "@/components/ui/btn";
import {
  BoxProps,
  ButtonProps,
  MenuItemProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
} from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  Type__DateRange,
  Type__DateRangePresets,
  Type__DisclosureSizes,
  Type__TimeRange,
} from "./types";
import { ReactNode } from "react";

// Navs
export interface Interface__NavListItem {
  icon?: any;
  labelKey: string;
  path: string;
  backPath?: string;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  subMenus?: Interface__NavItem[];
}
export interface Interface__NavItem {
  groupLabelKey?: string;
  list: Interface__NavListItem[];
}

// Data Table
export interface Interface__FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
}
export interface Interface__FormattedTableData {
  id: number;
  idx: number;
  data: any;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
  }[];
}
export interface Interface__TableOption {
  disabled?: boolean;
  label?: string;
  icon?: any;
  onClick?: (data: any) => void;
  confirmation?: (dataParams: any) => {
    id: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfrim: () => void;
    confirmButtonProps?: BtnProps;
  };
  menuItemProps?: Partial<MenuItemProps>;
  override?: (data: any) => ReactNode;
}

// HTTP
export interface Interface__RequestState<T = any> {
  loading: boolean;
  status: number | null;
  error: any;
  response: AxiosResponse<T> | null;
}
export interface Interface__Req<T = any> {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<T>) => void;
    onError?: (e: any) => void;
  };
}

// CUD
export interface Interface__CUD {
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: number;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileMimeType: string;
  fileSize: string;
}

// Select Input
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}

// Date Range Picker Input
export interface Interface__DateRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__DateRange) => void;
  inputValue?: Type__DateRange;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  preset?: Type__DateRangePresets[];
  maxRange?: number;
}

// Time Range Picker Input
export interface Interface__TimeRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__TimeRange | undefined) => void;
  inputValue?: Type__TimeRange | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

// Divider
export interface Interface__Divider extends BoxProps {
  dir?: "vertical" | "horizontal";
}
