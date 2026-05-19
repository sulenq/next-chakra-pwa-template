import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { UNIT_OPTIONS } from "@/constants/unit-options";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { UnitKey } from "@/types/global.types";

// -----------------------------------------------------------------

interface SelectUnitFormatProps extends SelectInputProps {
  unitKey: UnitKey;
  unitLabel: string;
}

export const SelectUnitFormat = ({
  unitKey,
  unitLabel,
  ...restProps
}: SelectUnitFormatProps) => {
  // Contexts
  const { t } = useLocaleContext();

  // Derived Values
  const options = UNIT_OPTIONS[unitKey].map((unit) => ({
    id: unit.key,
    label: unit.label,
    data: unit,
  }));

  return (
    <SelectInput
      required
      title={`${t.select} ${unitLabel}`}
      selectOptions={options}
      {...restProps}
    />
  );
};

// -----------------------------------------------------------------

export const SelectMassFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"mass"}
      unitLabel={t.settings_weight_format.title}
      {...props}
    />
  );
};

export const SelectLengthFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"length"}
      unitLabel={t.settings_length_format.title}
      {...props}
    />
  );
};

export const SelectDistanceFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"distance"}
      unitLabel={t.settings_distance_format.title}
      {...props}
    />
  );
};

export const SelectHeightFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"height"}
      unitLabel={t.settings_height_format.title}
      {...props}
    />
  );
};

export const SelectAreaFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"area"}
      unitLabel={t.settings_area_format.title}
      {...props}
    />
  );
};

export const SelectVolumeFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"volume"}
      unitLabel={t.settings_volume_format.title}
      {...props}
    />
  );
};

export const SelectTemperatureFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"temperature"}
      unitLabel={t.settings_temperature_format.title}
      {...props}
    />
  );
};

export const SelectSpeedFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"speed"}
      unitLabel={t.settings_speed_format.title}
      {...props}
    />
  );
};

export const SelectEnergyFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"energy"}
      unitLabel={t.settings_energy_format.title}
      {...props}
    />
  );
};

export const SelectPowerFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"power"}
      unitLabel={t.settings_power_format.title}
      {...props}
    />
  );
};

export const SelectPressureFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"pressure"}
      unitLabel={t.settings_pressure_format.title}
      {...props}
    />
  );
};

export const SelectDataFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"data"}
      unitLabel={t.settings_data_format.title}
      {...props}
    />
  );
};

export const SelectDataRateFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"dataRate"}
      unitLabel={t.settings_data_rate_format.title}
      {...props}
    />
  );
};

export const SelectAngleFormat = (props: SelectInputProps) => {
  // Contexts
  const { t } = useLocaleContext();

  return (
    <SelectUnitFormat
      unitKey={"angle"}
      unitLabel={t.settings_angle_format.title}
      {...props}
    />
  );
};
