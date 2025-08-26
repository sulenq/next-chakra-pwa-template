export const formatTableName = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "_");
};
