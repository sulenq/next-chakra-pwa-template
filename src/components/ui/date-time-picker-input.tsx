import { DatePickerInput } from "@/components/ui/date-picker-input";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Props__DateTimePickerInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { extractTime, getUserTimezone, makeUTCISODateTime } from "@/utils/time";
import { Group, useFieldContext } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

export const DateTimePickerInput = (props: Props__DateTimePickerInput) => {
  const {
    id,
    title = {
      date: "",
      time: "",
    },
    inputValue,
    onChange,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    ...restProps
  } = props;

  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (date && time) {
      onChange?.(makeUTCISODateTime(date, time));
    } else {
      onChange?.("");
    }
  }, [date, time]);

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
        })
      );
    }
  }, []);

  return (
    <Group
      w={"full"}
      attached
      border={invalid || fc.invalid ? "1px solid {colors.border.error}" : ""}
      rounded={themeConfig.radii.component}
      {...restProps}
    >
      <DatePickerInput
        id={`${id}-date-picker-for-date-time-picker`}
        w={"50%"}
        title={title?.date}
        placeholder={placeholder?.date}
        disclosureSize={disclosureSize}
        inputValue={date ? [date] : []}
        onChange={(inputValue) => setDate(inputValue?.[0] || "")}
        invalid={false}
        required={required}
        borderRight={"1px solid {colors.border.muted}"}
        showTimezone
      />
      <TimePickerInput
        id={`${id}-time-picker-for-date-time-picker}`}
        w={"50%"}
        title={title?.time}
        placeholder={placeholder?.time}
        disclosureSize={disclosureSize}
        inputValue={time}
        onChange={(inputValue) => setTime(inputValue || "")}
        invalid={false}
        required={required}
        showTimezone
      />
    </Group>
  );
};
