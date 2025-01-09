"use client"; // Make sure this is added for React components in Next.js with client-side interactions

import React, { useState } from "react";
import FilterModal from "./components/FilterModal"; // Adjust the path if necessary

const Home: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Function to toggle category
  const toggleCategory = (subcategory: string) => {
    setSelectedCategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((cat) => cat !== subcategory) // Remove if already selected
        : [...prev, subcategory] // Add if not selected
    );
  };

  // Apply button handler
  const handleApply = () => {
    console.log("Selected Categories:", selectedCategories);
    setIsFilterOpen(false); // Close the modal
  };

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Welcome to CeiLer
      </h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Discover your favorite products with advanced filters!
      </p>

      <button
        onClick={() => setIsFilterOpen(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        }}
      >
        Open Filter
      </button>
      <FilterModal
        isOpen={isFilterOpen}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApply}
      />
    </main>
  );
};

export default Home;