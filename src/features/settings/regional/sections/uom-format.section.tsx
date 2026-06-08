import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import {
  SettingsGroupTitle,
  SettingsHelperText,
} from "@/components/ui/typography";
import { R_SPACING_MD } from "@/constants/styles";
import {
  SelectAngleFormat,
  SelectAreaFormat,
  SelectDataFormat,
  SelectDataRateFormat,
  SelectDistanceFormat,
  SelectEnergyFormat,
  SelectHeightFormat,
  SelectLengthFormat,
  SelectMassFormat,
  SelectPowerFormat,
  SelectPressureFormat,
  SelectSpeedFormat,
  SelectTemperatureFormat,
  SelectVolumeFormat,
} from "@/features/settings/regional/components/select-unit-format";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import useUOMFormatStore from "@/features/settings/regional/stores/use-uom-format-store";

// -----------------------------------------------------------------

const WeightFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_weight_format.title}</P>
      </StackV>

      <SelectMassFormat
        id={"settings-select-mass-format"}
        value={[{ id: UOM.mass.key, label: UOM.mass.label, data: UOM.mass }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("mass", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const HeightFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_height_format.title}</P>
      </StackV>

      <SelectHeightFormat
        id={"settings-select-height-format"}
        value={[
          { id: UOM.height.key, label: UOM.height.label, data: UOM.height },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("height", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const LengthFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_length_format.title}</P>
      </StackV>

      <SelectLengthFormat
        id={"settings-select-length-format"}
        value={[
          { id: UOM.length.key, label: UOM.length.label, data: UOM.length },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("length", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DistanceFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_distance_format.title}</P>
      </StackV>

      <SelectDistanceFormat
        id={"settings-select-distance-format"}
        value={[
          {
            id: UOM.distance.key,
            label: UOM.distance.label,
            data: UOM.distance,
          },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("distance", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const AreaFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_area_format.title}</P>
      </StackV>

      <SelectAreaFormat
        id={"settings-select-area-format"}
        value={[{ id: UOM.area.key, label: UOM.area.label, data: UOM.area }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("area", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const VolumeFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_volume_format.title}</P>
      </StackV>

      <SelectVolumeFormat
        id={"settings-select-volume-format"}
        value={[
          { id: UOM.volume.key, label: UOM.volume.label, data: UOM.volume },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("volume", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const TemperatureFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_temperature_format.title}</P>
      </StackV>

      <SelectTemperatureFormat
        id={"settings-select-temperature-format"}
        value={[
          {
            id: UOM.temperature.key,
            label: UOM.temperature.label,
            data: UOM.temperature,
          },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("temperature", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const SpeedFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_speed_format.title}</P>
      </StackV>

      <SelectSpeedFormat
        id={"settings-select-speed-format"}
        value={[{ id: UOM.speed.key, label: UOM.speed.label, data: UOM.speed }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("speed", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const EnergyFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_energy_format.title}</P>
      </StackV>

      <SelectEnergyFormat
        id={"settings-select-energy-format"}
        value={[
          { id: UOM.energy.key, label: UOM.energy.label, data: UOM.energy },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("energy", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const PowerFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_power_format.title}</P>
      </StackV>

      <SelectPowerFormat
        id={"settings-select-power-format"}
        value={[{ id: UOM.power.key, label: UOM.power.label, data: UOM.power }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("power", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const PressureFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_pressure_format.title}</P>
      </StackV>

      <SelectPressureFormat
        id={"settings-select-pressure-format"}
        value={[
          {
            id: UOM.pressure.key,
            label: UOM.pressure.label,
            data: UOM.pressure,
          },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("pressure", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DataFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_format.title}</P>
      </StackV>

      <SelectDataFormat
        id={"settings-select-data-format"}
        value={[{ id: UOM.data.key, label: UOM.data.label, data: UOM.data }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("data", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const DataRateFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_rate_format.title}</P>
      </StackV>

      <SelectDataRateFormat
        id={"settings-select-data-rate-format"}
        value={[
          {
            id: UOM.dataRate.key,
            label: UOM.dataRate.label,
            data: UOM.dataRate,
          },
        ]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("dataRate", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const AngleFormatSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_angle_format.title}</P>
      </StackV>

      <SelectAngleFormat
        id={"settings-select-angle-format"}
        value={[{ id: UOM.angle.key, label: UOM.angle.label, data: UOM.angle }]}
        onChange={(v) => {
          if (v?.[0]?.data) setUOMUnit("angle", v[0].data);
        }}
        w={"fit"}
        size={"xs"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const UOMFormatSection = () => {
  // Stores
  // Stores
  const { t } = useLocaleStore();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsGroupTitle>{t.settings_uom_section.title}</SettingsGroupTitle>

      <Item.Body>
        <WeightFormatSetting />

        <Divider />

        <HeightFormatSetting />

        <Divider />

        <LengthFormatSetting />

        <Divider />

        <DistanceFormatSetting />

        <Divider />

        <AreaFormatSetting />

        <Divider />

        <VolumeFormatSetting />

        <Divider />

        <TemperatureFormatSetting />

        <Divider />

        <SpeedFormatSetting />

        <Divider />

        <EnergyFormatSetting />

        <Divider />

        <PowerFormatSetting />

        <Divider />

        <PressureFormatSetting />

        <Divider />

        <DataFormatSetting />

        <Divider />

        <DataRateFormatSetting />

        <Divider />

        <AngleFormatSetting />
      </Item.Body>

      <SettingsHelperText>{t.settings_uom_section.helper}</SettingsHelperText>
    </Item.Root>
  );
};
