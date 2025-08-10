import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data?.error || "An error occurred";
      const customError = new Error(errorMessage);
      (customError as any).status = error.response.status;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default api;
