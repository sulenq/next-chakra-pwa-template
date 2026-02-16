"use client";

import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Props__DateRangePickerInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { capitalize } from "@/utils/string";
import { Group, useFieldContext } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const DateRangePickerInput = (props: Props__DateRangePickerInput) => {
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
  const { l } = useLang();
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
        placeholder={placeholder?.startDate || l.start_date}
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
        title={title?.endDate || capitalize(`${l.select} ${l.end_date}`)}
        placeholder={placeholder?.endDate || l.end_date}
        disclosureSize={disclosureSize}
        invalid={false}
        required={required}
        size={size}
      />
    </Group>
  );
};
