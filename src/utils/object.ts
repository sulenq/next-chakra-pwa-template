export const emptyObject = (value: Object) => {
  if (!value) return true;

  if (typeof value === "object" && Object.keys(value).length === 0) return true;

  return false;
};
