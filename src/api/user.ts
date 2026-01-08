import apiClient from "../utils/apiClient";

export async function getUserProfile() {
  const res = await apiClient.get("/users/me");
  return res.data;
}

export async function updateProfile(data: {
  username?: string;
  email?: string;
  password?: string;
}) {
  const res = await apiClient.put("/users/me", data);
  return res.data;
}

export async function deleteAccount() {
  const res = await apiClient.delete("/users/me");
  return res.data;
}
