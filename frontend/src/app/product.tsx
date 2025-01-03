import React from 'react';
import Slider from 'react-slick';
import styles from './ProductPage.module.css';

// Define TypeScript types for the product data
interface Product {
  name: string;
  price: string;
  bids: number;
  timeLeft: string;
  images: string[];
  description: string[];
  seller: {
    name: string;
    reviews: number;
    profilePicture: string;
  };
}

const ProductPage: React.FC = () => {
  // Mock product data
  const product: Product = {
    name: 'xyz instrument',
    price: 'XXX.XXX',
    bids: 3,
    timeLeft: '4d 20h',
    images: [
      '/images/product1.jpg',
      '/images/product2.jpg',
      '/images/product3.jpg',
    ],
    description: [
      'Rediscover the timeless charm of vinyl with this high-performance turntable.',
      'Precision Performance: A belt-driven system ensures smooth playback for optimal sound quality.',
      'Superior Audio Output: Equipped with a high-quality needle and cartridge for rich, detailed sound.',
      'Stylish Design: A sleek, modern finish complements any decor.',
      'Adjustable Speeds: Supports 33 1/3, 45, and 78 RPM records.',
      'User-Friendly Features: Includes an auto-stop function, built-in speakers, and RCA output.',
      'Durable Construction: Built with high-quality materials for reliability.',
    ],
    seller: {
      name: 'Kail Khawaja',
      reviews: 150,
      profilePicture: '/images/seller-profile.jpg',
    },
  };

  // Slider settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{product.name}</h1>
        <p>Time left: {product.timeLeft}</p>
        <p>Price: {product.price} ({product.bids} bids)</p>
      </header>

      <div className={styles.carousel}>
        <Slider {...settings}>
          {product.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Product Image ${index + 1}`} className={styles.image} />
            </div>
          ))}
        </Slider>
      </div>

      <div className={styles.details}>
        <h2>About this item</h2>
        <ul>
          {product.description.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button className={styles.bidButton}>Bid Now</button>
        <div className={styles.shipping}>
          <p><strong>Shipping:</strong> Rs. 100 per order</p>
          <p><strong>Delivery:</strong> Estimated between Jan 4 and Jan 12</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.seller}>
          <img
            src={product.seller.profilePicture}
            alt="Seller"
            className={styles.sellerImage}
          />
          <div>
            <p><strong>{product.seller.name}</strong></p>
            <p>{product.seller.reviews} Reviews</p>
          </div>
        </div>
        <button className={styles.contactButton}>Contact</button>
      </footer>
    </div>
  );
};

export default ProductPage;