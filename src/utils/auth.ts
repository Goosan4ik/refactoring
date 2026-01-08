import { jwtDecode } from 'jwt-decode';
import { storage } from './storage';

interface TokenPayload {
  sub: string;
  role: 'ADMIN' | 'USER';
  exp: number;
  iat: number;
}

export const authUtils = {
  decodeToken(token: string): TokenPayload {
    return jwtDecode<TokenPayload>(token);
  },

  getRoleFromToken(token: string): 'ADMIN' | 'USER' | null {
    try {
      const decoded = this.decodeToken(token);
      return decoded.role;
    } catch {
      return null;
    }
  },

  getCurrentRole(): 'ADMIN' | 'USER' | null {
    const token = storage.getToken();
    if (!token) return null;
    return this.getRoleFromToken(token);
  },

  requireAuth(onError?: () => void): boolean {
    if (!storage.hasToken()) {
      if (onError) {
        onError();
      } else {
        alert('Сначала авторизуйтесь');
      }
      return false;
    }
    return true;
  },

  requireAuthWithReturn<T>(onError: () => T): T | true {
    if (!storage.hasToken()) {
      return onError();
    }
    return true;
  },
};
