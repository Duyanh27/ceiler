import { GetAllItemsParams } from "../types/index";
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
  options: {
    data?: unknown; // Payload for POST/PUT requests
    params?: GetAllItemsParams; // Query parameters for GET requests
    headers?: Record<string, string>; // Additional headers
  } = {} // Default to an empty object
): Promise<T> => {
  const { data, params, headers } = options;

  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      params, // Automatically maps query parameters
      headers, // Allows passing additional headers
    });
    return response.data;
  } catch (error: any) {
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Request Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url,
        method,
        params,
      });

      // You can customize error handling based on status code
      if (error.response?.status === 404) {
        throw new Error('Resource not found');
      }

      // Throw the original error or a custom error
      throw error.response?.data || error;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Unexpected Error:", {
        message: error.message,
        url,
        method,
        params,
      });

      throw error;
    }
  }
};