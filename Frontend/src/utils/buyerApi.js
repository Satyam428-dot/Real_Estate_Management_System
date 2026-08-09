import axios from "axios";
import { JAVA_BACKEND_URL } from "./config";

const api = axios.create({ baseURL: JAVA_BACKEND_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const favouritesApi = {
  ids: () => api.get("/favourites/ids"),
  list: () => api.get("/favourites"),
  save: (propertyId) => api.post(`/favourites/${propertyId}`),
  remove: (propertyId) => api.delete(`/favourites/${propertyId}`),
};

export const profileApi = {
  get: () => api.get("/users/me"),
  update: (data) => api.put("/users/me", data),
};

export default api;
