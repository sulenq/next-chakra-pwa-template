export const parseNumber = (
  numString: string | undefined | null
): number | null => {
  if (!numString) return null;

  const cleanedString = numString.replace(/\./g, "").replace(",", ".");

  const parsedNumber = parseFloat(cleanedString);
  return isNaN(parsedNumber) ? null : parsedNumber;
};

export function createNumberSequence(
  numberStart: number,
  numberEnd: number
): number[] {
  const step = numberStart <= numberEnd ? 1 : -1;
  const result: number[] = [];

  for (
    let i = numberStart;
    step > 0 ? i <= numberEnd : i >= numberEnd;
    i += step
  ) {
    result.push(i);
  }

  return result;
}

export const getPercentage = (
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

export const getDigit = (num: number): number => {
  return Math.abs(num).toString().length;
};
