"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  description: string;
  currentBid: number;
  price: number;
  bids: number;
  seller: string;
  timeLeft: string;
}

interface AuctionListProps {
  items: AuctionItem[];
}

const AuctionList: React.FC<AuctionListProps> = ({ items }) => {
  return (
    <div
      style={{
        backgroundColor: "#f9fafc", // Bright background
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#4a90e2" }}>
          Explore Amazing Auctions
        </h1>
        <p style={{ fontSize: "1rem", color: "#6b7280" }}>
          Discover unique treasures and start bidding today!
        </p>
      </div>

      {/* Auction Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)", // Modern shadow
              backgroundColor: "#ffffff", // Bright card background
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-10px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 15px 25px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            {/* Image Section */}
            <div style={{ position: "relative", height: "200px" }}>
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>

            {/* Content Section */}
            <div style={{ padding: "1rem" }}>
              {/* Title */}
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#334155",
                  textAlign: "center",
                }}
              >
                {item.title}
              </h3>

              {/* Current Bid */}
              <p
                style={{
                  margin: "0.5rem 0",
                  fontSize: "1rem",
                  color: "#4a5568",
                  textAlign: "center",
                }}
              >
                Current Bid:{" "}
                <span style={{ fontWeight: "bold", color: "#f56565" }}>
                  ${item.currentBid.toFixed(2)}
                </span>
              </p>

              {/* Additional Info */}
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#718096",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                <p>Bids: {item.bids}</p>
                <p>Seller: {item.seller}</p>
                <p>Time Left: {item.timeLeft}</p>
              </div>

              {/* View Details Button */}
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Link href={`/items/${item.id}`} passHref>
                  <button
                    style={{
                      padding: "0.5rem 1.5rem",
                      backgroundColor: "#4a90e2",
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#357ABD")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#4a90e2")
                    }
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
