import { useEffect, useRef, useState } from "react";
import useRequest from "@/hooks/useRequest";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useLoadingBar } from "@/context/useLoadingBar";

interface Props<T> {
  initialData?: T;
  dummyData?: T;
  url?: string;
  method?: string;
  payload?: any;
  params?: any;
  dependencies?: any[];
  conditions?: boolean;
  noRt?: boolean;
  initialPage?: number;
  initialLimit?: number;
  intialOffset?: number;
  dataResource?: boolean;
  // withLimit?: boolean;
  // withPagination?: boolean;
}

const useDataState = <T = any>(props: Props<T>) => {
  // Props
  const {
    initialData,
    dummyData,
    payload,
    params,
    url,
    method,
    dependencies = [],
    conditions = true,
    noRt = false,
    initialPage = 1,
    initialLimit = 15,
    intialOffset = 0,
    dataResource = true,
  } = props;

  // Contexts
  const setLoadingBar = useLoadingBar((s) => s.setLoadingBar);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestUrlRef = useRef<string | null>(null);

  // States
  const [data, setData] = useState<T | undefined>(dummyData || initialData);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(intialOffset);
  const [pagination, setPagination] = useState<any>(undefined);
  const { rt } = useRenderTrigger();
  const { req, response, loading, error, status } = useRequest({
    id: url || "data-state",
    showLoadingToast: false,
    showErrorToast: true,
    showSuccessToast: false,
  });
  const payloadData = {
    ...payload,
    limit,
    page,
  };
  const offsetData = {
    limit,
    page,
  };
  const baseConfig = {
    url: url,
    method,
    data: payloadData,
    params: { ...(dataResource ? offsetData : {}), ...params },
  };

  // Utils
  function makeRequest() {
    if (!url) return;

    latestUrlRef.current = url;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const config = {
      ...baseConfig,
      signal: abortController.signal,
    };

    const currentUrl = url;

    Promise.resolve().then(() => {
      if (latestUrlRef.current !== currentUrl) {
        return; // Skip if outdated
      }

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            setPagination(r?.data?.data?.pagination);
            setInitialLoading(false);
            if (dummyData) {
              setData(dummyData);
            } else {
              setData(
                dataResource
                  ? Array.isArray(r?.data?.data)
                    ? r?.data?.data
                    : r?.data?.data?.data
                  : r?.data?.data
              );
            }
          },
          onError: () => {
            setInitialLoading(false);
          },
        },
      });
    });
  }
  function loadMore() {
    setLoadingLoadMore(true);

    const config = {
      ...baseConfig,
    };
    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newData = data
            ? [...(data as any[]), ...r?.data?.data]
            : r?.data?.data;
          setData(newData);
          setPagination(r?.data?.pagination);
          setLoadingLoadMore(false);
        },
      },
    });
  }
  function onRetry() {
    setInitialLoading(true);
    makeRequest();
  }

  // start request via useEffect
  useEffect(() => {
    if (!conditions || !url) return;

    const timeout = setTimeout(() => {
      makeRequest();
    }, 50);

    return () => {
      clearTimeout(timeout);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    conditions,
    url,
    page,
    limit,
    ...(noRt ? [] : [rt]),
    ...(dependencies || []),
  ]);

  // set initial limit
  useEffect(() => {
    setLimit(initialLimit);
  }, [initialLimit]);

  // initialLoading = true when no url
  useEffect(() => {
    if (!url) {
      setInitialLoading(false);
    }
  }, [url]);

  // trigger loading bar on initialLoading | loading  is true
  useEffect(() => {
    setLoadingBar(initialLoading || loading);
  }, [loading, initialLoading]);

  return {
    makeRequest,
    onRetry,
    data,
    setData,
    initialLoading,
    setInitialLoading,
    loading,
    error,
    loadMore,
    loadingLoadMore,
    setLoadingLoadMore,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    offset,
    setOffset,
    response,
    status,
  };
};

export default useDataState;
