import axios from "axios";
import { API_BASE_URL } from "../constants/app";
import { getToken } from "../auth/token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
