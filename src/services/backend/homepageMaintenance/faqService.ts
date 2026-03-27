import http from "@/api/http";

export const fetchFAQList = () => http.get("/api/faq/page", { params: { page: 0, size: 100 } });

export const fetchFAQById = (_id: string) => http.get("/api/faq/page", { params: { page: 0, size: 100 } });

export const saveFAQ = (payload: unknown, id?: string) => http.post("/api/faq/admin/create", { ...(typeof payload === "object" && payload !== null ? payload : {}), id });
