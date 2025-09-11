export const isEmptyArray = (value: any[] | null | undefined) => {
  if (!value) return true;

  if (Array.isArray(value) && value.length === 0) return true;

  return false;
};

export const subset = <T>(A: T[], B: T[]): boolean => {
  return A.every((value) => B.includes(value));
};
export const last = <T>(arr: T[], defaultValue?: T): T | undefined => {
  if (!arr || arr.length === 0) return defaultValue;
  return arr[arr.length - 1];
};
