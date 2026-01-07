import { jwtDecode } from "jwt-decode";

const TOKEN_STORAGE_KEY = "token";

export type UserRole = "ADMIN" | "USER";

type TokenPayload = {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getAuthorizationHeader(): { Authorization: string } | undefined {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function getTokenRole(token: string): UserRole | null {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role;
  } catch {
    return null;
  }
}
