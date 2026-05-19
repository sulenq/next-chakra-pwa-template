import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { TIME_ZONES } from "@/constants/timezones";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";

// -----------------------------------------------------------------

export const SelectTimezone = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();

  // Derived Values
  const options = TIME_ZONES.map((timezone) => {
    return {
      id: timezone.key,
      label: timezone.label,
      data: timezone,
    };
  });

  return (
    <SelectInput
      title={`${t.select} ${t.timezone}`}
      selectOptions={options}
      {...restProps}
    />
  );
};
