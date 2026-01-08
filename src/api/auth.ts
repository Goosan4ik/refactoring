import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { storage } from "../utils/storage";

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
  const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, data, {
    headers: { "Content-Type": "application/json" },
  });
  storage.setToken(response.data.accessToken);
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, data, {
    headers: { "Content-Type": "application/json" },
  });
  storage.setToken(response.data.accessToken);
  return response.data;
}

export function logout() {
  storage.removeToken();
}

export function getCurrentUser() {
  const token = storage.getToken();
  return token ? { accessToken: token } : null;
}
