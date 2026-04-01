import type { ApiPageData, ApiResponse } from "@/types/api/common";

export interface PublicMessageApiItem {
  id: string | number;
  title: string;
  summary?: string;
  content?: string;
  newsCategory?: string;
  categoryLabel?: string;
  publishDate?: string;
  newsStatus?: string;
  statusLabel?: string;
}

export interface PublicMessageUpsertPayload {
  title: string;
  content: string;
  newsCategory: string;
  isTop?: number;
  newsStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  internalRemark?: string;
  id?: string;
}

export type PublicMessageListResponse = ApiResponse<ApiPageData<PublicMessageApiItem>>;
export type PublicMessageDetailResponse = ApiResponse<PublicMessageApiItem | null>;
