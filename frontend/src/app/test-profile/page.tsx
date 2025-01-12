"use client";

import { useApi } from "@/api";
import { UserProfile } from "../../types/index";
import { useState } from "react";

export default function TestProfilePage() {
  const { getProfile } = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  const fetchOwnProfile = async () => {
    try {
      setError("");
      const data = await getProfile();
      setProfile(data);
      console.log("Own Profile:", data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch your profile");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Profile Page</h1>
      <button
        onClick={fetchOwnProfile}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Own Profile
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {profile && (
        <div className="mt-4">
          <h3 className="font-bold text-lg">Your Profile:</h3>
          <div className="mt-2 p-4 bg-gray-100 rounded">
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Wallet Balance: {profile.walletBalance}</p>
          </div>
        </div>
      )}
    </div>
  );
}
