import {
  AiKnowledgeQuery,
  GetAiKnowledgeResponse,
} from "@/features/layanan/types/layanan.types";
import { http } from "@/api/http";

export const getAiKnowledge = async (
  params?: AiKnowledgeQuery,
  signal?: AbortSignal,
) => {
  const res = await http.get<GetAiKnowledgeResponse>(
    "/api/admin/ai/knowledge/get",
    {
      params,
      signal,
    },
  );

  return res.data;
};
