export function getGridColumns(
  width: number,
  breakpoints: Record<number, number>
): number {
  let result = 3; // default columns

  // Iterate sorted breakpoints
  for (const bp of Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => a - b)) {
    if (width >= bp) {
      result = breakpoints[bp];
    }
  }

  return result;
}
