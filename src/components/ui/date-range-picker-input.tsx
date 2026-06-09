"use client";

import { DatePickerInput } from "@/components/ui/date-picker-input";
import { ButtonSize, DisclosureSizes } from "@/types/global.types";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { capitalize } from "@/utils/string";
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
  value?: {
    startDate: string;
    endDate: string;
  } | null;
  onChange?: (value: DateRangePickerInputProps["value"]) => void;
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
    value,
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

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
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
    if (value) {
      setStartDate(value?.startDate);
      setEndDate(value?.endDate);
    }
  }, []);

  return (
    <Group
      w={"full"}
      attached
      border={invalid || fc?.invalid ? "1px solid {colors.border.error}" : ""}
      rounded={theme.radii.component}
      {...restProps}
    >
      <DatePickerInput
        w={"50%"}
        id={`${id}_start_date`}
        value={startDate ? [startDate] : null}
        onChange={(value) => {
          setStartDate(value?.[0]);
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
        value={endDate ? [endDate] : null}
        onChange={(value) => {
          setEndDate(value?.[0]);
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
