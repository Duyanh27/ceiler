import React from 'react';

interface AuctionItem {
  id: number;
  title: string;
  image: string;
  description: string;
  currentBid: number;
}

interface AuctionListProps {
  items: AuctionItem[];
}

const AuctionList: React.FC<AuctionListProps> = ({ items }) => {
  return (
    <div style={styles.list}>
      {items.map((item) => (
        <div key={item.id} style={styles.item}>
          <img src={item.image} alt={item.title} style={styles.image} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Current Bid: ${item.currentBid.toFixed(2)}</p>
          <button style={styles.button}>Bid Now</button>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  list: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap', // Explicit casting for FlexWrap
    gap: '2rem',
    justifyContent: 'center',
  },
  item: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    width: '250px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AuctionList;
