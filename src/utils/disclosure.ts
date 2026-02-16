export const disclosurePrefixId = "disclosure";

export const disclosureId = (id: string) => `${disclosurePrefixId}_${id}`;

// export function purgeDisclosureSearchParams() {
//   if (typeof window === "undefined") return;

//   const url = new URL(window.location.href);
//   let changed = false;

//   url.searchParams.forEach((_, key) => {
//     if (key.includes(disclosurePrefixId)) {
//       url.searchParams.delete(key);
//       changed = true;
//     }
//   });

//   if (changed) {
//     window.history.replaceState({}, "", url.toString());
//   }
// }
