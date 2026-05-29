import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api";
const PRODUCTION_API_URL = "https://digital-logics-studio-backend.vercel.app/api";

function resolveApiBaseUrl() {
  const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/+$/, "");
  }

  return process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : LOCAL_API_URL;
}

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true, // Required to send/receive the httpOnly auth cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor: surface API error messages cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Attach backend error message to the thrown error so callers can use it
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  },
);

export default apiClient;
