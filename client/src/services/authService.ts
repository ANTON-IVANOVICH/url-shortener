import api from "../plugins/axios";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();

export async function login(email: string, password: string) {
  await api.post("/auth/login", { email, password });
  auth.setUser(email);
}

export async function register(email: string, password: string) {
  await api.post("/auth/register", { email, password });
  auth.setUser(email);
}

export async function logout() {
  await api.post("/auth/logout");
  auth.clearUser();
}
