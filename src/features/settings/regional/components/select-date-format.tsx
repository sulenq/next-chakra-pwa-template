import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { DATE_FORMATS } from "@/constants/date-formats";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";

// -----------------------------------------------------------------

export const SelectDateFormat = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();

  // Derived Values
  const options = DATE_FORMATS.map((dateFormat) => {
    return {
      id: dateFormat.key,
      label: dateFormat.label,
      data: dateFormat,
    };
  });

  return (
    <SelectInput
      required
      title={`${t.select} ${t.date_format}`}
      selectOptions={options}
      {...restProps}
    />
  );
};
