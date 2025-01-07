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
}

interface AuctionListProps {
  items: AuctionItem[];
}

const AuctionList: React.FC<AuctionListProps> = ({ items }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            width: "250px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          {/* Optimized Image */}
          <Image
            src={item.image}
            alt={item.title}
            width={250}
            height={150}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
            priority
          />
          {/* Title */}
          <h3 style={{ marginTop: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>{item.title}</h3>
          {/* Current Bid */}
          <p style={{ margin: "0.5rem 0", fontSize: "1rem", color: "#555" }}>
            Current Bid: <span style={{ fontWeight: "bold" }}>${item.currentBid.toFixed(2)}</span>
          </p>
          {/* View Details Button */}
          <Link href={`/items/${item.id}`} passHref>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
            >
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
