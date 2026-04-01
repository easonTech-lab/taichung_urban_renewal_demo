import http from "@/api/http";
import type { PublicMessageDetailResponse, PublicMessageListResponse, PublicMessageUpsertPayload } from "@/types/api/backend/homepageMaintenance/publicMessageService";

export const apiGetPublicMessageList = () => http.get<PublicMessageListResponse>("/api/news/list", { params: { page: 0, size: 100 } });

export const apiGetPublicMessageById = (id: string) => http.get<PublicMessageDetailResponse>(`/api/news/${id}`);

export const apiPostPublicMessage = (payload: PublicMessageUpsertPayload) => http.post("/api/news/admin/create", payload);

export const apiPutPublicMessage = (payload: PublicMessageUpsertPayload) => http.post("/api/news/admin/create", payload);
