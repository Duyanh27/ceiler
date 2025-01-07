import React from "react";

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
];

interface FilterModalProps {
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for better contrast
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensures the modal is on top of other elements
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Adds shadow for better focus
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          Select Filters
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {categories.map((category, index) => (
            <div key={index}>
              <h3 style={{ marginBottom: "10px", fontSize: "18px", color: "#555" }}>
                {category.name}
              </h3>
              {category.subcategories.map((subcategory, subIndex) => (
                <label
                  key={subIndex}
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    color: "#444", // Ensure text is easily readable
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.2)", // Make checkboxes larger for better visibility
                      cursor: "pointer",
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
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f0f0f0",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              console.log("Filters applied");
              onClose();
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
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
  );
};

export default FilterModal;