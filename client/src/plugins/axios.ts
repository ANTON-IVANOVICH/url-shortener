import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let pending: (() => void)[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axios.post(
            "http://localhost:3000/api/auth/refresh",
            {},
            { withCredentials: true }
          );
          pending.forEach((cb) => cb());
        } catch {
          window.location.href = "/login";
        } finally {
          pending = [];
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        pending.push(() => resolve(api(config)));
      });
    }
    return Promise.reject(error);
  }
);

export default api;
