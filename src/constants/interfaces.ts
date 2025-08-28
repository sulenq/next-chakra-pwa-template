import {
  BoxProps,
  ButtonProps,
  SimpleGridProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
  TableRowProps,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  Type__DateRange,
  Type__DateRangePresets,
  Type__DisclosureSizes,
  Type__TableOptions,
  Type__TimeRange,
} from "./types";
import { AxiosRequestConfig, AxiosResponse } from "axios";

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

// Gens
export interface Interface__Gens extends Interface__CUD {
  id: number;
  label: string;
}

// Select Input
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}
export interface Interface__Select extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Interface__SelectOption[] | undefined) => void;
  inputValue?: Interface__SelectOption[] | undefined;
  initialOptions?: Interface__SelectOption[] | undefined | null;
  placeholder?: string;
  invalid?: boolean;
  nonNullable?: boolean;
  multiple?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  fetch?: (
    setOptions: Dispatch<
      SetStateAction<Interface__SelectOption[] | null | undefined>
    >
  ) => void;
}

// Date Picker Input
export interface Interface__SelectedDateList {
  selectedDates: Date[];
  selectedRenderValue: string;
}
export interface Interface__DatePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: string[] | undefined) => void;
  inputValue?: string[] | undefined;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  multiple?: boolean;
}

// Date Range Picker Input
export interface Interface__DateRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__DateRange) => void;
  inputValue?: Type__DateRange;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  preset?: Type__DateRangePresets[];
  maxRange?: number;
}

// Time Picker Input
export interface Interface__TimePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: string | undefined) => void;
  inputValue?: string | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
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
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

// Table Component Input
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
    original_data?: any;
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
  }[];
}
export interface Interface__TableComponent extends StackProps {
  ths: Interface__FormattedTableHeader[];
  tds: Interface__FormattedTableBody[];
  originalData: any;
  rowClick?: (rowData: any) => void;
  columnsConfig?: number[];
  batchOptions?: any[];
  rowOptions?: any[];
  initialSortOrder?: "asc" | "desc";
  initialSortColumnIndex?: number;
  trBodyProps?: TableRowProps;
  footerContent?: any;
  initialLimit?: number;
  initialPage?: number;
  pagination?: any;
  pageControl?: number;
  setPageControl?: Dispatch<number>;
  limitOptions?: number[];
  limitControl?: number;
  setLimitControl?: Dispatch<number>;
  footerContainerProps?: SimpleGridProps;
}
export interface Interface__RowOptions {
  rowData: any;
  rowOptions: Type__TableOptions;
  tableRef: any;
}
export interface Interface__BatchOptions {
  selectedRows: number[];
  batchOptions: Type__TableOptions;
  selectAllRows: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableRef: any;
}
export interface Interface__TableFooterNote {
  footerContent?: any;
}
export interface Interface__LimitControl extends StackProps {
  initialLimit: number;
  limitControl?: number;
  setLimitControl?: Dispatch<number>;
  limitOptions?: number[];
}
export interface Interface__PageControl extends StackProps {
  initialPage?: number;
  pagination?: any;
  pageControl?: number;
  setPageControl?: Dispatch<number>;
}

// Divider
export interface Interface__Divider extends BoxProps {
  dir?: "vertical" | "horizontal";
}
