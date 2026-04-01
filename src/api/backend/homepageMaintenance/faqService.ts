import http from "@/api/http";
import type { FAQListResponse, FAQUpsertPayload } from "@/types/api/backend/homepageMaintenance/faqService";

export const apiGetFAQList = () => http.get<FAQListResponse>("/api/faq/page", { params: { page: 0, size: 100 } });

export const apiGetFAQById = (_id: string) => http.get<FAQListResponse>("/api/faq/page", { params: { page: 0, size: 100 } });

export const apiPostFAQ = (payload: FAQUpsertPayload) => http.post("/api/faq/admin/create", payload);

export const apiPutFAQ = (payload: FAQUpsertPayload) => http.post("/api/faq/admin/create", payload);
