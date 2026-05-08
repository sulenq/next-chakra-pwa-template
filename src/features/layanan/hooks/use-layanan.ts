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
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericFormData } from "axios";

// -----------------------------------------------------------------

export const useLayananQuery = (params: BaseDataListParams) => {
  const query = useQuery({
    queryKey: queryKeys.layanan.list(params),
    queryFn: ({ signal }) => getLayanan(params, signal),
  });

  return {
    ...query,
    dataList: query.data?.data,
  };
};

export const useCreateLayananMutation = () => {
  const toast = mutationToastHandlers("layanan-create");

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
  const toast = mutationToastHandlers("layanan-update");

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
  const toast = mutationToastHandlers("layanan-delete");

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
