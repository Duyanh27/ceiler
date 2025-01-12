import {
  makeRequest,
  privateAxiosInstance,
  publicAxiosInstance,
  setAuthToken,
} from "./axios";
import { useAuth } from "@clerk/nextjs";
import {
  UserProfile,
  AllItems,
  Item,
  GetAllItemsParams,
  Category,
  CreateItemResponse,
  CreateItemRequest,
  BidRequest,
  BidResponse,
} from "../types/index";
import axios from "axios";
import { log } from "console";

export const useApi = () => {
  const { getToken } = useAuth();

  // Authenticated API: Fetch own profile
  const getProfile = async (): Promise<UserProfile> => {
    const token = await getToken();
    setAuthToken(token);
    return await makeRequest<UserProfile>(
      privateAxiosInstance,
      "get",
      "/api/users/profile"
    );
  };

  // Public API: View other user's profile
  const viewUserProfile = async (username: string): Promise<UserProfile> => {
    return await makeRequest<UserProfile>(
      publicAxiosInstance,
      "get",
      `/api/users/${username}`
    );
  };

  // Get all item (can have filter)
  // Public API: Get all items
  const getAllItems = async (params?: GetAllItemsParams): Promise<AllItems> => {
    return await makeRequest(
      publicAxiosInstance,
      "get",
      `/api/items/getAllItem`,
      {
        params, // Pass query params directly
      }
    );
  };

  const getAllCategory = async (): Promise<Category[]> => {
    return await makeRequest<Category[]>(
      privateAxiosInstance,
      "get",
      "/api/categories/getCategory"
    );
  };

  // Create a new item
  const createItem = async (
    itemData: CreateItemRequest
  ): Promise<CreateItemResponse> => {
    const token = await getToken();
    setAuthToken(token);
    return await makeRequest<CreateItemResponse>(
      privateAxiosInstance,
      "post",
      "/api/items/addItem",
      { data: itemData }
    );
  };

  const bidOnItem = async (
    itemId: string,
    bidData: BidRequest
  ): Promise<BidResponse> => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await makeRequest<BidResponse>(
        privateAxiosInstance,
        "post",
        `/api/items/auctions/${itemId}/bid`,
        { data: bidData }
      );
      console.log("fetched");

      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle specific Axios error cases
        if (error.response) {
          // The request was made and the server responded with a non-2xx status code
          console.error("Bid error:", error.response.data);
          throw new Error(error.response.data.message || "Failed to place bid");
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Bid error: No response received from server");
          throw new Error("Failed to place bid. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Bid error:", error.message);
          throw new Error("Failed to place bid. Please try again later.");
        }
      } else {
        // Handle other types of errors
        console.error("Unexpected bid error:", error);
        throw new Error("Failed to place bid. Please try again later.");
      }
    }
  };
  const getItemById = async (itemId: string): Promise<Item> => {
    try {
      const response = await makeRequest<Item>(
        publicAxiosInstance,
        "get",
        `/api/items/getOneItem/${itemId}`
      );
      return response;
    } catch (error: any) {
      console.error("Detailed error in getItemById:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };
  const getUserNameByClerkId = async (
    clerkId: string
  ): Promise<string | null> => {
    try {
      const response = await makeRequest<{ username: string }>(
        publicAxiosInstance,
        "get",
        `/api/users/public/getUserName/${clerkId}`
      );
      return response.username;
    } catch (error) {
      console.error(`Error fetching user name for Clerk ID: ${clerkId}`, error);
      return null;
    }
  };

  return {
    getProfile,
    viewUserProfile,
    getAllItems,
    getAllCategory,
    createItem,
    bidOnItem,
    getItemById,
    getUserNameByClerkId,
  };
};
