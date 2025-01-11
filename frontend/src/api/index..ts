import { makeRequest, privateAxiosInstance, publicAxiosInstance, setAuthToken } from "./axios";
import { useAuth } from "@clerk/nextjs";
import { UserProfile } from "@/types/user";

export const useApi = () => {
  const { getToken } = useAuth();

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

  return {
    getProfile,
    viewUserProfile,
  };
};
