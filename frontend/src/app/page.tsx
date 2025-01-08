'use client';

import React, { useState } from "react";
import Navbar from './components/navbar';
import HeroSection from './components/HeroSection';
import AuctionList from './components/AuctionList';
import Newsletter from './components/Newsletter';
import Footer from './components/footer';
import FilterModal from './components/FilterModal';

const auctionItems = [
  {
    id: "1",
    title: "Antique Vase",
    image: "/images/vase.jpg",
    description: "A rare antique vase from the 19th century.",
    currentBid: 150.0,
    price: 300.0,
    bids: 3,
    seller: "Antique Trader",
    timeLeft: "4d 20h",
  },
  {
    id: "2",
    title: "Vintage Watch",
    image: "/images/watch.jpg",
    description: "A timeless vintage watch in pristine condition.",
    currentBid: 250.0,
    price: 500.0,
    bids: 5,
    seller: "Vintage Collector",
    timeLeft: "3d 10h",
  },
  {
    id: "3",
    title: "Classic Painting",
    image: "/images/painting.jpg",
    description: "An exquisite painting by a renowned artist.",
    currentBid: 500.0,
    price: 1000.0,
    bids: 8,
    seller: "Art Gallery",
    timeLeft: "2d 8h",
  },
  {
    id: "4",
    title: "Rare Coin Collection",
    image: "/images/coins.jpg",
    description: "A collection of rare coins from around the world.",
    currentBid: 750.0,
    price: 1200.0,
    bids: 6,
    seller: "Coin Enthusiast",
    timeLeft: "1d 15h",
  },
  {
    id: "5",
    title: "Handcrafted Wooden Chair",
    image: "/images/chair.jpg",
    description: "A beautifully handcrafted wooden chair with intricate details.",
    currentBid: 300.0,
    price: 500.0,
    bids: 2,
    seller: "Furniture Crafter",
    timeLeft: "5d 3h",
  },
  {
    id: "6",
    title: "Luxury Leather Handbag",
    image: "/images/handbag.jpg",
    description: "A designer luxury leather handbag in excellent condition.",
    currentBid: 850.0,
    price: 1500.0,
    bids: 10,
    seller: "Fashion Boutique",
    timeLeft: "6d 12h",
  },
  {
    id: "7",
    title: "Classic Car Model",
    image: "/images/car.jpg",
    description: "A vintage classic car model, perfect for collectors.",
    currentBid: 1000.0,
    price: 2000.0,
    bids: 12,
    seller: "Car Enthusiast",
    timeLeft: "4d 6h",
  },
  {
    id: "8",
    title: "Vintage Camera",
    image: "/images/camera.jpg",
    description: "A vintage camera in working condition, perfect for enthusiasts.",
    currentBid: 400.0,
    price: 800.0,
    bids: 4,
    seller: "Photographer's Haven",
    timeLeft: "3d 18h",
  },
  {
    id: "9",
    title: "Antique Necklace",
    image: "/images/necklace.jpg",
    description: "A stunning antique necklace with precious stones.",
    currentBid: 1500.0,
    price: 3000.0,
    bids: 15,
    seller: "Jewelry Trader",
    timeLeft: "2d 5h",
  },
  {
    id: "10",
    title: "Signed Baseball Memorabilia",
    image: "/images/baseball.jpg",
    description: "A signed baseball from a legendary player.",
    currentBid: 2000.0,
    price: 4000.0,
    bids: 18,
    seller: "Sports Memorabilia",
    timeLeft: "1d 8h",
  },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]); // Default price range
  const itemsPerPage = 6;

  // Pagination Logic
  const totalPages = Math.ceil(auctionItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter items based on price range
  const filteredItems = auctionItems.filter(
    (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
  );

  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <>
      <Navbar />

      <HeroSection
        headline="Explore Detailed Product Auctions"
        subheadline="Dive deep into the rarest treasures and start your bidding journey."
        buttonText="Start Bidding"
        onButtonClick={() => console.log("Start Bidding clicked")}
      />

      {/* Filter Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 20px",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Filters</h2>

        {/* Price Filter Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Price: </span>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
            style={{ width: "150px" }}
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
            style={{ width: "150px" }}
          />
          <span>
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            color: "#0070f3",
            padding: "8px 12px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span style={{ marginRight: "8px" }}>More Filters</span>
        </button>
      </div>

      {/* Auction List */}
      <div style={{ margin: "50px auto", maxWidth: "1200px", padding: "0 1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Available Auctions</h2>
        <AuctionList items={currentItems} />
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: currentPage === index + 1 ? "#f9f3f3" : "transparent",
              color: currentPage === index + 1 ? "#9e3b54" : "#c5a3b0",
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Newsletter />
      <Footer />

      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          selectedCategories={[]}
          toggleCategory={(category: string) => {}}
          onApply={() => setIsFilterOpen(false)}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}