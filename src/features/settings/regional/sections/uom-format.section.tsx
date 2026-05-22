import { Divider } from "@/components/ui/divider";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import useUOMFormatStore from "@/features/settings/regional/stores/use-uom-format-store";
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

// -----------------------------------------------------------------

const WeightFormatSetting = () => {
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_weight_format.title}</P>
      </StackV>

      <SelectMassFormat
        id={"settings-select-mass-format"}
        inputValue={[
          { id: UOM.mass.key, label: UOM.mass.label, data: UOM.mass },
        ]}
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_height_format.title}</P>
      </StackV>

      <SelectHeightFormat
        id={"settings-select-height-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_length_format.title}</P>
      </StackV>

      <SelectLengthFormat
        id={"settings-select-length-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_distance_format.title}</P>
      </StackV>

      <SelectDistanceFormat
        id={"settings-select-distance-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_area_format.title}</P>
      </StackV>

      <SelectAreaFormat
        id={"settings-select-area-format"}
        inputValue={[
          { id: UOM.area.key, label: UOM.area.label, data: UOM.area },
        ]}
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_volume_format.title}</P>
      </StackV>

      <SelectVolumeFormat
        id={"settings-select-volume-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_temperature_format.title}</P>
      </StackV>

      <SelectTemperatureFormat
        id={"settings-select-temperature-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_speed_format.title}</P>
      </StackV>

      <SelectSpeedFormat
        id={"settings-select-speed-format"}
        inputValue={[
          { id: UOM.speed.key, label: UOM.speed.label, data: UOM.speed },
        ]}
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_energy_format.title}</P>
      </StackV>

      <SelectEnergyFormat
        id={"settings-select-energy-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_power_format.title}</P>
      </StackV>

      <SelectPowerFormat
        id={"settings-select-power-format"}
        inputValue={[
          { id: UOM.power.key, label: UOM.power.label, data: UOM.power },
        ]}
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_pressure_format.title}</P>
      </StackV>

      <SelectPressureFormat
        id={"settings-select-pressure-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_format.title}</P>
      </StackV>

      <SelectDataFormat
        id={"settings-select-data-format"}
        inputValue={[
          { id: UOM.data.key, label: UOM.data.label, data: UOM.data },
        ]}
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_data_rate_format.title}</P>
      </StackV>

      <SelectDataRateFormat
        id={"settings-select-data-rate-format"}
        inputValue={[
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
  // Store
  const { t } = useLocaleStore();
  const { UOM, setUOMUnit } = useUOMFormatStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_angle_format.title}</P>
      </StackV>

      <SelectAngleFormat
        id={"settings-select-angle-format"}
        inputValue={[
          { id: UOM.angle.key, label: UOM.angle.label, data: UOM.angle },
        ]}
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
  // Store
  // Store
  const { t } = useLocaleStore();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText>{t.settings_uom_section.title}</SettingsHelperText>

      <Item.Body>
        <WeightFormatSetting />

        <Divider mx={4} />

        <HeightFormatSetting />

        <Divider mx={4} />

        <LengthFormatSetting />

        <Divider mx={4} />

        <DistanceFormatSetting />

        <Divider mx={4} />

        <AreaFormatSetting />

        <Divider mx={4} />

        <VolumeFormatSetting />

        <Divider mx={4} />

        <TemperatureFormatSetting />

        <Divider mx={4} />

        <SpeedFormatSetting />

        <Divider mx={4} />

        <EnergyFormatSetting />

        <Divider mx={4} />

        <PowerFormatSetting />

        <Divider mx={4} />

        <PressureFormatSetting />

        <Divider mx={4} />

        <DataFormatSetting />

        <Divider mx={4} />

        <DataRateFormatSetting />

        <Divider mx={4} />

        <AngleFormatSetting />
      </Item.Body>

      <SettingsHelperText>{t.settings_uom_section.helper}</SettingsHelperText>
    </Item.Root>
  );
};
