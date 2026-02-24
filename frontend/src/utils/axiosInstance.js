import axios from "axios";
import { BASE_URL } from "./aiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_TOKEN_KEYS = ["token", "authToken", "studymate_token"];

const getStoredToken = () => {
  for (const key of AUTH_TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  return null;
};

const clearStoredTokens = () => {
  AUTH_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
};

const getErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") return responseData;
  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors[0]?.msg || responseData.errors[0]?.message || "Request failed";
  }
  if (!error?.response) return "Network error. Please check your connection.";
  return error?.message || "Something went wrong";
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    // Let browser set multipart boundary automatically.
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    error.friendlyMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    error.status = status || null;
    error.friendlyMessage = getErrorMessage(error);
    error.isNetworkError = !error?.response;

    if (status === 401) {
      clearStoredTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
