import { UnitKey } from "@/shared/constants/types";

export const UOM_FORMATS: {
  key: string;
  label: string;
  descriptionKey: string;
  units: Record<UnitKey, string>;
}[] = [
  {
    key: "metric",
    label: "Metric",
    descriptionKey: "uom_formats_description.metric",
    units: {
      mass: "kg",
      length: "m",
      distance: "km",
      height: "cm",
      area: "m²",
      volume: "t",
      temperature: "°C",
      speed: "km/h",
      energy: "kWh",
      power: "W",
      pressure: "kPa",
      data: "MB",
      dataRate: "Mbps",
      angle: "°",
    },
  },
  {
    key: "imperial",
    label: "Imperial",
    descriptionKey: "uom_formats_description.imperial",
    units: {
      mass: "lb",
      length: "in",
      distance: "mi",
      height: "ft",
      area: "ft²",
      volume: "gal",
      temperature: "°F",
      speed: "mph",
      energy: "BTU",
      power: "hp",
      pressure: "psi",
      data: "MB",
      dataRate: "Mbps",
      angle: "°",
    },
  },
  {
    key: "iso",
    label: "ISO",
    descriptionKey: "uom_formats_description.iso",
    units: {
      mass: "kg",
      length: "m",
      distance: "m",
      height: "cm",
      area: "m²",
      volume: "t",
      temperature: "K",
      speed: "m/s",
      energy: "J",
      power: "W",
      pressure: "Pa",
      data: "MB",
      dataRate: "Mbps",
      angle: "rad",
    },
  },
];
