import { reactive, readonly } from "vue";
import api from "../plugins/axios";

interface UserState {
  email: string | null;
  accessToken: string | null;
  authenticated: boolean;
}

const state = reactive<UserState>({
  email: null,
  accessToken: null,
  authenticated: false,
});

export function useAuthStore() {
  function setUser(email: string, token: string) {
    state.email = email;
    state.accessToken = token;
    state.authenticated = true;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  function clearUser() {
    state.email = null;
    state.accessToken = null;
    state.authenticated = false;
    delete api.defaults.headers.common["Authorization"];
  }
  async function init() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.email, res.data.accessToken);
    } catch {
      clearUser();
    }
  }
  return {
    state: readonly(state),
    setUser,
    clearUser,
    init,
  };
}
