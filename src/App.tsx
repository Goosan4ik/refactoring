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
