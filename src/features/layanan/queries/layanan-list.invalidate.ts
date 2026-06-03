import { queryClient } from "@/lib/tanstack-query/query.client";
import { queryKeys } from "@/lib/tanstack-query/query.keys";

export function invalidateLayananList() {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.layanan.all,
  });
}
