import { ColorMode, RGB } from "@/shared/constants/types";

export function hexWithOpacity(hex: string, opacity: number): string {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + alpha;
}

export const rgbaToHex = ({ red, green, blue, alpha }: any) => {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  const hex = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

  if (alpha !== 1) {
    const alphaValue = Math.round(alpha * 255);
    return `${hex}${toHex(alphaValue)}`;
  }
  return hex;
};

export function useStatusBarColor(lightColor: string, darkColor: string) {
  const setStatusBarColor = () => {
    const html = document.documentElement;
    const colorScheme = html.style.getPropertyValue("color-scheme");
    const isDark = colorScheme.trim() === "dark";

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? darkColor : lightColor);
    } else {
      console.error('Elemen <meta name="theme-color"> tidak ditemukan.');
    }
  };

  return setStatusBarColor;
}

/**
 * Resolve a Chakra UI color token (CSS variable) into its computed color value (hex/rgb).
 *
 * This utility reads the final computed value from the browser using `getComputedStyle`.
 * It supports both token paths (e.g. "blue.500", "brand.solid") and direct CSS variable names.
 *
 * @param token - Chakra color token (e.g. "blue.500", "brand.solid")
 *                or a CSS variable name (e.g. "--chakra-colors-blue-500")
 *
 * @returns The computed color value as a string (e.g. "#3b82f6", "rgb(59, 130, 246)")
 *          Returns empty string when executed in a non-browser environment (SSR).
 *
 * @example
 * const color = getCssColor("blue.500")
 * // "#3b82f6"
 *
 * @example
 * const color = getCssColor("--chakra-colors-brand-solid")
 * // "rgb(...)"
 */
export function getCssColor(token: string): string {
  if (typeof window === "undefined") return "";

  const toKebab = (str: string) =>
    str
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[\s_.]+/g, "-")
      .toLowerCase();

  const varName = token.startsWith("--")
    ? token
    : `--chakra-colors-${toKebab(token)}`;

  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

/**
 * Parse any valid CSS color string into an RGB object.
 *
 * Supported formats:
 * - Hex: "#fff", "#ffffff"
 * - RGB/RGBA: "rgb(0,0,0)", "rgba(0,0,0,0.5)"
 * - CSS variables: "var(--xxx)"
 * - Named colors: "red", "blue"
 *
 * This function uses:
 * - Manual parsing for hex and rgb
 * - DOM fallback for CSS variables and unknown formats
 *
 * @param color - Any valid CSS color string
 * @returns RGB object { r, g, b }
 *
 * @example
 * parseColor("#18181b")
 * // { r: 24, g: 24, b: 27 }
 *
 * @example
 * parseColor("rgb(37,99,235)")
 * // { r: 37, g: 99, b: 235 }
 */
export function parseColor(color: string): RGB {
  // hex
  if (color.startsWith("#")) {
    let v = color.slice(1);

    if (v.length === 3) {
      v = v
        .split("")
        .map((c) => c + c)
        .join("");
    }

    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
    };
  }

  // rgb / rgba
  const rgbMatch = color.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    return {
      r: parseInt(rgbMatch[0], 10),
      g: parseInt(rgbMatch[1], 10),
      b: parseInt(rgbMatch[2], 10),
    };
  }

  // fallback (CSS var / named color)
  if (typeof window !== "undefined") {
    const el = document.createElement("div");
    el.style.color = color;
    document.body.appendChild(el);

    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);

    const match = computed.match(/\d+/g);

    if (match && match.length >= 3) {
      return {
        r: parseInt(match[0], 10),
        g: parseInt(match[1], 10),
        b: parseInt(match[2], 10),
      };
    }
  }

  return { r: 0, g: 0, b: 0 };
}

/**
 * Mix a base color with a subtle accent tint.
 *
 * Applies a small portion of the accent color into the base color.
 * Designed for creating tinted surfaces (e.g. dark UI backgrounds).
 *
 * @param base - Base color (e.g. "#181818")
 * @param accent - Accent color (e.g. "#2563eb")
 * @param intensity - Blend strength (0–1). Recommended: 0.02–0.08
 *
 * @returns Mixed color in `rgb(r, g, b)` format
 *
 * @example
 * mixAccentTint("#181818", "#2563eb", 0.05)
 * // "rgb(24, 25, 28)"
 */
function mixAccentTint(
  base: string,
  accent: string,
  intensity: number,
): string {
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

  const hexToRgb = (hex: string) => {
    let v = hex.replace("#", "");

    if (v.length === 3) {
      v = v
        .split("")
        .map((c) => c + c)
        .join("");
    }

    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b]
      .map((x) => {
        const v = Math.max(0, Math.min(255, x));
        return v.toString(16).padStart(2, "0");
      })
      .join("")}`;

  const t = clamp(intensity);

  const b = hexToRgb(base);
  const a = hexToRgb(accent);

  const r = Math.round(b.r + (a.r - b.r) * t);
  const g = Math.round(b.g + (a.g - b.g) * t);
  const b2 = Math.round(b.b + (a.b - b.b) * t);

  return rgbToHex(r, g, b2);
}

export const getBodyColor = (colorPalette: string, colorMode: ColorMode) => {
  const bodyLight = "#fdfdfd";
  const bodyDark = "#171717";
  const bodyColorHex = colorMode === "dark" ? bodyDark : bodyLight;
  const primaryColorHex = getCssColor(`${colorPalette}.solid`);
  const bg = mixAccentTint(bodyColorHex, primaryColorHex, 0.01);

  return bg;
};
