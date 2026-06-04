import { customConfig } from "@/themes/chakra-custom-system";
import { ColorMode } from "@/types/global.types";

export function getGridColumns(
  width: number,
  breakpoints: Record<number, number>,
): number | null {
  if (width <= 0) return null;

  let result = 3; // default columns

  // Iterate sorted breakpoints
  for (const bp of Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => a - b)) {
    if (width >= bp) {
      result = breakpoints[bp];
    }
  }

  return result;
}

export function isDimensionValid(dimension: { width: number; height: number }) {
  return dimension.width > 0 && dimension.height > 0;
}

export function cssCalc(params: string) {
  return `calc(${params})`;
}

export const getSemanticValue = (
  tokenPath: string,
  mode: ColorMode,
): string => {
  const semanticColors = (customConfig.theme as any)?.semanticTokens?.colors;

  if (!semanticColors) return "";

  const cleanPath = tokenPath.replace(/^colors\./, "");
  const parts = cleanPath.split(".");

  let current = semanticColors;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return "";
    }
  }

  if (current && current.value) {
    const rawValue =
      mode === "light" ? current.value.base : current.value._dark;
    if (typeof rawValue !== "string") return "";

    // Hapus !important dan konversi {colors.x.y} → var(--chakra-colors-x-y)
    return rawValue
      .replace(/\s*!important/g, "")
      .replace(/\{colors\.([^}]+)\}/g, (_match, path) => {
        const varName = path.replace(/\./g, "-");
        return `var(--chakra-colors-${varName})`;
      });
  }

  return "";
};

export const resolveCssVar = (value: string): string => {
  if (typeof window === "undefined") return value;
  const match = value.match(/var\((--[^)]+)\)/);
  if (!match) return value;

  let resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();

  // Resolve nested var() secara rekursif
  let limit = 5;
  while (resolved.startsWith("var(") && limit-- > 0) {
    const inner = resolved.match(/var\((--[^)]+)\)/);
    if (!inner) break;
    resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(inner[1])
      .trim();
  }

  return resolved || value;
};
