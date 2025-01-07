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
  const params = useParams(); // Retrieve the dynamic route parameter
  const { id } = params;

  const item = items.find((item) => item.id === id);

  if (!item) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Item not found</h1>
        <p>The item you're looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Left Section: Item Image */}
          <div style={{ flex: 1 }}>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={400}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>

          {/* Right Section: Item Details */}
          <div style={{ flex: 1 }}>
            <h1>{item.title}</h1>
            <p>
              <strong>Time left:</strong> {item.timeLeft}
            </p>
            <p>
              <strong>Current Bid:</strong> ${item.currentBid.toFixed(2)}
            </p>
            <p>{item.description}</p>
            <button
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Bid Now
            </button>
            <div style={{ marginTop: "2rem" }}>
              <h3>Shipping & Delivery</h3>
              <p>
                <strong>Shipping:</strong> {item.shippingCost}
              </p>
              <p>
                <strong>Delivery:</strong> {item.deliveryEstimate}
              </p>
            </div>
          </div>
        </div>

        {/* About This Item */}
        <div style={{ marginTop: "2rem" }}>
          <h2>About this item</h2>
          <p>{item.details}</p>
        </div>

        {/* Seller Section */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
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
          <div>
            <h3>{item.seller.name}</h3>
            <p>
              <strong>{item.seller.rating.toFixed(1)}</strong> ({item.seller.reviews} reviews)
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
