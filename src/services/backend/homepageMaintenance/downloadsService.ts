import http from "@/api/http";

export const fetchDownloadsList = () => http.get("/api/download/list", { params: { page: 0, size: 100 } });

export const fetchDownloadById = (_id: string) => http.get("/api/download/list", { params: { page: 0, size: 100 } });

export const saveDownload = (payload: unknown, id?: string) => http.post("/api/admin/download/upload", { ...(typeof payload === "object" && payload !== null ? payload : {}), id });
