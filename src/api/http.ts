import axios, { AxiosHeaders, type AxiosError, type AxiosInstance } from "axios";

const useMock = import.meta.env.VITE_USE_MOCK === "true";
const baseURL = useMock ? "" : (import.meta.env.VITE_API_BASE_URL ?? "");

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    const headers = config.headers ?? new AxiosHeaders();
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

export type { AxiosError };
export default http;
