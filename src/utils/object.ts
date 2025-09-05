export const isEmptyObject = (value: object | null | undefined) => {
  if (!value) return true;

  if (typeof value === "object" && Object.keys(value).length === 0) return true;

  return false;
};
