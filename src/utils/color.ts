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
