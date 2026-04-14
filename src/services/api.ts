import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api/v1/", // sua API
});

// envia o token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});