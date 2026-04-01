import http from "@/api/http";
import type { SystemUserListResponse } from "@/types/api/backend/systemManagement/internalStaffService";

export const apiGetHandlerAccountList = () => http.get<SystemUserListResponse>("/api/system/user/list");
