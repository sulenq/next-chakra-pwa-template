import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { UNIT_OPTIONS } from "@/constants/unit-options";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
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
  // Stores
  const { t } = useLocaleStore();

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
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"mass"}
      unitLabel={t.settings_weight_format.title}
      {...props}
    />
  );
};

export const SelectLengthFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"length"}
      unitLabel={t.settings_length_format.title}
      {...props}
    />
  );
};

export const SelectDistanceFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"distance"}
      unitLabel={t.settings_distance_format.title}
      {...props}
    />
  );
};

export const SelectHeightFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"height"}
      unitLabel={t.settings_height_format.title}
      {...props}
    />
  );
};

export const SelectAreaFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"area"}
      unitLabel={t.settings_area_format.title}
      {...props}
    />
  );
};

export const SelectVolumeFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"volume"}
      unitLabel={t.settings_volume_format.title}
      {...props}
    />
  );
};

export const SelectTemperatureFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"temperature"}
      unitLabel={t.settings_temperature_format.title}
      {...props}
    />
  );
};

export const SelectSpeedFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"speed"}
      unitLabel={t.settings_speed_format.title}
      {...props}
    />
  );
};

export const SelectEnergyFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"energy"}
      unitLabel={t.settings_energy_format.title}
      {...props}
    />
  );
};

export const SelectPowerFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"power"}
      unitLabel={t.settings_power_format.title}
      {...props}
    />
  );
};

export const SelectPressureFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"pressure"}
      unitLabel={t.settings_pressure_format.title}
      {...props}
    />
  );
};

export const SelectDataFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"data"}
      unitLabel={t.settings_data_format.title}
      {...props}
    />
  );
};

export const SelectDataRateFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"dataRate"}
      unitLabel={t.settings_data_rate_format.title}
      {...props}
    />
  );
};

export const SelectAngleFormat = (props: SelectInputProps) => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <SelectUnitFormat
      unitKey={"angle"}
      unitLabel={t.settings_angle_format.title}
      {...props}
    />
  );
};
