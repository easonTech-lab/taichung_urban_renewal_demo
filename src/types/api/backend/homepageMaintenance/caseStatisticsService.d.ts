import type { ApiResponse } from "@/types/api/common";

export interface CaseStatisticApiItem {
  id: string | number;
  year: number;
  type: "URBAN_RENEWAL" | "DANGEROUS_OLD";
  caseCount: number;
  accumulatedCount: number;
  growthStatus: {
    description: "成長" | "降低" | "持平";
    color: string;
  };
}

export interface CaseStatisticUpsertPayload {
  id?: string | number;
  year: number;
  type: "URBAN_RENEWAL" | "DANGEROUS_OLD";
  caseCount: number;
}

export type CaseStatisticsListResponse = ApiResponse<CaseStatisticApiItem[]>;
