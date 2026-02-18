import useLang from "@/context/useLang";

export function capitalize(string: string) {
  if (typeof string !== "string" || string.length === 0) return "";

  const firstChar = string.charAt(0);
  // Only capitalize if first char is not already uppercase
  return firstChar === firstChar.toUpperCase()
    ? string
    : firstChar.toUpperCase() + string.slice(1);
}

export const capitalizeWords = (str: string): string => {
  if (!str) return "";

  return str
    .split(" ")
    .map((word) => {
      if (!word) return word;

      const firstChar = word[0];
      // Only capitalize if first char is not uppercase
      return firstChar === firstChar.toUpperCase()
        ? word
        : firstChar.toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const interpolateString = (
  text: string,
  variables: Record<string, string | number>,
) => {
  let result = text;

  Object.keys(variables).forEach((variable) => {
    const placeholder = `\${${variable}}`;
    result = result.replace(placeholder, variables[variable].toString());
  });

  return result;
};

export const pluckString = (
  obj?: Record<string, any>,
  key?: string | null,
): string => {
  if (!obj || !key) return "";

  return key.split(".").reduce<any>((acc, curr) => {
    if (acc && typeof acc === "object" && curr in acc) {
      return acc[curr];
    }
    return undefined;
  }, obj);
};

export const maskEmail = (email?: string) => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "";
  }

  const [local, domain] = email.split("@");
  if (local.length <= 3) {
    return `${local}@${domain}`;
  }
  const visible = local.slice(0, 3);
  const stars = "*".repeat(local.length - 3);

  return `${visible}${stars}@${domain}`;
};

export const getL = () => {
  return useLang.getState().l;
};
