import { BtnProps } from "@/components/ui/btn";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__FormattedTableHeader,
  Interface__FormattedTableRow,
  Interface__RowOptionsTableOptionGenerator,
  Interface__SelectOption,
  Interface__StorageFile,
} from "@/constants/interfaces";
import {
  BoxProps,
  CenterProps,
  FileUploadRootProps,
  GroupProps,
  IconProps,
  MenuRootProps,
  StackProps,
  TableRowProps,
  TextProps,
} from "@chakra-ui/react";
import { ImageProps } from "next/image";
import { Dispatch, RefObject } from "react";
import {
  ButtonSize,
  ButtonVariant,
  DateVariant,
  DisclosureSizes,
} from "./types";

export interface Props__PdfViewer extends StackProps {
  fileUrl: string;
  fileName?: string;
}

export interface Props__Divider extends BoxProps {
  dir?: "vertical" | "horizontal";
}

export interface Props__DisclosureHeaderContent {
  title?: string;
  withCloseButton?: boolean;
  withMaximizeButton?: boolean;
  onMaximizeChange?: (maximize: boolean) => void;
  content?: any;
  prefix?: "drawer" | "dialog";
  children?: any;
}

export interface Props__Img extends StackProps {
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPos?: string;
  fluid?: boolean;
  fallbackSrc?: string;
  wide?: boolean;
  imageProps?: Omit<ImageProps, "src" | "width" | "height" | "alt">;
}

export interface Props__Layout {
  children: React.ReactNode;
}
export interface Props__Today extends TextProps {
  dateVariant?: DateVariant;
}
export interface Props__NavLink extends StackProps {
  to?: string;
  external?: boolean;
}
export interface Props__ItemContainer extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}
export interface Props__ItemHeaderContainer extends StackProps {
  borderless?: boolean;
  clearSpacing?: boolean;
}
export interface Props__SettingsItemContainer extends Props__ItemContainer {
  disabled?: boolean;
}

export interface Props__ClockProps extends StackProps {
  showSeconds?: boolean;
  showTimezone?: boolean;
}

export interface Props__DataTable extends Omit<StackProps, "page"> {
  trBodyProps?: TableRowProps;
  headers?: Interface__FormattedTableHeader[];
  rows?: Interface__FormattedTableRow[];
  rowOptions?: Interface__RowOptionsTableOptionGenerator[];
  batchOptions?: Interface__BatchOptionsTableOptionGenerator[];
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  limit?: number;
  setLimit?: Dispatch<number>;
  page?: number;
  setPage?: Dispatch<number>;
  totalPage?: number;
  footer?: any;
  loading?: boolean;
  contentContainerProps?: StackProps;
}
export interface Props__BatchOptions extends BtnProps {
  selectedRows: any[];
  clearSelectedRows: () => void;
  batchOptions?: Interface__BatchOptionsTableOptionGenerator[];
  allRowsSelected: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableContainerRef?: RefObject<HTMLDivElement | null>;
  menuRootProps?: Omit<MenuRootProps, "children">;
}
export interface Props_RowOptions extends BtnProps {
  row: Interface__FormattedTableRow;
  rowOptions?: Interface__RowOptionsTableOptionGenerator<Interface__FormattedTableRow>[];
  tableContainerRef?: RefObject<HTMLDivElement | null>;
  menuRootProps?: Omit<MenuRootProps, "children">;
}
export interface Props__SortIcon extends IconProps {
  columnIndex: number;
  sortColumnIdx?: number;
  direction: "asc" | "desc";
}
export interface Props_LimitationTableData {
  limit: number;
  setLimit: Dispatch<number>;
  limitOptions?: number[];
}
export interface Props_PaginationTableData {
  page: number;
  setPage: Dispatch<number>;
  totalPage?: number;
}

export interface Props__Logo extends CenterProps {
  color?: string;
  size?: number;
}

export interface Props__VideoPlayer extends StackProps {
  id?: string;
  thumbnail?: string;
  src?: string;
  width?: number | string;
  height?: number | string;
  storageKey?: string;
}

export interface Props__RichEditor {
  inputValue?: string;
  onChange?: (inputValue: Props__RichEditor["inputValue"]) => void;
}

export interface Props__FeedbackState extends StackProps {
  title?: string;
  description?: string;
  icon?: any;
}

export interface Props__SelectInput extends Omit<BtnProps, "onChange"> {
  id: string;
  title?: string;
  inputValue?: Interface__SelectOption[] | null;
  onChange?: (inputValue: Props__SelectInput["inputValue"]) => void;
  loading?: boolean;
  error?: any;
  selectOptions?: Props__SelectInput["inputValue"];
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  multiple?: boolean;
  fetch?: () => void;
  disclosureSize?: DisclosureSizes;
  variant?: ButtonVariant;
}

export interface Props__FileInput extends Omit<
  FileUploadRootProps,
  "onChange"
> {
  id?: string;
  fRef?: any;
  inputValue?: File[];
  onChange?: (inputValue: Props__FileInput["inputValue"]) => void;
  accept?: string;
  acceptPlaceholder?: string;
  invalid?: boolean;
  placeholder?: string;
  label?: string;
  dropzone?: boolean;
  maxFileSizeMB?: number;
  maxFiles?: number;
  description?: string;
  disabled?: boolean;
  existingFiles?: Interface__StorageFile[];
  onDeleteFile?: (file: Interface__StorageFile) => void;
  onUndoDeleteFile?: (file: Interface__StorageFile) => void;
}
export interface Props__FileInputInputComponent extends Omit<
  Props__FileInput,
  "removed"
> {
  existing: Interface__StorageFile[];
  showDropzoneIcon?: boolean;
  showDropzoneLabel?: boolean;
  showDropzoneDescription?: boolean;
  acceptPlaceholder?: string;
  imgInput?: boolean;
}
export interface Props__FileItem extends StackProps {
  fileData: any;
  idx?: number;
  actions?: {
    type: "remove" | "delete" | "undo_delete";
    onClick: () => void;
    label?: string;
    icon?: React.ReactNode;
  }[];
}
export interface Props__FileList extends Omit<StackProps, "onChange"> {
  inputValue: File[];
  onChange?: Props__FileInput["onChange"];
}

export interface Props__DateRangePickerInput extends Omit<
  GroupProps,
  "title" | "placeholder" | "onChange"
> {
  id?: string;
  title?: {
    startDate: string;
    endDate: string;
  };
  inputValue?: {
    startDate: string;
    endDate: string;
  } | null;
  onChange?: (inputValue: Props__DateRangePickerInput["inputValue"]) => void;
  placeholder?: {
    startDate: string;
    endDate: string;
  };
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  size?: ButtonSize;
}
