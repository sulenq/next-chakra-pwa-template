import useUOMFormat from "@/features/settings/regional/contexts/use-uom-format-context";
import { UnitKey } from "@/types/global.types";

// -----------------------------------------------------------------
// Type-safe unit string literals per dimension
// -----------------------------------------------------------------

export type UnitKeys = {
  mass: "kg" | "g" | "lb" | "oz" | "t";
  length: "m" | "cm" | "mm" | "in" | "ft" | "yd";
  distance: "km" | "m" | "mi" | "nmi";
  height: "cm" | "m" | "ft" | "in";
  area: "m²" | "km²" | "cm²" | "ha" | "ft²" | "mi²" | "ac";
  volume: "t" | "L" | "mL" | "m³" | "gal" | "fl oz";
  temperature: "°C" | "°F" | "K";
  speed: "km/h" | "m/s" | "mph" | "kn";
  energy: "kWh" | "J" | "kJ" | "BTU" | "cal" | "kcal";
  power: "W" | "kW" | "MW" | "hp" | "BTU/h";
  pressure: "kPa" | "Pa" | "MPa" | "bar" | "psi" | "atm" | "mmHg";
  data: "MB" | "GB" | "TB" | "KB" | "MiB" | "GiB";
  dataRate: "Mbps" | "Gbps" | "Kbps" | "MB/s" | "GB/s";
  angle: "°" | "rad" | "grad" | "′" | "″";
};

// -----------------------------------------------------------------
// ISO default units per dimension (used as `from` default)
// These match the ISO preset in uom-formats.ts
// -----------------------------------------------------------------

const ISO_DEFAULTS: { [K in UnitKey]: UnitKeys[K] } = {
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
};

// -----------------------------------------------------------------
// Conversion factors to internal base unit
// base[unitKey] = the internal pivot unit for conversions
// toBase[unit] = factor: value * factor = value in base
// fromBase[unit] = factor: valueInBase * factor = value in unit
//
// Temperature is handled separately (non-linear).
// -----------------------------------------------------------------

type LinearMap = Record<string, number>;

/** Factors to convert a unit TO the internal base (multiplicative) */
const TO_BASE: Record<UnitKey, LinearMap> = {
  // base: kg
  mass: { kg: 1, g: 1e-3, lb: 0.453592, oz: 0.0283495, t: 1000 },

  // base: m
  length: { m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144 },

  // base: m
  distance: { km: 1000, m: 1, mi: 1609.344, nmi: 1852 },

  // base: m
  height: { cm: 0.01, m: 1, ft: 0.3048, in: 0.0254 },

  // base: m²
  area: {
    "m²": 1,
    "km²": 1e6,
    "cm²": 1e-4,
    ha: 1e4,
    "ft²": 0.092903,
    "mi²": 2589988.11,
    ac: 4046.856,
  },

  // base: L (1 metric ton water ≈ 1000 L, 1 m³ = 1000 L)
  volume: {
    t: 1000,
    L: 1,
    mL: 0.001,
    "m³": 1000,
    gal: 3.78541,
    "fl oz": 0.0295735,
  },

  // base: °C (handled by functions, not factors — placeholder to satisfy type)
  temperature: { "°C": 1, "°F": 1, K: 1 },

  // base: m/s
  speed: { "km/h": 1 / 3.6, "m/s": 1, mph: 0.44704, kn: 0.514444 },

  // base: J
  energy: {
    kWh: 3.6e6,
    J: 1,
    kJ: 1000,
    BTU: 1055.06,
    cal: 4.184,
    kcal: 4184,
  },

  // base: W
  power: { W: 1, kW: 1000, MW: 1e6, hp: 745.7, "BTU/h": 0.293071 },

  // base: Pa
  pressure: {
    kPa: 1000,
    Pa: 1,
    MPa: 1e6,
    bar: 1e5,
    psi: 6894.757,
    atm: 101325,
    mmHg: 133.322,
  },

  // base: MB (decimal, 1 GB = 1000 MB)
  data: {
    MB: 1,
    GB: 1000,
    TB: 1e6,
    KB: 0.001,
    MiB: 1.048576,
    GiB: 1073.741824,
  },

  // base: Mbps (1 MB/s = 8 Mbps)
  dataRate: { Mbps: 1, Gbps: 1000, Kbps: 0.001, "MB/s": 8, "GB/s": 8000 },

  // base: ° (degree)
  angle: {
    "°": 1,
    rad: 180 / Math.PI,
    grad: 0.9, // 1 grad = 0.9°
    "′": 1 / 60, // arcminute
    "″": 1 / 3600, // arcsecond
  },
};

