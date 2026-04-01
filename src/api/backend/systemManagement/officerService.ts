import http from "@/api/http";
import type { OfficerDetailResponse, OfficerListResponse, OfficerUpsertPayload } from "@/types/api/backend/systemManagement/officerService";

export const apiGetOfficerList = () => http.get<OfficerListResponse>("/api/officers");

export const apiGetOfficerById = (id: string) => http.get<OfficerDetailResponse>(`/api/officers/${id}`);

export const apiPostOfficer = (payload: OfficerUpsertPayload) => http.post("/api/officers", payload);

export const apiPutOfficer = (payload: OfficerUpsertPayload, id: string) => http.put(`/api/officers/${id}`, payload);
