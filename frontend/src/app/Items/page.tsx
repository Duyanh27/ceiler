"use client";

import React from "react";
import AuctionList from "@/app/components/AuctionList";

const items = [
  { id: "7", title: "Classic Car Model", image: "/images/car.jpg", description: "A vintage classic car model.", currentBid: 1000 },
  { id: "1", title: "Antique Vase", image: "/images/vase.jpg", description: "A rare antique vase.", currentBid: 500 },
];

export default function ItemsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Available Items</h1>
      <AuctionList items={items} />
    </div>
  );
}
