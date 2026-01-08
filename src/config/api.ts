export const API_CONFIG = {
  BASE_URL: 'http://91.142.94.183:8080',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
    LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  },
  FILMS: {
    LIST: `${API_CONFIG.BASE_URL}/films`,
    BY_ID: (id: string) => `${API_CONFIG.BASE_URL}/films/${id}`,
    REVIEWS: (id: string) => `${API_CONFIG.BASE_URL}/films/${id}/reviews`,
  },
  SESSIONS: {
    LIST: `${API_CONFIG.BASE_URL}/sessions`,
    BY_ID: (id: string) => `${API_CONFIG.BASE_URL}/sessions/${id}`,
    TICKETS: (id: string) => `${API_CONFIG.BASE_URL}/sessions/${id}/tickets`,
  },
  HALLS: {
    PLAN: (id: string) => `${API_CONFIG.BASE_URL}/halls/${id}/plan`,
  },
  TICKETS: {
    RESERVE: (id: string) => `${API_CONFIG.BASE_URL}/tickets/${id}/reserve`,
  },
  PURCHASES: {
    CREATE: `${API_CONFIG.BASE_URL}/purchases`,
  },
  PAYMENTS: {
    PROCESS: `${API_CONFIG.BASE_URL}/payments/process`,
  },
} as const;
