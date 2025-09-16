export const profilerCallback = (
  id: string,
  phase: "mount" | "update",
  actualDuration: number
) => {
  console.log(
    `[Profiler] ${id} took ${actualDuration.toFixed(2)}ms to render (${phase})`
  );
};

export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay?: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay || 300);
  };
}
