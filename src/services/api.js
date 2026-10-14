
import axios from "axios";

const api = axios.create({
  // Set VITE_API_URL in production (for example, https://api.example.com/api).
  // Keeping the local default makes the project run without extra setup.
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rentkhoj_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function registerUser(formData) {
  const response = await api.post("/auth/register", formData);
  return response.data;
}

export async function loginUser(formData) {
  const response = await api.post("/auth/login", formData);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export { api };
