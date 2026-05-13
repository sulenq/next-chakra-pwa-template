import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { TIME_ZONES } from "@/constants/timezones";
import { capitalizeWords } from "@/utils/string";

// -----------------------------------------------------------------

export const SelectTimezone = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Constants
  const timezones = TIME_ZONES.map((timezone) => {
    return {
      id: timezone.key,
      label: timezone.label,
      data: timezone,
    };
  });

  return (
    <SelectInput
      title={capitalizeWords("Properties")}
      selectOptions={timezones}
      {...restProps}
    />
  );
};
