import { makeRequest, privateAxiosInstance, publicAxiosInstance, setAuthToken } from "./axios";
import { useAuth } from "@clerk/nextjs";
import { UserProfile } from "@/types/index";

export const useApi = () => {
  const { getToken } = useAuth();

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
    // Just send the amount, no need for userId
    return await makeRequest<void>( 
      privateAxiosInstance, 
      "post", 
      "/api/users/wallet/add", // Fix the endpoint path
      { amount }
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
  };
};
