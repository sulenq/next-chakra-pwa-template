export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export const profilerCallback = (
  id: string,
  phase: "mount" | "update",
  actualDuration: number
) => {
  console.log(
    `[Profiler] ${id} took ${actualDuration.toFixed(2)}ms to render (${phase})`
  );
};
