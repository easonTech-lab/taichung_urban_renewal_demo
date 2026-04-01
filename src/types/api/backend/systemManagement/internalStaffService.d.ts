import type { ApiResponse } from "@/types/api/common";

export interface SystemUserApiItem {
  id: number | string;
  username: string;
  role: "ADMIN" | "USER";
  realName: string;
  email: string;
  status: number;
  isInitialPassword: number;
  createTime: string;
}

export type SystemUserListResponse = ApiResponse<SystemUserApiItem[]>;
