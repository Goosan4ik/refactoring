import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  sub: string;
  role: "ADMIN" | "USER";
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

export const getRoleFromToken = (token: string): "ADMIN" | "USER" | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};
