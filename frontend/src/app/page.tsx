"use client";

import React, { useState } from "react";
import Navbar from './components/navbar'; // Ensure correct path and casing
import HeroSection from './components/HeroSection';
import AuctionList from './components/AuctionList';
import Newsletter from './components/Newsletter';
import Footer from './components/footer';

const auctionItems = [
  {
    id: 1,
    title: "Antique Vase",
    image: "/images/vase.jpg",
    description: "A rare antique vase from the 19th century.",
    currentBid: 150.0,
  },
  {
    id: 2,
    title: "Vintage Watch",
    image: "/images/watch.jpg",
    description: "A timeless vintage watch in pristine condition.",
    currentBid: 250.0,
  },
  {
    id: 3,
    title: "Classic Painting",
    image: "/images/painting.jpg",
    description: "An exquisite painting by a renowned artist.",
    currentBid: 500.0,
  },
  {
    id: 4,
    title: "Rare Coin Collection",
    image: "/images/coins.jpg",
    description: "A collection of rare coins from around the world.",
    currentBid: 750.0,
  },
  {
    id: 5,
    title: "Handcrafted Wooden Chair",
    image: "/images/chair.jpg",
    description: "A beautifully handcrafted wooden chair with intricate details.",
    currentBid: 300.0,
  },
  {
    id: 6,
    title: "Luxury Leather Handbag",
    image: "/images/handbag.jpg",
    description: "A designer luxury leather handbag in excellent condition.",
    currentBid: 850.0,
  },
  {
    id: 7,
    title: "Classic Car Model",
    image: "/images/car.jpg",
    description: "A vintage classic car model, perfect for collectors.",
    currentBid: 1_000.0,
  },
  {
    id: 8,
    title: "Vintage Camera",
    image: "/images/camera.jpg",
    description: "A vintage camera in working condition, perfect for enthusiasts.",
    currentBid: 400.0,
  },
  {
    id: 9,
    title: "Antique Necklace",
    image: "/images/necklace.jpg",
    description: "A stunning antique necklace with precious stones.",
    currentBid: 1_500.0,
  },
  {
    id: 10,
    title: "Signed Baseball Memorabilia",
    image: "/images/baseball.jpg",
    description: "A signed baseball from a legendary player.",
    currentBid: 2_000.0,
  },
  {
    id: 11,
    title: "Handmade Quilt",
    image: "/images/quilt.jpg",
    description: "A beautiful handmade quilt with intricate patterns.",
    currentBid: 350.0,
  },
  {
    id: 12,
    title: "Vintage Typewriter",
    image: "/images/typewriter.jpg",
    description: "A vintage typewriter in excellent working condition.",
    currentBid: 600.0,
  },
  {
    id: 13,
    title: "Rare Book Collection",
    image: "/images/books.jpg",
    description: "A collection of rare first-edition books.",
    currentBid: 1_800.0,
  },
  {
    id: 14,
    title: "Designer Shoes",
    image: "/images/shoes.jpg",
    description: "A pair of designer shoes in pristine condition.",
    currentBid: 1_200.0,
  },
  {
    id: 15,
    title: "Antique Clock",
    image: "/images/clock.jpg",
    description: "An antique clock with a beautiful wooden frame.",
    currentBid: 2_500.0,
  },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(auctionItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = auctionItems.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        headline="Welcome to the Auction Platform"
        subheadline="Find rare treasures and unique items. Start bidding now!"
        buttonText="Explore Auctions"
        onButtonClick={() => console.log("Explore Auctions clicked")}
      />

      {/* Auction List */}
      <div style={{ margin: "50px auto", maxWidth: "1200px", padding: "0 1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Current Auctions</h2>
        <AuctionList items={currentItems} />
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              padding: "0.5rem 1rem",
              margin: "0 5px",
              backgroundColor: currentPage === index + 1 ? "#0070f3" : "#f3f3f3",
              color: currentPage === index + 1 ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
}