import React, { useState } from 'react';
import FilterModal from './components/FilterModal';

const HomePage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (subcategory: string) => {
    setSelectedCategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleFilterOpen = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);
  const handleApplyFilters = () => {
    // Implement the logic to filter the auction items based on selectedCategories
    console.log('Selected categories:', selectedCategories);
    handleFilterClose();
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ongoing Auctions</h1>
        <button
          onClick={handleFilterOpen}
          className="bg-gray-200 px-4 py-2 rounded border border-gray-400"
        >
          Filter
        </button>
      </header>

      {/* Render auction items here */}

      <FilterModal
        isOpen={isFilterOpen}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onClose={handleFilterClose}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default HomePage;