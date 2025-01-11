'use client';

import { useEffect, useState } from "react";
import { getSocket } from "../../../utils/socket";

interface BidData {
  itemId: string;
  userId: string;
  amount: number;
  message?: string; // Optional field for server response messages
}

export default function BidPage() {
  const [itemId, setItemId] = useState<string>(""); // Item ID input
  const [userId, setUserId] = useState<string>(""); // User ID input
  const [newBid, setNewBid] = useState<number | "">(""); // Bid amount input
  const [bids, setBids] = useState<BidData[]>([]); // Array of live bids
  const [loading, setLoading] = useState<boolean>(false); // Loading state for API calls

  useEffect(() => {
    const socket = getSocket();

    // Listen for new bids from the server
    socket.on("newBid", (data: BidData) => {
      setBids((prevBids) => [...prevBids, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const placeBid = async () => {
    // Validate inputs
    if (!itemId.trim() || !userId.trim() || !newBid || newBid <= 0) {
      alert("Please provide valid Item ID, User ID, and Bid Amount.");
      return;
    }
  
    setLoading(true); // Set loading state to true during the API call
  
    try {
      // Make the fetch request to the backend
      const response = await fetch(`http://localhost:5000/api/items/auctions/${itemId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newBid: Number(newBid) }),
      });
  
      const contentType = response.headers.get("Content-Type");
  
      // Handle non-JSON responses gracefully
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
          alert(result.message); // Success message
          setBids((prevBids) => [
            ...prevBids,
            { itemId, userId, amount: Number(newBid), message: result.message },
          ]); // Update bids locally
        } else {
          alert(result.message); // Server error message
        }
      } else {
        // Handle unexpected response types (e.g., HTML errors)
        const text = await response.text();
        console.error("Unexpected response:", text);
        alert("Server returned an unexpected response. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place the bid. Please check your network connection or try again later.");
    } finally {
      setLoading(false); // Reset loading state after the API call completes
    }
  };
  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Bid on Items</h1>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="itemId">Item ID:</label>
        <input
          id="itemId"
          type="text"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Enter Item ID"
          style={{
            marginLeft: "10px",
            padding: "5px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          style={{
            marginLeft: "10px",
            padding: "5px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="newBid">Bid Amount:</label>
        <input
          id="newBid"
          type="number"
          value={newBid === "" ? "" : newBid}
          onChange={(e) => setNewBid(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Enter Bid Amount"
          style={{
            marginLeft: "10px",
            padding: "5px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={placeBid}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Placing Bid..." : "Place Bid"}
      </button>

      <h2 style={{ marginTop: "20px" }}>Live Bids</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {bids.map((bid, index) => (
          <li
            key={index}
            style={{
              margin: "10px 0",
              padding: "10px",
              background: "#f9f9f9",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            <strong>Item:</strong> {bid.itemId}, <strong>User:</strong> {bid.userId},{" "}
            <strong>Amount:</strong> ${bid.amount}
            <br />
            {bid.message && <em>{bid.message}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}
