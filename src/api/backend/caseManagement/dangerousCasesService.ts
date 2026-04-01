import http from "@/api/http";
import type { DangerousCaseListResponse } from "@/types/api/backend/caseManagement/dangerousCasesService";

export const apiGetDangerousCasesList = (page = 0, size = 100) =>
  http.get<DangerousCaseListResponse>("/api/dangerous-cases", {
    params: { page, size },
  });
