const STORAGE_KEYS = {
  TOKEN: 'token',
} as const;

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  hasToken(): boolean {
    return this.getToken() !== null;
  },
};
