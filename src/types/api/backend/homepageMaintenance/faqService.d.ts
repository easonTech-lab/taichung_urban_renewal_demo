import type { ApiPageData, ApiResponse } from "@/types/api/common";

export interface FAQApiItem {
  id: string | number;
  question: string;
  answer: string;
  isTop?: number;
  categoryName: string;
  publishDate?: string;
  statusLabel?: string;
  category?: string;
  status?: string;
  sortOrder?: number;
}

export interface FAQUpsertPayload {
  question: string;
  category: string;
  answer: string;
  status: "DRAFT" | "PUBLISHED" | "OFFLINE";
  sortOrder?: number;
  isTop?: number;
  internalRemark?: string;
  id?: string;
}

export type FAQListResponse = ApiResponse<ApiPageData<FAQApiItem>>;
