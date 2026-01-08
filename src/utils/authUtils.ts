import { getToken } from "./tokenUtils";

export const requireAuth = (errorMessage: string = "Требуется авторизация"): boolean => {
  const token = getToken();
  if (!token) {
    alert(errorMessage);
    return false;
  }
  return true;
};

export const checkAuthForPayment = (): boolean => {
  const token = getToken();
  if (!token) {
    alert("Ошибка оплаты");
    return false;
  }
  return true;
};
