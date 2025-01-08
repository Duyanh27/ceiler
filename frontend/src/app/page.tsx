'use client';

import React, { useState } from "react";
import Navbar from './components/navbar'; // Ensure correct path and casing
import HeroSection from './components/HeroSection';
import AuctionList from './components/AuctionList';
import Newsletter from './components/Newsletter';
import Footer from './components/footer';
import FilterModal from './components/FilterModal'; // Add this to handle the modal

const auctionItems = [
  {
    id: "1",
    title: "Antique Vase",
    image: "/images/vase.jpg",
    description: "A rare antique vase from the 19th century.",
    currentBid: 150.0,
  },
  {
    id: "2",
    title: "Vintage Watch",
    image: "/images/watch.jpg",
    description: "A timeless vintage watch in pristine condition.",
    currentBid: 250.0,
  },
  {
    id: "3",
    title: "Classic Painting",
    image: "/images/painting.jpg",
    description: "An exquisite painting by a renowned artist.",
    currentBid: 500.0,
  },
  {
    id: "4",
    title: "Rare Coin Collection",
    image: "/images/coins.jpg",
    description: "A collection of rare coins from around the world.",
    currentBid: 750.0,
  },
  {
    id: "5",
    title: "Handcrafted Wooden Chair",
    image: "/images/chair.jpg",
    description: "A beautifully handcrafted wooden chair with intricate details.",
    currentBid: 300.0,
  },
  {
    id: "6",
    title: "Luxury Leather Handbag",
    image: "/images/handbag.jpg",
    description: "A designer luxury leather handbag in excellent condition.",
    currentBid: 850.0,
  },
  {
    id: "7",
    title: "Classic Car Model",
    image: "/images/car.jpg",
    description: "A vintage classic car model, perfect for collectors.",
    currentBid: 1000.0,
  },
  {
    id: "8",
    title: "Vintage Camera",
    image: "/images/camera.jpg",
    description: "A vintage camera in working condition, perfect for enthusiasts.",
    currentBid: 400.0,
  },
  {
    id: "9",
    title: "Antique Necklace",
    image: "/images/necklace.jpg",
    description: "A stunning antique necklace with precious stones.",
    currentBid: 1500.0,
  },
  {
    id: "10",
    title: "Signed Baseball Memorabilia",
    image: "/images/baseball.jpg",
    description: "A signed baseball from a legendary player.",
    currentBid: 2000.0,
  },
  {
    id: "11",
    title: "Handmade Quilt",
    image: "/images/quilt.jpg",
    description: "A beautiful handmade quilt with intricate patterns.",
    currentBid: 350.0,
  },
  {
    id: "12",
    title: "Vintage Typewriter",
    image: "/images/typewriter.jpg",
    description: "A vintage typewriter in excellent working condition.",
    currentBid: 600.0,
  },
  {
    id: "13",
    title: "Rare Book Collection",
    image: "/images/books.jpg",
    description: "A collection of rare first-edition books.",
    currentBid: 1800.0,
  },
  {
    id: "14",
    title: "Designer Shoes",
    image: "/images/shoes.jpg",
    description: "A pair of designer shoes in pristine condition.",
    currentBid: 1200.0,
  },
  {
    id: "15",
    title: "Antique Clock",
    image: "/images/clock.jpg",
    description: "An antique clock with a beautiful wooden frame.",
    currentBid: 2500.0,
  },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for Filter Modal
  const itemsPerPage = 6; // Display 6 items per page

  // Pagination Logic
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
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9f9f9";
            e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={{ marginRight: "8px" }}>Open Filters</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#0070f3"
            width="16px"
            height="16px"
          >
            <path d="M3 6h18v2H3V6zm4 6h10v2H7v-2zm6 6H9v-2h4v2z" />
          </svg>
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
  {Array.from({ length: 10 }, (_, index) => {
    const pageNumber = index + 1;
    const isActive = currentPage === pageNumber;

    const showPage =
      pageNumber === 1 ||
      pageNumber === 10 ||
      Math.abs(pageNumber - currentPage) <= 1;

    if (!showPage) {
      if (
        pageNumber === currentPage - 2 ||
        pageNumber === currentPage + 2
      ) {
        return <span key={pageNumber}>...</span>;
      }
      return null;
    }

    return (
      <button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "8px",
          backgroundColor: isActive ? "#f9f3f3" : "transparent",
          color: isActive ? "#9e3b54" : "#c5a3b0",
          fontWeight: isActive ? "bold" : "normal",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {pageNumber}
      </button>
    );
  })}
</div>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Filter Modal */}
      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          selectedCategories={[]} // Pass in actual filter state if implemented
          toggleCategory={(category: string) => {}} // Pass toggle logic for filters
          onApply={() => setIsFilterOpen(false)} // Close modal after applying
          onClose={() => setIsFilterOpen(false)} // Close modal
        />
      )}
    </>
  );
}