import { http } from "@/api/http";
import {
  BaseLayananResponse,
  GetLayananResponse,
  LayananQuery,
} from "@/features/layanan/types/layanan.types";
import { GenericFormData } from "axios";

export const getLayanan = async (
  params?: LayananQuery,
  signal?: AbortSignal,
) => {
  const res = await http.get<GetLayananResponse>(
    "/api/admin/da/services/index",
    {
      params,
      signal,
    },
  );

  return res.data;
};

export const createLayanan = async (data: FormData) => {
  const res = await http.post<BaseLayananResponse>(
    "/api/admin/da/services/create",
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

export const updateLayanan = async (
  id: string | number,
  data: GenericFormData,
) => {
  const res = await http.patch<BaseLayananResponse>(
    `/api/admin/da/services/update/${id}`,
    data,
  );
  return res.data;
};

export const deleteLayanan = async (ids: (string | number)[]) => {
  const res = await http.delete<BaseLayananResponse>(
    "/api/admin/da/services/delete",
    {
      data: { deleteIds: ids },
    },
  );
  return res.data;
};
