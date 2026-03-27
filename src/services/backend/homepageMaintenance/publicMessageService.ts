import http from "@/api/http";

export const fetchPublicMessageList = () => http.get("/api/news/list", { params: { page: 0, size: 100 } });

export const fetchPublicMessageById = (id: string) => http.get(`/api/news/${id}`);

export const savePublicMessage = (payload: unknown, id?: string) => http.post("/api/news/admin/create", { ...(typeof payload === "object" && payload !== null ? payload : {}), id });
