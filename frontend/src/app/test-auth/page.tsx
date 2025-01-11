// app/test-auth/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function TestAuth() {
  const { getToken, isLoaded, userId } = useAuth();
  const [token, setToken] = useState<string>("");

  const getAndDisplayToken = async () => {
    try {
      const jwt = await getToken();
      setToken(jwt || "No token found");
      console.log("JWT Token:", jwt);

      // Test the token with your API
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        {userId ? `Current User ID: ${userId}` : "Not signed in"}
      </div>

      <button 
        onClick={getAndDisplayToken}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Token and Test API
      </button>
      
      {token && (
        <div className="mt-4">
          <h3 className="font-bold">Your JWT Token:</h3>
          <p className="mt-2 p-4 bg-gray-100 rounded-lg break-all">
            {token}
          </p>
        </div>
      )}
    </div>
  );
}