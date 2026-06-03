import { LangObject } from "@/types/global.types";

export type LayananItem = {
  id: string;
  icon: string;
  title: LangObject;
  description: LangObject;
};

export type GetLayananResponseData = {
  count: number;
  data: LayananItem[];
};
