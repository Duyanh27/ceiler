"use client";
import { useParams } from "next/navigation"; // Use next/navigation instead of next/router
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Image from "next/image";

const items = [
  {
    id: "1",
    title: "Antique Vase",
    image: "/images/vase.jpg",
    description: "A rare antique vase from the 19th century.",
    currentBid: 150.0,
    timeLeft: "4d 20h (Sat, 02:39 PM)",
    shippingCost: "Rs. 100 per order",
    deliveryEstimate: "Thu, Jan 4 and Fri, Jan 12",
    details: `
      Rediscover the timeless charm of antique vases with this beautiful piece. 
      Perfect for collectors and enthusiasts alike.
    `,
    seller: {
      name: "Jane Doe",
      reviews: 45,
      rating: 4.5,
      image: "/images/seller.jpg",
    },
  },
  {
    id: "2",
    title: "Vintage Camera",
    image: "/images/camera.jpg",
    description: "A vintage camera in excellent condition.",
    currentBid: 350.0,
    timeLeft: "3d 16h (Fri, 11:00 AM)",
    shippingCost: "Rs. 150 per order",
    deliveryEstimate: "Wed, Jan 3 and Thu, Jan 11",
    details: `
      A high-quality vintage camera for photography enthusiasts. 
      Perfect for those who love classic photography equipment.
    `,
    seller: {
      name: "John Smith",
      reviews: 30,
      rating: 4.8,
      image: "/images/seller2.jpg",
    },
  },
  {
    id: "3",
    title: "Classic Painting",
    image: "/images/painting.jpg",
    description: "A beautiful classic painting .",
    currentBid: 500.0,
    timeLeft: "5d 10h (Sun, 05:30 PM)",
    shippingCost: "Rs. 200 per order",
    deliveryEstimate: "Fri, Jan 5 and Sat, Jan 13",
    details: `
      A classic painting from the old century bringing the best to the room.
    `,
    seller: {
      name: "Alice Brown",
      reviews: 70,
      rating: 4.6,
      image: "/images/seller3.jpg",
    },
  },
  {
    id: "4",
    title: "Rare Coin Collection",
    image: "/images/coins.jpg",
    description: "A collection of rare coins from different countries.",
    currentBid: 1_000.0,
    timeLeft: "2d 12h (Thu, 09:00 AM)",
    shippingCost: "Rs. 120 per order",
    deliveryEstimate: "Tue, Jan 2 and Wed, Jan 10",
    details: `
      A rare collection of coins from various countries, perfect for history enthusiasts and coin collectors.
    `,
    seller: {
      name: "Bob Green",
      reviews: 85,
      rating: 4.9,
      image: "/images/seller4.jpg",
    },
  },
  {
    id: "5",
    title: "Handcraft wooden chaii",
    image: "/images/chair.jpg",
    description: "A designer Wooden chair in pristine condition.",
    currentBid: 1_200.0,
    timeLeft: "6d 15h (Mon, 04:00 PM)",
    shippingCost: "Rs. 180 per order",
    deliveryEstimate: "Sat, Jan 6 and Sun, Jan 14",
    details: `
      A wooden chair for fashion lovers. Its timeless design and premium quality make it a must-have.
    `,
    seller: {
      name: "Chris Blue",
      reviews: 50,
      rating: 4.7,
      image: "/images/seller5.jpg",
    },
  },
];



const ItemDetailsPage = () => {
    const params = useParams();
    const { id } = params;
  
    const item = items.find((item) => item.id === id);
  
    if (!item) {
      return (
        <div style={{ textAlign: "center", padding: "2rem", color: "black" }}>
          <h1>Item not found</h1>
          <p>The item you're looking for does not exist.</p>
        </div>
      );
    }
  
    return (
      <>
        <Navbar />
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", color: "black" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
            }}
          >
            {/* Header Section */}
            <div style={{ display: "flex", gap: "2rem" }}>
              {/* Left Section: Item Image */}
              <div style={{ flex: 1 }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={500}
                  style={{ borderRadius: "8px", objectFit: "cover", width: "100%" }}
                />
              </div>
  
              {/* Right Section: Item Details */}
              <div style={{ flex: 1 }}>
                <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>{item.title}</h1>
                <p style={{ marginBottom: "0.5rem" }}>
                  <strong>Time left:</strong> {item.timeLeft}
                </p>
                <p style={{ marginBottom: "0.5rem" }}>
                  <strong>Current Bid:</strong>{" "}
                  <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>${item.currentBid.toFixed(2)}</span>
                </p>
                <p style={{ marginBottom: "1rem" }}>{item.description}</p>
                <button
                  style={{
                    padding: "1rem 2rem",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
                >
                  Bid Now
                </button>
              </div>
            </div>
  
            {/* About This Item */}
            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>About this item</h2>
              <p style={{ lineHeight: "1.8" }}>{item.details}</p>
            </div>
  
            {/* Shipping & Delivery */}
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Shipping & Delivery</h3>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Shipping:</strong> {item.shippingCost}
              </p>
              <p>
                <strong>Delivery:</strong> {item.deliveryEstimate}
              </p>
            </div>
  
            {/* Seller Section */}
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <Image
                src={item.seller.image}
                alt={item.seller.name}
                width={80}
                height={80}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ marginLeft: "1rem" }}>
                <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>{item.seller.name}</h3>
                <p style={{ margin: 0 }}>
                  <strong>{item.seller.rating.toFixed(1)}</strong> ({item.seller.reviews} reviews)
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };
  
  export default ItemDetailsPage;