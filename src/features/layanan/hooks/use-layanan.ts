import {
  createLayanan,
  deleteLayanan,
  getLayanan,
  updateLayanan,
} from "@/features/layanan/service/layanan.api";
import { LayananQuery } from "@/features/layanan/types/layanan.types";
import { invalidateLayanan } from "@/lib/tanstack-query/invalidate";
import { queryKeys } from "@/lib/tanstack-query/query-keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericFormData } from "axios";

export const useLayananQuery = (params?: LayananQuery) => {
  return useQuery({
    queryKey: queryKeys.layanan.list(params),
    queryFn: ({ signal }) => getLayanan(params, signal),
  });
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
