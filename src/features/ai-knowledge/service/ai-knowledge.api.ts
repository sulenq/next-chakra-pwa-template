import {
  AiKnowledgeQuery,
  GetAiKnowledgeResponse,
} from "@/features/ai-knowledge/types/ai-knowledge.types";
import { http } from "@/shared/api/http";

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
