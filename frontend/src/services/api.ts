// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 👈 tu backend, cambia si usas proxy diferente
});

// Interceptor para meter token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
