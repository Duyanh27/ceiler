"use client";

import React from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import AuctionList from "@/app/components/AuctionList";

const items = [
  {
    id: "7",
    title: "Classic Car Model",
    image: "/images/car.jpg",
    description: "A vintage classic car model, perfect for collectors.",
    currentBid: 1000,
    timeLeft: "4d 20h (Sat, 02:39 PM)",
    shippingCost: "Rs. 100 per order",
    deliveryEstimate: "Thu, Jan 4 and Fri, Jan 12",
    details: `
      Rediscover the timeless charm of classic cars with this high-performance model. 
      Designed for collectors, it features:
      - Precision Craftsmanship: Built with exacting attention to detail.
      - Vintage Appeal: A stunning replica of a beloved classic car.
      - Collector's Delight: Ideal for enthusiasts and car lovers alike.
    `,
    seller: {
      name: "John Doe",
      reviews: 150,
      rating: 4.8,
      image: "/images/seller.jpg",
    },
  },
  {
    id: "1",
    title: "Antique Vase",
    image: "/images/vase.jpg",
    description: "A rare antique vase from the 19th century.",
    currentBid: 500,
    timeLeft: "3d 15h (Fri, 01:00 PM)",
    shippingCost: "Rs. 50 per order",
    deliveryEstimate: "Wed, Jan 3 and Thu, Jan 4",
    details: `
      A beautiful antique vase that adds elegance to any room.
      - Authentic craftsmanship from the 19th century.
      - A perfect collectible for antique lovers.
    `,
    seller: {
      name: "Jane Doe",
      reviews: 120,
      rating: 4.9,
      image: "/images/seller2.jpg",
    },
  },
  // Add more items here
];

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div style={{ padding: "2rem 0" }}>
        {/* Auction List */}
        <div style={{ textAlign: "center", margin: "0 auto", maxWidth: "1200px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Welcome to the Auction Platform
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
            Explore rare treasures and bid on your favorite items.
          </p>

          {/* AuctionList Component */}
          <AuctionList items={items} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
