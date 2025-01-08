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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          {/* Optimized Image */}
          <div style={{ position: "relative", height: "180px" }}>
            <Image
              src={item.image}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
              priority
            />
          </div>
          {/* Content */}
          <div style={{ padding: "1rem" }}>
            {/* Title */}
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "0.5rem",
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
                color: "#666",
                textAlign: "center",
              }}
            >
              Current Bid:{" "}
              <span style={{ fontWeight: "bold", color: "#9e3b54" }}>
                ${item.currentBid.toFixed(2)}
              </span>
            </p>
            {/* View Details Button */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link href={`/items/${item.id}`} passHref>
                <button
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "#9e3b54",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#7a2b40")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#9e3b54")
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
  );
};

export default AuctionList;