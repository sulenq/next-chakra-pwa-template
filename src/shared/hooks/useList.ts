import { useEffect, useRef, useState } from "react";
import { useRequest } from "./useRequest";

export const useList = <T, Q>({
  fetcher,
  initialQuery,
}: {
  fetcher: (q: Q, signal?: AbortSignal) => Promise<T>;
  initialQuery: Q;
}) => {
  const { execute, abort } = useRequest<T>();

  const [data, setData] = useState<T | null>(null);
  const [query, setQuery] = useState<Q>(initialQuery);

  const first = useRef(true);

  const fetchData = async (q: Q) => {
    if (first.current) {
      first.current = false;
    }

    const res = await execute((signal) => fetcher(q, signal));
    setData(res);
  };

  useEffect(() => {
    fetchData(query);
  }, [query]);

  const updateQuery = (patch: Partial<Q>) =>
    setQuery((prev) => ({ ...prev, ...patch }));

  const refetch = () => fetchData(query);

  return {
    data,
    query,
    setQuery,
    updateQuery,
    refetch,
    abort,
  };
};
