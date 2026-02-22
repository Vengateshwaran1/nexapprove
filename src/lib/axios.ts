import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore, type AuthTokens } from "../stores/auth.store";

// ─── Axios Instance ──────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Read current tokens directly from the Zustand store (works outside React). */
const getTokens = () => useAuthStore.getState();

/** Persist new tokens into the Zustand store. */
const setTokens = (tokens: AuthTokens) =>
  useAuthStore.getState().setTokens(tokens);

/** Clear tokens and redirect to login. */
const handleAuthFailure = () => {
  useAuthStore.getState().clearTokens();
  // Only redirect if we're not already on a public page
  if (
    !window.location.pathname.startsWith("/login") &&
    !window.location.pathname.startsWith("/set-password")
  ) {
    window.location.href = "/login";
  }
};

// ─── Refresh-token queue ─────────────────────────────────────────────────────
// Prevents multiple 401s from triggering parallel refresh requests.

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attaches the access token to every outgoing request (unless it's a public endpoint).

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getTokens();

    // Skip attaching the token for the refresh call itself to avoid loops.
    const isRefreshCall = config.url?.includes("/auth/refresh");

    if (accessToken && !isRefreshCall) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// On a 401 response:
//   1. Attempts to refresh the access token with the stored refresh token.
//   2. Retries the original request with the new token.
//   3. If refresh fails, logs the user out.

api.interceptors.response.use(
  (response) => response, // 2xx – pass through
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and when we haven't already retried.
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh");

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = getTokens();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call the refresh endpoint with the refresh token.
      const { data } = await axios.post<AuthTokens>(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      setTokens(data);
      processQueue(null, data.accessToken);

      // Retry the original request with the new access token.
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Convenience type re-export ──────────────────────────────────────────────
export type { AxiosRequestConfig };

export default api;
