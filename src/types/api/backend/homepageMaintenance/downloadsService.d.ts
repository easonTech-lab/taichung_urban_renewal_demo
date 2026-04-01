import type { ApiPageData, ApiResponse } from "@/types/api/common";

export interface DownloadApiItem {
  id: string | number;
  fileName: string;
  fileSize: string;
  filePath: string;
  status: "PUBLISHED" | "OFFLINE";
  statusDisplayName: string;
  createTime: string;
  category?: string;
  categoryLabel?: string;
}

export interface DownloadUpsertPayload {
  title: string;
  category: string;
  text: string;
  files: File[];
  status: "draft" | "published";
  id?: string;
}

export type DownloadsListResponse = ApiResponse<ApiPageData<DownloadApiItem>>;
