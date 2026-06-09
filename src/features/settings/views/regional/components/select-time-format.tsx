import {
  DisclosureSelectInput,
  DisclosureSelectInputProps,
} from "@/components/ui/disclosure-select-input";
import { TIME_FORMATS } from "@/constants/time-formats";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";

// -----------------------------------------------------------------

export const SelectTimeFormat = (props: DisclosureSelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  // Derived Values
  const options = TIME_FORMATS.map((timeFormat) => {
    return {
      id: timeFormat.key,
      label: timeFormat.label,
      data: timeFormat,
    };
  });

  return (
    <DisclosureSelectInput
      required
      title={`${t.select} ${t.time_format}`}
      selectOptions={options}
      {...restProps}
    />
  );
};
