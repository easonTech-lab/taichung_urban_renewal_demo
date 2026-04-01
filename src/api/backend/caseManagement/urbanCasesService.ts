import http from "@/api/http";
import type { UrbanCaseListResponse } from "@/types/api/backend/caseManagement/urbanCasesService";

export const apiGetUrbanCasesList = (page = 0, size = 100) =>
  http.get<UrbanCaseListResponse>("/api/urban-cases", {
    params: { page, size },
  });
