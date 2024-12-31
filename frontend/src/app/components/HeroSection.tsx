"use client";
import React from 'react';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  onButtonClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline, subheadline, buttonText, onButtonClick }) => {
  return (
    <section style={styles.hero}>
      <h1 style={styles.headline}>{headline}</h1>
      <p style={styles.subheadline}>{subheadline}</p>
      <button onClick={onButtonClick} style={styles.button}>
        {buttonText}
      </button>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  hero: {
    textAlign: 'center' as 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f4f4f4',
  },
  headline: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  subheadline: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HeroSection;
