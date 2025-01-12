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

  const getProfile = async (): Promise<UserProfile> => {
    const token = await getToken();
    setAuthToken(token);
    return await makeRequest<UserProfile>(privateAxiosInstance, "get", "/api/users/profile");
  };

  const viewUserProfile = async (username: string): Promise<UserProfile> => {
    return await makeRequest<UserProfile>(publicAxiosInstance, "get", `/api/users/${username}`);
  };

  const addFundsToWallet = async (amount: number): Promise<void> => {
    const token = await getToken();
    setAuthToken(token);
    try {
      await makeRequest<void>(
        privateAxiosInstance,
        "post",
        "/api/users/wallet/add",
        { data: { amount } }  // Fixed: Wrap amount in data object
      );
      console.log('Funds added successfully, triggering notification refresh');
      setTimeout(() => {
        triggerRefresh();
      }, 500);
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  };

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

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const token = await getToken();
    setAuthToken(token);
    const user = await getProfile();
    return await makeRequest<void>(
      privateAxiosInstance,
      "put",
      "/api/users/notification/read",
      { 
        data: {  // Fixed: Wrap in data object
          userId: user._id,
          notificationId
        }
      }
    );
  };

  const getAllItems = async (params?: GetAllItemsParams): Promise<AllItems> => {
    return await makeRequest(
      publicAxiosInstance,
      "get",
      `/api/items/getAllItem`,
      { params }
    );
  };

  const getAllCategory = async (): Promise<Category[]> => {
    return await makeRequest<Category[]>(
      privateAxiosInstance,
      "get",
      "/api/categories/getCategory"
    );
  };

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Bid error:", error.response.data);
          throw new Error(error.response.data.message || "Failed to place bid");
        } else if (error.request) {
          throw new Error("Failed to place bid. Please try again later.");
        } else {
          throw new Error("Failed to place bid. Please try again later.");
        }
      }
      throw new Error("Failed to place bid. Please try again later.");
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
    } catch (error) {
      if (error instanceof Error) {
        console.error("Detailed error in getItemById:", {
          message: error.message,
          response: axios.isAxiosError(error) ? error.response?.data : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
        });
      }
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
    addFundsToWallet,
    getNotifications,
    markNotificationAsRead,
    getUserNameByClerkId,
  };
};