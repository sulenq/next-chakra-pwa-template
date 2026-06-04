import { DatePickerInput } from "@/components/ui/date-picker-input";
import {
  TimePickerInput,
  TimePickerInputProps,
} from "@/components/ui/time-picker-input";
import { ButtonSize, DisclosureSizes } from "@/types/global.types";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
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
  value?: string | null;
  onChange?: (value: DateTimePickerInputProps["value"]) => void;
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
    value,
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

  // Stores
  const { theme } = useThemeStore();
  const fc = useFieldContext();

  // States
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Utils
  function handleConfirm(value: TimePickerInputProps["value"]) {
    setTime(value || "");
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
    if (value) {
      const userTzKey = getUserTimezone().key;
      const utcDate = parseISO(value);
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
      rounded={theme.radii.component}
      {...restProps}
    >
      <DatePickerInput
        w={"50%"}
        id={`${id}-date-picker-for-date-time-picker`}
        value={date ? [date] : null}
        onChange={(value) => setDate(value?.[0] || "")}
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
        value={time}
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
