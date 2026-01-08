import apiClient from "../utils/apiClient";
import { setToken, removeToken } from "../utils/tokenUtils";

export interface AuthResponse {
  accessToken: string;
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "MALE" | "FEMALE";
}): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/register", data);
  setToken(response.data.accessToken);
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/login", data);
  setToken(response.data.accessToken);
  return response.data;
}

export function logout() {
  removeToken();
}

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  return token ? { accessToken: token } : null;
}
