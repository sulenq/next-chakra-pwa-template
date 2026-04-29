import { BtnProps } from "@/components/ui/btn";
import { ActivityActionEnum } from "@/constants/enums";
import { Gender } from "@/constants/types";
import { MenuItemProps, StackProps } from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

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

// Data Table
export interface DataProps {
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
  idx: number;
  data: T;
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
export interface TableOption {
  disabled?: boolean;
  label?: string;
  icon?: LucideIcon;
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
export type RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: FormattedTableRow<T>,
  overloads?: any,
) => TableOption | null | false;
export type BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any,
) => TableOption | null | false;

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
  original_data?: any;
  disabled?: boolean;
}