// -----------------------------------------------------------------
// Temperature conversion (special — non-linear)
// -----------------------------------------------------------------

function tempToCelsius(value: number, from: UnitKeys["temperature"]): number {
  switch (from) {
    case "°F":
      return ((value - 32) * 5) / 9;
    case "K":
      return value - 273.15;
    default:
      return value;
  }
}

function celsiusToTemp(value: number, to: UnitKeys["temperature"]): number {
  switch (to) {
    case "°F":
      return (value * 9) / 5 + 32;
    case "K":
      return value + 273.15;
    default:
      return value;
  }
}

// -----------------------------------------------------------------
// Internal linear converter
// -----------------------------------------------------------------

function convertLinear(
  value: number,
  from: string,
  to: string,
  factorMap: LinearMap,
): number {
  if (from === to) return value;
  const toBase = factorMap[from] ?? 1;
  const fromBase = 1 / (factorMap[to] ?? 1);
  return value * toBase * fromBase;
}

// -----------------------------------------------------------------
// formatUOM — public API
// -----------------------------------------------------------------

export interface FormatUOMOptions<K extends UnitKey> {
  /** Source unit of the value. Defaults to the ISO standard unit for the given dimension. */
  from?: UnitKeys[K];
  /**
   * Number of decimal places to display.
   * Default: 2. Pass 0 for integers.
   */
  fractionDigits?: number;
  /** Fallback string when value is null/undefined. Default: "-" */
  fallback?: string;
}

/**
 * Converts and formats a numeric value to the user's preferred UOM.
 *
 * @param value   Raw numeric value (from DB / source)
 * @param unit    The dimension key (e.g. "mass", "temperature")
 * @param options Optional: `from` overrides the source unit (default = ISO),
 *                `fractionDigits` controls decimal places (default 2),
 *                `fallback` for null/undefined values (default "-")
 *
 * @example
 * // DB stores weight in kg (ISO default), user prefers "lb"
 * formatUOM(70, "mass")              // "154.32 lb"
 *
 * // Value is in mg, user prefers "g"
 * formatUOM(500, "mass", { from: "mg" })  // TS error — "mg" not in UnitKeys["mass"]
 * formatUOM(500, "mass", { from: "g" })   // works
 */
export function formatUOM<K extends UnitKey>(
  value: number | null | undefined,
  unit: K,
  options?: FormatUOMOptions<K>,
): string {
  const fallback = options?.fallback ?? "-";
  if (value === null || value === undefined || isNaN(value as number))
    return fallback;

  const fractionDigits = options?.fractionDigits ?? 2;
  const fromUnit: string = options?.from ?? ISO_DEFAULTS[unit];
  const toUnit: string = useUOMFormat.getState().UOM[unit].key;

  let converted: number;

  if (unit === "temperature") {
    const celsius = tempToCelsius(value, fromUnit as UnitKeys["temperature"]);
    converted = celsiusToTemp(celsius, toUnit as UnitKeys["temperature"]);
  } else {
    converted = convertLinear(value, fromUnit, toUnit, TO_BASE[unit]);
  }

  const formatted = converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });

  return `${formatted} ${toUnit}`;
}
