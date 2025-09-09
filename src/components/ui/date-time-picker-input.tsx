import { DatePickerInput } from "@/components/ui/date-picker-input";
import TimePickerInput from "@/components/ui/time-picker-input";
import { Props__DateTimePickerInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { extractTime, getUserTimezone, makeUTCISODateTime } from "@/utils/time";
import { Group, useFieldContext } from "@chakra-ui/react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

export const DateTimePickerInput = (props: Props__DateTimePickerInput) => {
  // Props
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

  // Contexts
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // set input value on date & time change
  useEffect(() => {
    if (date && time) {
      onChange?.(makeUTCISODateTime(date, time));
    } else {
      onChange?.("");
    }
  }, [date, time]);

  // set inputValue to date & time on open
  useEffect(() => {
    if (inputValue) {
      const userTzKey = getUserTimezone().key;

      // convert UTC iso ke user tz
      const localized = moment.utc(inputValue).tz(userTzKey).format();

      setDate(localized);
      setTime(
        extractTime(localized, {
          withSeconds: true,
        })
      );
    }
  }, [open]);

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
        onConfirm={(inputValue) => setDate(inputValue?.[0] || "")}
        invalid={false}
        required={required}
        showTimezone
      />
      <TimePickerInput
        id={`${id}-time-picker-for-date-time-picker}`}
        w={"50%"}
        title={title?.time}
        placeholder={placeholder?.time}
        disclosureSize={disclosureSize}
        inputValue={time}
        onConfirm={(inputValue) => setTime(inputValue || "")}
        invalid={false}
        required={required}
        showTimezone
      />
    </Group>
  );
};
