// ==================== API КОНФИГУРАЦИЯ ====================
export const API_BASE_URL = "http://91.142.94.183:8080";

export const API_ENDPOINTS = {
  SESSIONS: "/sessions",
  HALLS: "/halls",
  TICKETS: "/tickets",
  PURCHASES: "/purchases",
  PAYMENTS: "/payments/process",
  FILMS: "/films",
  REVIEWS: "/reviews",
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
} as const;

// ==================== ПАГИНАЦИЯ ====================
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  SESSIONS_PAGE_SIZE: 100, // Размер страницы для сеансов
  PURCHASES_PAGE_SIZE: 20,  // Размер страницы для покупок
  FILMS_PAGE_SIZE: 20,      // Размер страницы для фильмов
} as const;

// ==================== UI РАЗМЕРЫ (ПИКСЕЛИ) ====================
export const UI_SIZES = {
  SEAT_WIDTH: "50px",           // Ширина кнопки места
  SEAT_HEIGHT: "50px",          // Высота кнопки места
  LEGEND_ITEM_WIDTH: "20px",    // Ширина квадратика в легенде
  LEGEND_ITEM_HEIGHT: "20px",   // Высота квадратика в легенде
  SIDEBAR_WIDTH: "250px",       // Ширина боковой панели
  POSTER_WIDTH: "200px",        // Ширина постера фильма
} as const;

// ==================== UI ЦВЕТА ====================
export const UI_COLORS = {
  VIP_COLOR: "#0d6efd",                    // Цвет VIP мест (синий)
  VIP_BORDER: "1px solid #0d6efd",        // Рамка VIP мест
  DEFAULT_COLOR: "#fff",                   // Цвет обычных мест (белый)
  DEFAULT_BORDER: "1px solid #fff",       // Рамка обычных мест
  DARK_BG: "#1f1f1f",                     // Темный фон
} as const;

// ==================== UI ОТСТУПЫ (ПИКСЕЛИ) ====================
export const UI_GRID = {
  GAP_BETWEEN_SEATS: "5px",        // Отступ между местами в ряду
  GAP_BETWEEN_CATEGORIES: "10px",  // Отступ между элементами легенды
  GAP_BETWEEN_ROWS: "10px",        // Отступ между рядами
} as const;

// ==================== ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ====================
export const DEFAULT_VALUES = {
  DEFAULT_AGE: 21,        // Возраст по умолчанию при создании профиля
  EMPTY_STRING: "",       // Пустая строка
  ZERO: 0,                // Нулевое значение
} as const;
