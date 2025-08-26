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
