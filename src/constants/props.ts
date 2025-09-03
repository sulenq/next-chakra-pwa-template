import { BtnProps } from "@/components/ui/btn";
import { Type__DisclosureSizes, Type__Period } from "./types";
import { BoxProps, InputProps, StackProps } from "@chakra-ui/react";
import { Dispatch } from "react";

export interface Props__PeriodPickerInput extends BtnProps {
  id?: string;
  title?: string;
  inputValue?: Type__Period;
  onConfirm?: (inputValue: Type__Period) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  multiple?: boolean;
}

export interface Props__DatePickerInput extends BtnProps {
  id?: string;
  title?: string;
  inputValue?: string[];
  onConfirm?: (inputValue: string[]) => void;
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

export interface Props__StringInput extends Omit<InputProps, "onChange"> {
  onChange?: (inputValue: string) => void;
  inputValue?: string;
  placeholder?: string;
  boxProps?: BoxProps;
  invalid?: boolean;
}

export interface Props__NumInput extends Omit<InputProps, "onChange"> {
  id?: string;
  inputValue?: number | null;
  onChange?: (inputValue: number | null) => void;
  placeholder?: string;
  invalid?: boolean;
  boxProps?: BoxProps;
  formatFunction?: (inputValue: number | null) => string;
  formatted?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
}
