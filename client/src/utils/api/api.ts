import axios from "axios";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  withCredentials: true,
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const baseAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

baseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await authAPI.post(
            "/token",
            {},
            { withCredentials: true }
          );
          const newToken = response.data.access_token;
          localStorage.setItem("authToken", newToken);
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          throw err;
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(baseAPI(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

const pokeAPI = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export { baseAPI, pokeAPI, authAPI };
