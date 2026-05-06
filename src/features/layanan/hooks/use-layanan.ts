import { invalidateLayanan } from "@/features/layanan/query/layanan.invalidate";
import {
  createLayanan,
  deleteLayanan,
  getLayanan,
  updateLayanan,
} from "@/features/layanan/service/layanan.api";
import { queryKeys } from "@/lib/tanstack-query/query-keys";
import { BaseDataListParams } from "@/types/global.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericFormData } from "axios";

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
  return useMutation({
    mutationFn: (data: GenericFormData) => createLayanan(data),
    onSuccess: () => {
      invalidateLayanan();
    },
  });
};

export const useUpdateLayananMutation = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: GenericFormData;
    }) => updateLayanan(id, data),
    onSuccess: () => {
      invalidateLayanan();
    },
  });
};

export const useDeleteLayananMutation = () => {
  return useMutation({
    mutationFn: (ids: (string | number)[]) => deleteLayanan(ids),
    onSuccess: () => {
      invalidateLayanan();
    },
  });
};
