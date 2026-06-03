export const isEmptyObject = (value: object | null | undefined) => {
  if (!value) return true;

  if (typeof value === "object" && Object.keys(value).length === 0) return true;

  return false;
};

export function isDeepEmptyObject(value: any): boolean {
  if (value == null) return true;

  if (typeof value === "string") return value.trim().length === 0;

  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    return value.every(isDeepEmptyObject);
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return true;
    return keys.every((k) => isDeepEmptyObject(value[k]));
  }

  return false;
}
