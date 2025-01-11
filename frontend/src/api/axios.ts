import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Base Axios instances
export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set auth token dynamically
export const setAuthToken = (token: string | null) => {
  if (token) {
    privateAxiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete privateAxiosInstance.defaults.headers.Authorization;
  }
};

/**
 * Generic function to make requests.
 * @param axiosInstance Axios instance to use (private or public)
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param url API endpoint URL
 * @param data Request body
 * @param options Additional Axios request config
 * @returns Response data of type T
 */
export const makeRequest = async <T>(
  axiosInstance: AxiosInstance,
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: unknown,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
