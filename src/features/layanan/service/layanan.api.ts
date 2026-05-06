import { http } from "@/api/http";
import { GetLayananResponse } from "@/features/layanan/types/layanan.types";
import { BaseDataListParams, BaseResponse } from "@/types/global.types";
import { GenericFormData } from "axios";

export const getLayanan = async (
  params?: BaseDataListParams,
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

export const createLayanan = async (data: GenericFormData) => {
  const res = await http.post<BaseResponse>(
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
  const res = await http.patch<BaseResponse>(
    `/api/admin/da/services/update/${id}`,
    data,
  );
  return res.data;
};

export const deleteLayanan = async (ids: (string | number)[]) => {
  const res = await http.delete<BaseResponse>("/api/admin/da/services/delete", {
    data: { deleteIds: ids },
  });
  return res.data;
};
