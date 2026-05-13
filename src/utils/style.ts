import { customConfig } from "@/theme/chakra-custom-system";

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

export const getSemanticValue = (tokenPath: string, mode: "light" | "dark") => {
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
    return typeof rawValue === "string"
      ? rawValue.replace(/\s*!important/g, "")
      : rawValue;
  }

  return "";
};
