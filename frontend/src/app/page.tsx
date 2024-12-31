// app/page.tsx
"use client";
import React from 'react';
import Navbar from './components/navbar';
import HeroSection from './components/HeroSection';
import AuctionList from './components/AuctionList';
import Newsletter from './components/Newsletter';
import Footer from './components/footer';

const auctionItems = [
  {
    id: 1,
    title: 'Antique Vase',
    image: '/images/vase.jpg',
    description: 'A rare antique vase from the 19th century.',
    currentBid: 150.0,
  },
  {
    id: 2,
    title: 'Vintage Watch',
    image: '/images/watch.jpg',
    description: 'A timeless vintage watch in pristine condition.',
    currentBid: 250.0,
  },
  {
    id: 3,
    title: 'Classic Painting',
    image: '/images/painting.jpg',
    description: 'An exquisite painting by a renowned artist.',
    currentBid: 500.0,
  },
];

export default function HomePage() {
  const handleHeroButtonClick = () => {
    console.log('Explore Auctions button clicked');
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
        onButtonClick={handleHeroButtonClick}
      />

      {/* Auction List */}
      <div style={{ margin: '50px auto', maxWidth: '1200px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Current Auctions</h2>
        <AuctionList items={auctionItems} />
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
}
