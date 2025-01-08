import React, { useState } from "react";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Smartphones", "Smartwatches", "Tablets"],
  },
  {
    name: "Computers",
    subcategories: ["Laptops", "Laptop components", "Desktop Computers"],
  },
  {
    name: "Photography",
    subcategories: ["Digital cameras", "Lenses", "Photo accessories"],
  },
  {
    name: "TVs and accessories",
    subcategories: ["TVs", "Projectors", "Headphones"],
  },
  {
    name: "Appliances",
    subcategories: ["Fridges", "Washing machines", "Clothes dryers"],
  },
];

interface FilterModalProps {
  isOpen: boolean;
  selectedCategories: string[];
  toggleCategory: (subcategory: string) => void;
  onClose: () => void;
  onApply: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  selectedCategories,
  toggleCategory,
  onClose,
  onApply,
}) => {
  if (!isOpen) return null; // Do not render if modal is closed

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "900px",
          width: "90%",
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Select the category you want to see
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
            gap: "20px",
          }}
        >
          {categories.map((category, index) => (
            <div key={index}>
              <h3
                style={{
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                {category.name}
              </h3>
              {category.subcategories.map((subcategory, subIndex) => (
                <label
                  key={subIndex}
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    color: "#444",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(subcategory)}
                    onChange={() => toggleCategory(subcategory)}
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.2)",
                    }}
                  />
                  {subcategory}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "16px", color: "#333" }}>
            Selected categories: {selectedCategories.join(", ") || "None"}
          </p>
          <div>
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f0f0f0",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Close
            </button>
            <button
              onClick={onApply}
              style={{
                padding: "10px 20px",
                backgroundColor: "#9e3b54",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;