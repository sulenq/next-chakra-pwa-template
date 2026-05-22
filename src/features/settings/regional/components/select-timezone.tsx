import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { TIME_ZONES } from "@/constants/timezones";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";

// -----------------------------------------------------------------

export const SelectTimezone = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Store
  const { t } = useLocaleStore();

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
