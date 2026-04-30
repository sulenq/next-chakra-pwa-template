export interface AiKnowledgeQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AiKnowledgeItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiKnowledgePagination {
  currentPage: number;
  limit: number;
  totalData: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAiKnowledgeResponse {
  status: number;
  message: string;
  data: {
    data: AiKnowledgeItem[];
    pagination: AiKnowledgePagination;
  };
}
