import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UserProfilePage from "./UserProfilePage";
import MovieDetailsPage from "./MovieDetailsPage";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import { getCurrentUser, logout } from "./api/auth";
import * as movie from "./api/movie";
import { jwtDecode } from "jwt-decode";

// ==================== КОНСТАНТЫ ====================
export const API_BASE_URL = "http://91.142.94.183:8080";

export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  SESSIONS: "/sessions",
  HALLS: "/halls",
  TICKETS: "/tickets",
  PURCHASES: "/purchases",
  PAYMENTS: "/payments/process",
  FILMS: "/films",
  REVIEWS: "/reviews",
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  SESSIONS_PAGE_SIZE: 100,
  PURCHASES_PAGE_SIZE: 20,
  FILMS_PAGE_SIZE: 20,
};

export const UI_SIZES = {
  SEAT_WIDTH: "50px",
  SEAT_HEIGHT: "50px",
  LEGEND_ITEM_WIDTH: "20px",
  LEGEND_ITEM_HEIGHT: "20px",
  SIDEBAR_WIDTH: "250px",
  POSTER_WIDTH: "200px",
};

export const UI_COLORS = {
  VIP_COLOR: "#0d6efd",
  VIP_BORDER: "1px solid #0d6efd",
  DEFAULT_COLOR: "#fff",
  DEFAULT_BORDER: "1px solid #fff",
  DARK_BG: "#1f1f1f",
};

export const UI_GRID = {
  GAP_BETWEEN_SEATS: "5px",
  GAP_BETWEEN_CATEGORIES: "10px",
  GAP_BETWEEN_ROWS: "10px",
};

export const DEFAULT_VALUES = {
  EMPTY_STRING: "",
  ZERO: 0,
  DEFAULT_AGE: 21,
};

// =====================================================

// Payload JWT токена с основной информацией о пользователе
interface TokenPayload {
  sub: string; // Уникальный идентификатор пользователя
  role: "ADMIN" | "USER"; // Роль пользователя в системе
  exp: number; // Время истечения токена (Unix timestamp)
  iat: number; // Время выдачи токена (Unix timestamp)
}

export default function App() {
  const [token, setToken] = useState<string | null>(null); // JWT токен для авторизации
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null); // Роль текущего пользователя

  useEffect(() => {
    const current = getCurrentUser();
    if (current?.accessToken) {
      setToken(current.accessToken);
      try {
        const decoded = jwtDecode<TokenPayload>(current.accessToken);
        setRole(decoded.role);
      } catch {
        console.error("Ошибка декодирования токена");
      }
    }
  }, []);

  const handleLogin = (authData: { accessToken: string }) => {
    setToken(authData.accessToken);
    try {
      const decoded = jwtDecode<TokenPayload>(authData.accessToken);
      setRole(decoded.role);
    } catch {
      console.error("Ошибка декодирования токена");
    }
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setRole(null);
  };

  const handleRegister = (authData: { accessToken: string }) => {
    setToken(authData.accessToken);
    try {
      const decoded = jwtDecode<TokenPayload>(authData.accessToken);
      setRole(decoded.role);
    } catch {
      console.error("Ошибка декодирования токена");
    }
  };

  return (
    <Router>
      <Header token={token} role={role} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            token
              ? role === "ADMIN"
                ? <Navigate to="/admin" />
                : <Navigate to="/home" />
              : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            token
              ? role === "ADMIN"
                ? <Navigate to="/admin" />
                : <Navigate to="/home" />
              : <RegisterPage onRegister={handleRegister} />
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
        <Route path="/profile" element={<UserProfilePage token={token} />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/admin" element={<AdminDashboard token={token} />} />
      </Routes>
    </Router>
  );
}
