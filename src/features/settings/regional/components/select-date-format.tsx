import {
  DisclosureSelectInput,
  DisclosureSelectInputProps,
} from "@/components/ui/disclosure-select-input";
import { DATE_FORMATS } from "@/constants/date-formats";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";

// -----------------------------------------------------------------

export const SelectDateFormat = (props: DisclosureSelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  // Derived Values
  const options = DATE_FORMATS.map((dateFormat) => {
    return {
      id: dateFormat.key,
      label: dateFormat.label,
      data: dateFormat,
    };
  });

  return (
    <DisclosureSelectInput
      required
      title={`${t.select} ${t.date_format}`}
      selectOptions={options}
      {...restProps}
    />
  );
};
