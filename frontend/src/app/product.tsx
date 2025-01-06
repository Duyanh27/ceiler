'use client';

import { useRouter } from 'next/router';

const ProductDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Simulated product data (Replace with API fetch if necessary)
  const products = [
    {
      id: '1',
      name: 'XYZ Instrument',
      description: 'Rediscover the timeless charm of vinyl with this high-performance turntable.',
      price: 'XXX.XXX',
      images: ['/images/product1.jpg'],
    },
    {
      id: '2',
      name: 'Premium Headphones',
      description: 'Experience unmatched sound clarity with our premium headphones.',
      price: 'YYY.YYY',
      images: ['/images/product2.jpg'],
    },
  ];

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{product.name}</h1>
      <p><strong>Price:</strong> {product.price}</p>
      <div>
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={product.name}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              marginBottom: '20px',
            }}
          />
        ))}
      </div>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetails;