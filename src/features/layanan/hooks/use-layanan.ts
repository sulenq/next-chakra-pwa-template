import {
  createLayanan,
  deleteLayanan,
  getLayanan,
  updateLayanan,
} from "@/features/layanan/service/layanan.api";
import { LayananQuery } from "@/features/layanan/types/layanan.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GenericFormData } from "axios";

export const LAYANAN_QUERY_KEY = ["layanan"];

export const useLayananQuery = (params?: LayananQuery) => {
  return useQuery({
    queryKey: [...LAYANAN_QUERY_KEY, params],
    queryFn: ({ signal }) => getLayanan(params, signal),
  });
};

export const useCreateLayananMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createLayanan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAYANAN_QUERY_KEY });
    },
  });
};

export const useUpdateLayananMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: GenericFormData;
    }) => updateLayanan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAYANAN_QUERY_KEY });
    },
  });
};

export const useDeleteLayananMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: (string | number)[]) => deleteLayanan(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAYANAN_QUERY_KEY });
    },
  });
};
