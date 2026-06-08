import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { TIME_ZONES } from "@/constants/timezones";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { SelectOption } from "@/types/global.types";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export const SelectTimezone = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[] | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOptions(null);
      return;
    }

    const timer = setTimeout(() => {
      const timezoneOptions = TIME_ZONES.map((timezone) => ({
        id: timezone.key,
        label: timezone.label,
        data: timezone,
      }));

      setOptions(timezoneOptions);
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <SelectInput
      title={`${t.select} ${t.timezone}`}
      selectOptions={options || []}
      loading={options === null && isOpen}
      onOpenChange={setIsOpen}
      {...restProps}
    />
  );
};
