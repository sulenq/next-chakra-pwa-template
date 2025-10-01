export const disclosureIdPrefix = "disclosure";

export const disclosureId = (id: string) => `${disclosureIdPrefix}-${id}`;

export function purgeDisclosureSearchParams() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  let changed = false;

  url.searchParams.forEach((_, key) => {
    if (key.includes(disclosureIdPrefix)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });

  if (changed) {
    window.history.replaceState({}, "", url.toString());
  }
}
