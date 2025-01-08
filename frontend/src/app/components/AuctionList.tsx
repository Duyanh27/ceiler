"use client"; // Ensure client-side rendering

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
        display: "grid",
<<<<<<< HEAD
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
=======
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
>>>>>>> 7365f367ba8e00ebbf017bf563cb13f9aae01597
        gap: "1.5rem",
        padding: "2rem",
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
            backgroundColor: "#fff",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
<<<<<<< HEAD
          {/* Image Section */}
          <div style={{ position: "relative", height: "180px" }}>
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

            {/* Additional Info */}
            <div
              style={{
                fontSize: "0.9rem",
                color: "#888",
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
=======
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
          <h3 style={{ marginTop: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>{item.title}</h3>
          <p style={{ color: "#0070f3", fontWeight: "bold" }}>${item.currentBid.toFixed(2)}</p>
          <Link href={`/auction/${item.id}`} passHref>
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </Link>
>>>>>>> 7365f367ba8e00ebbf017bf563cb13f9aae01597
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
