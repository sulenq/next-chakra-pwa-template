import {
  DisclosureSelectInput,
  DisclosureSelectInputProps,
} from "@/components/ui/disclosure-select-input";
import { LANGUAGES } from "@/constants/languages";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";

// -----------------------------------------------------------------

export const SelectLanguage = (props: DisclosureSelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  // Derived Values
  const options = LANGUAGES.map((language) => {
    return {
      id: language.key,
      label: language.label,
      data: language,
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
