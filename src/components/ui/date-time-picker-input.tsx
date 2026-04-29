import { DatePickerInput } from "@/components/ui/date-picker-input";
import {
  TimePickerInput,
  TimePickerInputProps,
} from "@/components/ui/time-picker-input";
import { ButtonSize, DisclosureSizes } from "@/constants/types";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { extractTime, getUserTimezone, makeUTCISODateTime } from "@/utils/time";
import { Group, GroupProps, useFieldContext } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface DateTimePickerInputProps extends Omit<
  GroupProps,
  "title" | "placeholder" | "onChange"
> {
  id?: string;
  title?: {
    date: string;
    time: string;
  };
  inputValue?: string | null;
  onChange?: (inputValue: DateTimePickerInputProps["inputValue"]) => void;
  placeholder?: {
    date: string;
    time: string;
  };
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  size?: ButtonSize;
}

export const DateTimePickerInput = (props: DateTimePickerInputProps) => {
  // Props
  const {
    id,
    title = {
      date: "",
      time: "",
    },
    inputValue,
    onChange,
    placeholder = {
      date: undefined,
      time: undefined,
    },
    required,
    invalid,
    disclosureSize = "xs",
    size,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Utils
  function handleConfirm(inputValue: TimePickerInputProps["inputValue"]) {
    setTime(inputValue || "");
  }

  // handle on change
  useEffect(() => {
    if (date && time) {
      onChange?.(makeUTCISODateTime(date, time));
    } else {
      onChange?.(null);
    }
  }, [date, time]);

  // handle initial value
  useEffect(() => {
    if (inputValue) {
      const userTzKey = getUserTimezone().key;
      const utcDate = parseISO(inputValue);
      const localizedDate = toZonedTime(utcDate, userTzKey);
      const localized = formatTz(localizedDate, "yyyy-MM-dd'T'HH:mm:ss", {
        timeZone: userTzKey,
      });

      setDate(localized);
      setTime(
        extractTime(localized, {
          withSeconds: true,
        }),
      );
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
        id={`${id}-date-picker-for-date-time-picker`}
        inputValue={date ? [date] : null}
        onChange={(inputValue) => setDate(inputValue?.[0] || "")}
        title={title?.date}
        placeholder={placeholder?.date}
        disclosureSize={disclosureSize}
        invalid={false}
        required={required}
        showTimezone
        size={size}
      />
      <TimePickerInput
        w={"50%"}
        id={`${id}-time-picker-for-date-time-picker}`}
        inputValue={time}
        onChange={handleConfirm}
        title={title?.time}
        placeholder={placeholder?.time}
        disclosureSize={disclosureSize}
        invalid={false}
        required={required}
        showTimezone
        size={size}
      />
    </Group>
  );
};
