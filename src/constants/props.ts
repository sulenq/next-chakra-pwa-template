import { BtnProps } from "@/components/ui/btn";
import {
  Interface__FormattedTableData,
  Interface__FormattedTableHeader,
  Interface__SelectOption,
  Interface__StorageFile,
  Interface__TableOption,
} from "@/constants/interfaces";
import {
  BoxProps,
  ButtonProps,
  FileUploadRootProps,
  GroupProps,
  IconProps,
  InputGroupProps,
  InputProps,
  StackProps,
  TableRowProps,
  TextProps,
} from "@chakra-ui/react";
import { TextareaProps } from "node_modules/@chakra-ui/react/dist/types/components/editable/namespace";
import { Dispatch, RefObject } from "react";
import {
  Type__DateVariant,
  Type__DisclosureSizes,
  Type__Period,
} from "./types";
import { ImageProps } from "next/image";

export interface Props__DisclosureHeaderContent {
  title?: string;
  withCloseButton?: boolean;
  content?: any;
  prefix?: "drawer" | "dialog";
  children?: any;
}

export interface Props__Img extends StackProps {
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPos?: string;
  imageProps?: ImageProps;
}

export interface Props__Layout {
  children: React.ReactNode;
}
export interface Props__Today extends TextProps {
  dateVariant?: Type__DateVariant;
}
export interface Props__NavLink extends StackProps {
  to?: string;
}
export interface Props__ItemContainer extends StackProps {
  scrollY?: boolean;
}
export interface Props__ItemHeaderContainer extends StackProps {
  borderless?: boolean;
  clearSpacing?: boolean;
}
export interface Props__SettingsItemContainer extends Props__ItemContainer {
  disabled?: boolean;
}

export interface Props__ClockProps extends StackProps {
  withSeconds?: boolean;
  withTimezone?: boolean;
}

export interface Props__DataTable extends Omit<StackProps, "page"> {
  trBodyProps?: TableRowProps;
  headers?: Interface__FormattedTableHeader[];
  rows?: Interface__FormattedTableData[];
  rowOptions?: Interface__TableOption[];
  batchOptions?: Interface__TableOption[];
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  limit?: number;
  setLimit?: Dispatch<number>;
  page?: number;
  setPage?: Dispatch<number>;
  totalPage?: number;
  footer?: any;
}
export interface Props__SortIcon extends IconProps {
  columnIndex: number;
  sortColumnIdx?: number;
  direction: "asc" | "desc";
}
export interface Props__BatchOptions {
  selectedRows: any[];
  batchOptions?: (Interface__TableOption | "divider")[];
  selectAllRows: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableContainerRef?: RefObject<HTMLDivElement | null>;
}
export interface Props_RowOptions {
  row?: any;
  rowOptions?: (Interface__TableOption | "divider")[];
  tableContainerRef?: RefObject<HTMLDivElement | null>;
}
export interface Props_LimitationTableData {
  limit: number;
  setLimit: Dispatch<number>;
}
export interface Props_PaginationTableData {
  page: number;
  setPage: Dispatch<number>;
  totalPage?: number;
}

