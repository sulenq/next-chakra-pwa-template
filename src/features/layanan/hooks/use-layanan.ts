import { useLocale } from "@/contexts/use-locale-context";
import { invalidateLayanan } from "@/features/layanan/query/layanan.invalidate";
import {
  createLayanan,
  deleteLayanan,
  getLayanan,
  updateLayanan,
} from "@/features/layanan/service/layanan.api";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { BaseDataListParams } from "@/types/global.types";
import { getMainViewTitle } from "@/utils/route";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericFormData } from "axios";
import { usePathname } from "next/navigation";

// -----------------------------------------------------------------

export const useLayananQuery = (params: BaseDataListParams) => {
  const query = useQuery({
    queryKey: queryKeys.layanan.list(params),
    queryFn: ({ signal }) => getLayanan(params, signal),
  });

  return {
    ...query,
    dataList: query.data?.data,
    // pagination: query.data?.pagination as Pagination,
  };
};

export const useCreateLayananMutation = () => {
  const { t } = useLocale();
  const pathname = usePathname();
  const mainViewTitle = getMainViewTitle(pathname, t);

  const toast = mutationToastHandlers("layanan-create", {
    loadingMessage: {
      title: `${t.add} ${mainViewTitle}`,
    },
    successMessage: {
      title: `${t.add} ${mainViewTitle} ${t.success}`,
    },
  });

  return useMutation({
    mutationFn: (data: GenericFormData) => createLayanan(data),
    onMutate: toast.onMutate,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayanan();
    },
    onError: toast.onError,
  });
};

export const useUpdateLayananMutation = () => {
  const { t } = useLocale();
  const pathname = usePathname();
  const mainViewTitle = getMainViewTitle(pathname, t);

  const toast = mutationToastHandlers("layanan-update", {
    loadingMessage: {
      title: `${t.update} ${mainViewTitle}`,
    },
    successMessage: {
      title: `${t.update} ${mainViewTitle} ${t.success}`,
    },
  });

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: GenericFormData;
    }) => updateLayanan(id, data),
    onMutate: toast.onMutate,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayanan();
    },
    onError: toast.onError,
  });
};

export const useDeleteLayananMutation = () => {
  const { t } = useLocale();
  const pathname = usePathname();
  const mainViewTitle = getMainViewTitle(pathname, t);

  const toast = mutationToastHandlers("layanan-delete", {
    loadingMessage: {
      title: `${t.delete_} ${mainViewTitle}`,
    },
    successMessage: {
      title: `${t.delete_} ${mainViewTitle} ${t.success}`,
    },
  });

  return useMutation({
    mutationFn: (ids: (string | number)[]) => deleteLayanan(ids),
    onMutate: toast.onMutate,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayanan();
    },
    onError: toast.onError,
  });
};
