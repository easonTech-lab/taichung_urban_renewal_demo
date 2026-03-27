import http from "@/api/http";

export const fetchCaseStatisticsList = () => http.get("/api/statistics/admin/list");

export const fetchCaseStatisticById = (_id: string) => http.get("/api/statistics/admin/list");

export const saveCaseStatistic = (payload: unknown, id?: string) => (id ? http.put("/api/statistics/admin/update", payload) : http.post("/api/statistics/admin/add", payload));
