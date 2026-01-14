import { BtnProps } from "@/components/ui/btn";
import { Enum__ActivityAction } from "@/constants/enums";
import {
  MenuItemProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
} from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode } from "react";

// Auth
export interface Interface__ActivityLog extends Interface__CUD {
  id: string;
  userId: string;
  action: Enum__ActivityAction | string;
  metadata?: Record<string, any>;
  user?: Interface__User;
}
export interface Interface__AuthLog extends Interface__CUD {
  id: string;
  ip: string;
  city: string;
  countryCode: string;
  userAgent: string;
  action: string; // "Sign in" | "Sign out" ;
}
export interface Interface__User extends Interface__CUD {
  id: string;
  avatar: Interface__StorageFile[];
  name: string;
  email: string;
  role: Interface__Role;
  accountStatus: string;
  // optional
  gender: boolean | null; // 1 male, 0 female
  phoneNumber: string | null;
  birthDate: string | null;
  address: string | null;
  // audit timestamps
  registeredAt: string;
  lastLogin: string | null;
  lastChangePasswordAt: string | null;
  deactiveAt: string | null;
}
export interface Interface__Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Navs
export interface Interface__NavListItem {
  icon?: any;
  labelKey: string;
  label?: string;
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
export interface Interface__DataProps {
  headers?: Interface__FormattedTableHeader[];
  rows?: Interface__FormattedTableRow[];
  rowOptions?: Interface__RowOptionsTableOptionGenerator[];
  batchOptions?: Interface__BatchOptionsTableOptionGenerator[];
}
export interface Interface__FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
  align?: string;
}
export interface Interface__FormattedTableRow<T = any> {
  id: string;
  idx: number;
  data: T;
  dim?: boolean;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
    align?: string;
    dim?: boolean;
  }[];
}
export interface Interface__TableOption {
  disabled?: boolean;
  label?: string;
  icon?: any;
  onClick?: () => void;
  confirmation?: {
    id: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    confirmButtonProps?: BtnProps;
    loading?: boolean;
    disabled?: boolean;
  };
  menuItemProps?: Partial<MenuItemProps>;
  override?: ReactNode;
}
export type Interface__RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: Interface__FormattedTableRow<T>,
  overloads?: any
) => Interface__TableOption | null | false;
export type Interface__BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any
) => Interface__TableOption | null | false;

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
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: string;
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
