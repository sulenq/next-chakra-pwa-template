import { useCallback, useRef, useState } from "react";

export const useRequest = <T = any>() => {
  const controllerRef = useRef<AbortController | null>(null);
  const lastFnRef = useRef<((signal?: AbortSignal) => Promise<T>) | null>(null);

  const [state, setState] = useState({
    loading: false,
    error: null as any,
    data: null as T | null,
    status: null as number | null,
  });

  const patch = (p: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...p }));

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const execute = useCallback(
    async (fn: (signal?: AbortSignal) => Promise<T>) => {
      lastFnRef.current = fn;

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        patch({ loading: true, error: null });

        const res: any = await fn(controller.signal);

        patch({
          loading: false,
          data: res,
          status: res?.status ?? 200,
        });

        return res;
      } catch (err: any) {
        if (err?.name === "AbortError") return;

        patch({
          loading: false,
          error: err,
          status: err?.response?.status,
        });

        throw err;
      }
    },
    [],
  );

  const retry = useCallback(() => {
    if (!lastFnRef.current) return;
    return execute(lastFnRef.current);
  }, [execute]);

  return {
    ...state,
    execute,
    retry,
    abort,
  };
};
