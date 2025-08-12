import { reactive, readonly } from "vue";

interface UserState {
  email: string | null;
  authenticated: boolean;
}

const state = reactive<UserState>({
  email: null,
  authenticated: false,
});

export function useAuthStore() {
  function setUser(email: string) {
    state.email = email;
    state.authenticated = true;
  }
  function clearUser() {
    state.email = null;
    state.authenticated = false;
  }

  return {
    state: readonly(state),
    setUser,
    clearUser,
  };
}
