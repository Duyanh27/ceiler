import { makeRequest, privateAxiosInstance, publicAxiosInstance, setAuthToken } from "./axios";
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
  Notification
} from "../types/index";
import axios from "axios";
import { create } from "zustand";

// Create a store for managing notification refresh state
interface NotificationStore {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export const useApi = () => {
  const { getToken } = useAuth();
  const triggerRefresh = useNotificationStore((state) => state.triggerRefresh);

  // Authenticated API: Fetch own profile
  const getProfile = async (): Promise<UserProfile> => {
    const token = await getToken();
    setAuthToken(token);
    return await makeRequest<UserProfile>(privateAxiosInstance, "get", "/api/users/profile");
  };

  // Public API: View other user's profile
  const viewUserProfile = async (username: string): Promise<UserProfile> => {
    return await makeRequest<UserProfile>(publicAxiosInstance, "get", `/api/users/${username}`);
  };

  // Authenticated API: Add funds to wallet
  const addFundsToWallet = async (amount: number): Promise<void> => {
    const token = await getToken();
    setAuthToken(token);
    try {
      await makeRequest<void>(
        privateAxiosInstance,
        "post",
        "/api/users/wallet/add",
        { amount }
      );
      console.log('Funds added successfully, triggering notification refresh');
      // Add a small delay before triggering refresh to ensure the backend has processed the notification
      setTimeout(() => {
        triggerRefresh();
      }, 500);
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  };

  // Get user notifications
  const getNotifications = async (): Promise<Notification[]> => {
    const token = await getToken();
    setAuthToken(token);
    const response = await makeRequest<UserProfile>(
      privateAxiosInstance,
      "get",
      "/api/users/profile"
    );
    return response.notifications || [];
  };

  // Mark a single notification as read
  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const token = await getToken();
    setAuthToken(token);
    const user = await getProfile();
    return await makeRequest<void>(
      privateAxiosInstance,
      "put",
      "/api/users/notification/read",
      {
        userId: user._id,
        notificationId
      }
    );
  };

  // Get all items (can have filter)
  const getAllItems = async (params?: GetAllItemsParams): Promise<AllItems> => {
    return await makeRequest(
      publicAxiosInstance,
      "get",
      `/api/items/getAllItem`,
      {
        params,
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
  const createItem = async (itemData: CreateItemRequest): Promise<CreateItemResponse> => {
    const token = await getToken();
    setAuthToken(token);
    return await makeRequest<CreateItemResponse>(
      privateAxiosInstance,
      "post",
      "/api/items/addItem",
      { data: itemData }
    );
  };

  const bidOnItem = async (itemId: string, bidData: BidRequest): Promise<BidResponse> => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await makeRequest<BidResponse>(
        privateAxiosInstance,
        "post",
        `/api/items/auctions/${itemId}/bid`,
        { data: bidData }
      );
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Bid error:", error.response.data);
          throw new Error(error.response.data.message || "Failed to place bid");
        } else if (error.request) {
          console.error("Bid error: No response received from server");
          throw new Error("Failed to place bid. Please try again later.");
        } else {
          console.error("Bid error:", error.message);
          throw new Error("Failed to place bid. Please try again later.");
        }
      } else {
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

  return {
    getProfile,
    viewUserProfile,
    getAllItems,
    getAllCategory,
    createItem,
    bidOnItem,
    getItemById,
    addFundsToWallet,
    getNotifications,
    markNotificationAsRead,
  };
};