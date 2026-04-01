import type { ApiPageData } from "@/types/api/common";

export interface DangerousCaseApiItem {
  id: number | string;
  caseName: string;
  stage: string;
  status: string;
  updatedAt?: string;
}

export type DangerousCaseListResponse = ApiPageData<DangerousCaseApiItem>;
