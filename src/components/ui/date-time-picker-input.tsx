import { DatePickerInput } from "@/components/ui/date-picker-input";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { ButtonSize, DisclosureSizes } from "@/types/global.types";
import { extractTime, getUserTimezone, makeUTCISODateTime } from "@/utils/time";
import { Group, GroupProps, useFieldContext } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { forwardRef, useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface DateTimePickerInputProps extends Omit<
  GroupProps,
  "title" | "placeholder" | "onChange" | "defaultValue"
> {
  id?: string;
  title?: {
    date: string;
    time: string;
  };
  value?: string | null;
  defaultValue?: string | null;
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

export const DateTimePickerInput = forwardRef<
  HTMLDivElement,
  DateTimePickerInputProps
>(function DateTimePickerInput(props, ref) {
  // Props
  const {
    id,
    title = {
      date: "",
      time: "",
    },
    value,
    defaultValue,
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
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null,
  );

  // Hybrid: detect controlled mode
  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Utils
  function handleDateChange(newDateVals: string[] | null | undefined) {
    const newDate = newDateVals?.[0] || "";
    setDate(newDate);

    if (newDate && time) {
      const finalValue = makeUTCISODateTime(newDate, time);
      if (!isControlled) setInternalValue(finalValue);
      onChange?.(finalValue);
    } else {
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
    }
  }

  function handleTimeChange(newTimeVal: string | null | undefined) {
    const newTime = newTimeVal || "";
    setTime(newTime);

    if (date && newTime) {
      const finalValue = makeUTCISODateTime(date, newTime);
      if (!isControlled) setInternalValue(finalValue);
      onChange?.(finalValue);
    } else {
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
    }
  }

  // handle initial value
  useEffect(() => {
    if (displayValue) {
      const userTzKey = getUserTimezone().key;
      const utcDate = parseISO(displayValue);
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
    } else {
      setDate("");
      setTime("");
    }
  }, [displayValue]);

  return (
    <Group
      ref={ref}
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
        onChange={handleDateChange}
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
        onChange={handleTimeChange}
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
});
