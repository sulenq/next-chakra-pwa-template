import { http } from "@/api/http";
import { LayananItem } from "@/features/layanan/types/layanan.types";
import { BaseDataListParams, BaseResponse } from "@/types/global.types";
import { GenericFormData } from "axios";

// -----------------------------------------------------------------

const BASE_ENDPOINT = "/api/admin/da/services";

// -----------------------------------------------------------------

export const getLayanan = async (
  params?: BaseDataListParams,
  signal?: AbortSignal,
) => {
  const res = await http.get<BaseResponse<LayananItem[]>>(
    `${BASE_ENDPOINT}/index`,
    {
      params,
      signal,
    },
  );
  return res.data;
};

export const createLayanan = async (data: GenericFormData) => {
  const res = await http.post<BaseResponse>(`${BASE_ENDPOINT}/create`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateLayanan = async (
  id: string | number,
  data: GenericFormData,
) => {
  const res = await http.patch<BaseResponse>(
    `${BASE_ENDPOINT}/update/${id}`,
    data,
  );
  return res.data;
};

export const deleteLayanan = async (ids: (string | number)[]) => {
  const res = await http.delete<BaseResponse>(`${BASE_ENDPOINT}/delete`, {
    data: { deleteIds: ids },
  });
  return res.data;
};