export interface Props__Logo {
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

export interface Props__SelectInput extends BtnProps {
  id?: string;
  title?: string;
  inputValue?: Interface__SelectOption[] | null;
  onConfirm?: (inputValue: Props__SelectInput["inputValue"]) => void;
  loading?: boolean;
  selectOptions?: Props__SelectInput["inputValue"];
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  multiple?: boolean;
  fetch?: () => void;
  disclosureSize?: Type__DisclosureSizes;
}
export interface Props__SelectOptions {
  multiple: Props__SelectInput["multiple"];
  selectOptions: Props__SelectInput["inputValue"];
  selected: Interface__SelectOption[];
  setSelected: Dispatch<Props__SelectOptions["selected"]>;
}

export interface Props__StringInput extends Omit<InputProps, "onChange"> {
  inputValue?: string;
  onChange?: (inputValue: Props__StringInput["inputValue"]) => void;
  placeholder?: string;
  boxProps?: BoxProps;
  invalid?: boolean;
  clearable?: boolean;
  clearButtonProps?: StackProps;
}

export interface Props__PasswordInput extends Omit<InputProps, "onChange"> {
  name?: string;
  onChange?: (inputValue: Props__PasswordInput["inputValue"]) => void;
  inputValue?: string | undefined;
  placeholder?: string;
  boxProps?: BoxProps;
  invalid?: boolean;
}

export interface Props__SearchInput
  extends Omit<InputGroupProps, "children" | "onChange"> {
  inputValue?: string;
  onChange?: (inputValue: Props__SearchInput["inputValue"]) => void;
  placeholder?: string;
  additionalPlaceholder?: string;
  tooltipLabel?: string;
  inputRef?: any;
  inputProps?: Props__StringInput;
  icon?: any;
  iconProps?: IconProps;
  invalid?: boolean;
  noIcon?: boolean;
  children?: React.ReactNode;
}

export interface Props__TextareaInput extends Omit<TextareaProps, "onChange"> {
  inputValue?: string;
  onChange?: (inputValue: Props__TextareaInput["inputValue"]) => void;
  invalid?: boolean;
  placeholder?: string;
}

export interface Props__FileInput
  extends Omit<FileUploadRootProps, "onChange"> {
  fRef?: any;
  inputValue?: File[];
  onChange?: (inputValue: Props__FileInput["inputValue"]) => void;
  accept?: string;
  invalid?: boolean;
  placeholder?: string;
  label?: string;
  dropzone?: boolean;
  maxFileSize?: number;
  maxFiles?: number;
  description?: string;
  disabled?: boolean;
  existingFiles?: Interface__StorageFile[];
  onDeleteFile?: (file: Interface__StorageFile) => void;
  onUndoDeleteFile?: (file: Interface__StorageFile) => void;
}
export interface Props__FileInputInputComponent
  extends Omit<Props__FileInput, "removed"> {
  existing: Interface__StorageFile[];
}
export interface Props__FileItem {
  fileData: any;
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

export interface Props__PeriodPickerInput extends BtnProps {
  id?: string;
  title?: string;
  inputValue?: Type__Period | null;
  onConfirm?: (inputValue?: Props__PeriodPickerInput["inputValue"]) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  multiple?: boolean;
}

export interface Props__DatePickerInput extends BtnProps {
  id?: string;
  title?: string;
  inputValue?: string[] | null;
  onConfirm?: (inputValue: Props__DatePickerInput["inputValue"]) => void;
  showTimezone?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  multiple?: boolean;
}
export interface Props__DatePicker extends StackProps {
  inputValue?: string[];
  period: Type__Period;
  selected: Date[];
  setSelected: Dispatch<Date[]>;
  multiple: boolean;
}
export interface Props__SelectedDateList {
  id?: string;
  selected: Date[];
  formattedSelectedLabel: string;
}
export interface Props__TimePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  inputValue?: string | null;
  onConfirm?: (inputValue?: Props__TimePicker["inputValue"]) => void;
  withSeconds?: boolean;
  showTimezone?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}
export interface Props__DateTimePickerInput
  extends Omit<GroupProps, "title" | "placeholder" | "onChange"> {
  id?: string;
  title?: {
    date: string;
    time: string;
  };
  inputValue?: string;
  onChange?: (inputValue: Props__DateTimePickerInput["inputValue"]) => void;
  placeholder?: {
    date: string;
    time: string;
  };
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

export interface Props__NumInput extends Omit<InputProps, "onChange"> {
  inputValue?: number | null;
  onChange?: (inputValue: Props__NumInput["inputValue"]) => void;
  placeholder?: string;
  invalid?: boolean;
  boxProps?: BoxProps;
  formatFunction?: (inputValue: number | null) => string;
  formatted?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
  clearable?: boolean;
}
