import http from "@/api/http";

export const fetchOfficerList = () => http.get("/api/officers");

export const fetchOfficerById = (id: string) => http.get(`/api/officers/${id}`);

export const saveOfficer = (payload: unknown, id?: string) => (id ? http.put(`/api/officers/${id}`, payload) : http.post("/api/officers", payload));
