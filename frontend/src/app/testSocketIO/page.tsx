'use client';

import { useEffect, useState } from "react";
import { getSocket } from "../../../utils/socket";
import { log } from "console";
import { collectSegmentData } from "next/dist/server/app-render/collect-segment-data";

interface BidData {
  itemId: string;
  userId: string;
  amount: number;
}

export default function BidPage() {
  const [itemId, setItemId] = useState<string>(""); // Default to an empty string
  const [userId, setUserId] = useState<string>(""); // Default to an empty string
  const [newBid, setNewBid] = useState<number | "">(""); // Default to an empty string for numeric inputs
  const [bids, setBids] = useState<BidData[]>([]);

  
  
  useEffect(() => {
    const socket = getSocket();

    // Listen for new bids
    socket.on("newBid", (data: BidData) => {
      setBids((prevBids) => [...prevBids, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const placeBid = async () => {
    if (!itemId || !userId || !newBid || newBid === 0) {
      alert("Please fill in all fields.");
      return;
    }
    
    console.log(itemId, userId, newBid);
    

    try {
      const response = await fetch(`http://localhost:5000/api/items/auctions/${itemId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newBid: Number(newBid) }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bid on Items</h1>

      <div>
        <label>Item ID:</label>
        <input
          type="text"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Enter Item ID"
        />
      </div>

      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />
      </div>

      <div>
        <label>Bid Amount:</label>
        <input
          type="number"
          value={newBid === "" ? "" : newBid} // Ensure value is controlled
          onChange={(e) => setNewBid(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Enter Bid Amount"
        />
      </div>

      <button onClick={placeBid}>Place Bid</button>

      <h2>Live Bids</h2>
      <ul>
        {bids.map((bid, index) => (
          <li key={index}>
            Item: {bid.itemId}, User: {bid.userId}, Amount: ${bid.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
