import http from "@/api/http";
import type { DownloadsListResponse, DownloadUpsertPayload } from "@/types/api/backend/homepageMaintenance/downloadsService";

export const apiGetDownloadsList = () => http.get<DownloadsListResponse>("/api/download/list", { params: { page: 0, size: 100 } });

export const apiGetDownloadById = (_id: string) => http.get<DownloadsListResponse>("/api/download/list", { params: { page: 0, size: 100 } });

export const apiPostDownload = (payload: DownloadUpsertPayload) => http.post("/api/admin/download/upload", payload);

export const apiPutDownload = (payload: DownloadUpsertPayload) => http.post("/api/admin/download/upload", payload);
