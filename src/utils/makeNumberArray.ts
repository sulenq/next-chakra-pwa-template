interface Params {
  length: number;
}

export function makeNumberArray({ length }: Params): number[] {
  return Array.from({ length: length }, (_, i) => i + 1);
}
