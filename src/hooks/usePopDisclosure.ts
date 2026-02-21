import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const usePopDisclosure = (id: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const open = useMemo(() => {
    return searchParams.get(id) === "1";
  }, [searchParams, id]);

  const onOpen = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(id, "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [id, router, searchParams]);

  const onClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(id);
    const query = params.toString();
    router.push(query ? `?${query}` : "", { scroll: false });
  }, [id, router, searchParams]);

  return {
    open,
    onOpen,
    onClose,
  };
};

export default usePopDisclosure;
