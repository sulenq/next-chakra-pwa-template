export interface LayananQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LayananTitleDesc {
  id: string;
  en: string;
}

export interface LayananItem {
  id: string | number;
  icon: string;
  title: LayananTitleDesc;
  description: LayananTitleDesc;
}

export interface LayananPagination {
  currentPage: number;
  limit: number;
  totalData: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetLayananResponse {
  status: number;
  message: string;
  data: LayananItem[];
}

export interface BaseLayananResponse {
  status: number;
  message: string;
  data?: any;
}
