import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080" });

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
