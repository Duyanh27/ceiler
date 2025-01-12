import { makeRequest, privateAxiosInstance, publicAxiosInstance, setAuthToken } from "./axios";
import { useAuth } from "@clerk/nextjs";
import { UserProfile, Notification } from "@/types";
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

  // Public API: View other user's profile
  const viewUserProfile = async (username: string): Promise<UserProfile> => {
    return await makeRequest<UserProfile>(publicAxiosInstance, "get", `/api/users/${username}`);
  };

  return {
    getProfile,
    viewUserProfile,
    addFundsToWallet,
    getNotifications,
    markNotificationAsRead,
  };
};