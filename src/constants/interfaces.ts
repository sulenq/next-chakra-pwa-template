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
import { Dispatch } from "react";

// Data Table
export interface Interface__FormattedTableHeader {
  th: string;
  columnKey?: string; // unused yet
  sortable?: boolean;
  tableColumnHeaderProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
}
export interface Interface__FormattedTableBody {
  id: number;
  columnsFormat: {
    td: any;
    value: any;
    columnKey?: string; // unused yet
    dataType?: string; // "string" | "number" | "date" | "time" |
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
  }[];
}
export interface Interface__TableOption {
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
  menuItemProps?: MenuItemProps;
  ovveride?: any;
}
export interface Interface__TableData {
  ths?: Interface__FormattedTableHeader[];
  tds?: Interface__FormattedTableBody[];
  rowOptions?: Interface__TableOption[];
  batchOptions?: Interface__TableOption[];
  initialSortOrder?: "asc" | "desc";
  page?: number;
  setPage?: Dispatch<number>;
  limit?: number;
  setLimit?: Dispatch<number>;
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
  updated_at?: string;
  deleted_at?: string;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  file_mime_type: string;
  file_size: number;
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
