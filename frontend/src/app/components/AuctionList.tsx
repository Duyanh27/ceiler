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
        backgroundColor: "#f3f4f6", // Light background for the auction section
        padding: "3rem 1.5rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "bold",
            color: "#1e40af",
            marginBottom: "0.5rem",
          }}
        >
          Explore Amazing Auctions
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b" }}>
          Browse our collection of rare treasures and exciting items. Bid now!
        </p>
      </div>

      {/* Auction Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
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
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", // Soft shadow
              backgroundColor: "#ffffff", // Card background
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-10px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 15px 30px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 20px rgba(0, 0, 0, 0.1)";
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
            <div style={{ padding: "1.5rem" }}>
              {/* Title */}
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h3>

              {/* Current Bid */}
              <p
                style={{
                  margin: "0.5rem 0",
                  fontSize: "1rem",
                  color: "#4b5563",
                  textAlign: "center",
                }}
              >
                Current Bid:{" "}
                <span style={{ fontWeight: "bold", color: "#ef4444" }}>
                  ${item.currentBid.toFixed(2)}
                </span>
              </p>

              {/* Additional Info */}
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
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
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#1e40af",
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e3a8a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e40af")
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
