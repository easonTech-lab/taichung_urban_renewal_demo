import type { ApiResponse } from "@/types/api/common";

export interface OfficerApiItem {
  id: string | number;
  index?: number;
  name: string;
  gender: string;
  title: string;
  education: string[];
  email?: string;
  phone?: string;
  address?: string;
}

export interface OfficerUpsertPayload {
  id?: string;
  name: string;
  gender: string;
  title: string;
  education: string[];
  email?: string;
  phone?: string;
  address?: string;
}

export type OfficerListResponse = ApiResponse<OfficerApiItem[]>;
export type OfficerDetailResponse = ApiResponse<OfficerApiItem | null>;
