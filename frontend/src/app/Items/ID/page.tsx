"use client";

import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Image from "next/image";

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
  // Add more items as needed
];

export default function ItemDescriptionPage() {
  const params = useParams();
  const item = items.find((item) => item.id === params.id);

  if (!item) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Item not found</h1>
        <p>The item you're looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Left Section: Item Images */}
          <div style={{ flex: 1 }}>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={400}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>

          {/* Right Section: Item Details */}
          <div style={{ flex: 1 }}>
            <h1>{item.title}</h1>
            <p>
              <strong>Time left:</strong> {item.timeLeft}
            </p>
            <p>
              <strong>Current Bid:</strong> ${item.currentBid.toFixed(2)}
            </p>
            <p>{item.description}</p>
            <button
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Bid Now
            </button>
            <div style={{ marginTop: "2rem" }}>
              <h3>Shipping & Delivery</h3>
              <p>
                <strong>Shipping:</strong> {item.shippingCost}
              </p>
              <p>
                <strong>Delivery:</strong> {item.deliveryEstimate}
              </p>
            </div>
          </div>
        </div>

        {/* About This Item */}
        <div style={{ marginTop: "2rem" }}>
          <h2>About this item</h2>
          <p>{item.details}</p>
        </div>

        {/* Seller Section */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <Image
            src={item.seller.image}
            alt={item.seller.name}
            width={80}
            height={80}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <h3>{item.seller.name}</h3>
            <p>
              <strong>{item.seller.rating.toFixed(1)}</strong> ({item.seller.reviews} reviews)
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
