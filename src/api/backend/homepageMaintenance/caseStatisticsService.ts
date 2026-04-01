import http from "@/api/http";
import type { CaseStatisticsListResponse, CaseStatisticUpsertPayload } from "@/types/api/backend/homepageMaintenance/caseStatisticsService";

export const apiGetCaseStatisticsList = () => http.get<CaseStatisticsListResponse>("/api/statistics/admin/list");

export const apiGetCaseStatisticById = (_id: string) => http.get<CaseStatisticsListResponse>("/api/statistics/admin/list");

export const apiPostCaseStatistic = (payload: CaseStatisticUpsertPayload) => http.post("/api/statistics/admin/add", payload);

export const apiPutCaseStatistic = (payload: CaseStatisticUpsertPayload) => http.put("/api/statistics/admin/update", payload);
