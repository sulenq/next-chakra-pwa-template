import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const usePopDisclosure = (id: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const open = searchParams.get(id) === "1";

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);

      const query = params.toString();
      router.push(query ? `?${query}` : "", { scroll: false });
    },
    [router, searchParams],
  );

  const onOpen = useCallback(() => {
    updateParams((params) => params.set(id, "1"));
  }, [id, updateParams]);

  const onClose = useCallback(() => {
    updateParams((params) => params.delete(id));
  }, [id, updateParams]);

  return {
    open,
    onOpen,
    onClose,
  };
};
