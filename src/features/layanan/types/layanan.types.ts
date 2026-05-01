import { LangObject } from "@/types/global.types";

export interface LayananPrams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LayananItem {
  id: string;
  icon: string;
  title: LangObject;
  description: LangObject;
}

export interface GetLayananResponse {
  status: number;
  message: string;
  data: LayananItem[];
}
