import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { TIME_FORMATS } from "@/constants/time-formats";
import { useLocale } from "@/contexts/use-locale-context";

// -----------------------------------------------------------------

export const SelectTimeFormat = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  // Derived Values
  const options = TIME_FORMATS.map((timeFormat) => {
    return {
      id: timeFormat.key,
      label: timeFormat.label,
      data: timeFormat,
    };
  });

  return (
    <SelectInput
      required
      title={`${t.select} ${t.time_format}`}
      selectOptions={options}
      {...restProps}
    />
  );
};
