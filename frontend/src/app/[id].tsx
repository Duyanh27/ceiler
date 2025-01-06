import { GetServerSideProps } from 'next';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    reviews: number;
    profilePicture: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  // Fetch product data based on the ID
  const product = {
    id,
    name: 'XYZ Instrument',
    price: 'XXX.XXX',
    description: 'This is a detailed description of the product.',
    images: ['/images/product1.jpg', '/images/product2.jpg', '/images/product3.jpg'],
    seller: {
      name: 'Kail Khawaja',
      reviews: 150,
      profilePicture: '/images/seller-profile.jpg',
    },
  };

  return {
    props: { product },
  };
};

const ProductDetails = ({ product }: { product: Product }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      {/* Render product details */}
    </div>
  );
};

export default ProductDetails;