import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// -----------------------------------------------------------------

export const usePopDisclosure = (id: string) => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Constants
  const open = searchParams.get(id) === "1";

  // Utils
  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      router.push(url, { scroll: false });
    },
    [router, searchParams, pathname],
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
