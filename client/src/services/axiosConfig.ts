import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useCookies } from "../hooks/useCookies";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT);

const { getCookie } = useCookies();

const gcs_token = getCookie("gcs_token");

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${gcs_token}`,
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("Response received:", response.data);
    return response;
  },
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
