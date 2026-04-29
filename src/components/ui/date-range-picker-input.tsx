"use client";

import { DatePickerInput } from "@/components/ui/date-picker-input";
import { ButtonSize, DisclosureSizes } from "@/shared/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { capitalize } from "@/shared/utils/string";
import { Group, GroupProps, useFieldContext } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface DateRangePickerInputProps extends Omit<
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
  onChange?: (inputValue: DateRangePickerInputProps["inputValue"]) => void;
  placeholder?: {
    startDate: string;
    endDate: string;
  };
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  size?: ButtonSize;
}

export const DateRangePickerInput = (props: DateRangePickerInputProps) => {
  // Props
  const {
    id,
    title = {
      startDate: "",
      endDate: "",
    },
    inputValue,
    onChange,
    placeholder = {
      startDate: "",
      endDate: "",
    },
    required,
    invalid,
    disclosureSize = "xs",
    size,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const [startDate, setStartDate] = useState<string | null | undefined>(null);
  const [endDate, setEndDate] = useState<string | null | undefined>(null);

  // handle on change
  useEffect(() => {
    if (startDate && endDate) {
      onChange?.({
        startDate,
        endDate,
      });
    } else {
      onChange?.(null);
    }
  }, [startDate, endDate]);

  // handle initial value
  useEffect(() => {
    if (inputValue) {
      setStartDate(inputValue?.startDate);
      setEndDate(inputValue?.endDate);
    }
  }, []);

  return (
    <Group
      w={"full"}
      attached
      border={invalid || fc?.invalid ? "1px solid {colors.border.error}" : ""}
      rounded={themeConfig.radii.component}
      {...restProps}
    >
      <DatePickerInput
        w={"50%"}
        id={`${id}_start_date`}
        inputValue={startDate ? [startDate] : null}
        onChange={(inputValue) => {
          setStartDate(inputValue?.[0]);
        }}
        labelFormatVariant={"numeric"}
        title={title?.startDate}
        placeholder={placeholder?.startDate || t.start_date}
        disclosureSize={disclosureSize}
        invalid={false}
        required={required}
        size={size}
      />

      <DatePickerInput
        w={"50%"}
        id={`${id}_end_date`}
        inputValue={endDate ? [endDate] : null}
        onChange={(inputValue) => {
          setEndDate(inputValue?.[0]);
        }}
        labelFormatVariant={"numeric"}
        title={title?.endDate || capitalize(`${t.select} ${t.end_date}`)}
        placeholder={placeholder?.endDate || t.end_date}
        disclosureSize={disclosureSize}
        invalid={false}
        required={required}
        size={size}
      />
    </Group>
  );
};
