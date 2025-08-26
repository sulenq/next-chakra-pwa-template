export const calculatePercentage = (
  items: any[],
  options: { valueKey: string }
): any[] => {
  const { valueKey } = options;
  const total = items.reduce((sum, item) => sum + item[valueKey], 0);

  return items.map((item) => ({
    ...item,
    percentage: ((item[valueKey] / total) * 100).toFixed(2) + "%",
  }));
};
