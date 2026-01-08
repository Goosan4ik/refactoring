import apiClient from "../utils/apiClient";

export interface Session {
  id: string;
  movieId: string;
  hallId: string;
  startAt: string;
}

export async function getSessionById(id: string): Promise<Session> {
  const res = await apiClient.get(`/sessions/${id}`);
  return res.data;
}

export async function getHallPlan(hallId: string): Promise<any> {
  const res = await apiClient.get(`/halls/${hallId}/plan`);
  return res.data;
}
