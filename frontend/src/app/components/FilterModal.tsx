import React from "react";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Smartphones", "Smartwatches", "Tablets", "Accessories GSM", "Cases and covers"],
  },
  {
    name: "Computers",
    subcategories: [
      "Laptops",
      "Laptop components",
      "Desktop Computers",
      "Computer components",
      "Printers and scanners",
    ],
  },
  {
    name: "TVs and accessories",
    subcategories: ["TVs", "Projectors", "Headphones", "Audio for home", "Home cinema"],
  },
  {
    name: "Photography",
    subcategories: ["Digital cameras", "Lenses", "Photo accessories", "Instant cameras (Instax, Polaroid)"],
  },
  {
    name: "Appliances",
    subcategories: ["Fridges", "Washing machines", "Clothes dryers", "Free-standing kitchens"],
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
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                  color: "#4a5568",
                }}
              >
                {category.name}
              </h3>
              {category.subcategories.map((subcategory, subIndex) => (
                <label
                  key={subIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "14px",
                    color: "#555",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(subcategory)}
                    onChange={() => toggleCategory(subcategory)}
                    style={{
                      marginRight: "10px",
                      width: "18px",
                      height: "18px",
                      accentColor: "#9e3b54", // Custom checkbox color
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
            Selected categories:{" "}
            {selectedCategories.length > 0
              ? selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      marginRight: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {cat}
                  </span>
                ))
              : "None"}
          </p>
          <div>
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e2e8f0",
                color: "#4a5568",
                border: "1px solid #cbd5e0",
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
                fontWeight: "bold",
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
