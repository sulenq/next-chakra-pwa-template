import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { invalidateLayananList } from "@/features/layanan/queries/layanan-list.invalidate";
import {
  createLayanan,
  deleteLayanan,
  getLayanan,
  updateLayanan,
} from "@/features/layanan/services/layanan.api";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { BaseDataListParams, Pagination } from "@/types/global.types";
import { getMainViewTitle } from "@/utils/route";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericFormData } from "axios";
import { usePathname } from "next/navigation";

// -----------------------------------------------------------------

export const useLayananDataList = (params: BaseDataListParams) => {
  const query = useQuery({
    queryKey: queryKeys.layanan.list(params),
    queryFn: ({ signal }) => getLayanan(params, signal),
  });

  return {
    ...query,
    dataList: query.data?.data,
    pagination: {
      totalPage: 10,
      totalData: 112,
    } as Pagination,
    // pagination: query.data?.pagination as Pagination,
  };
};

export const useCreateLayanan = () => {
  const { t } = useLocaleStore();
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
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayananList();
    },
    onError: toast.onError,
  });
};

export const useUpdateLayanan = () => {
  const { t } = useLocaleStore();
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
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayananList();
    },
    onError: toast.onError,
  });
};

export const useDeleteLayanan = () => {
  const { t } = useLocaleStore();
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
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      invalidateLayananList();
    },
    onError: toast.onError,
  });
};
