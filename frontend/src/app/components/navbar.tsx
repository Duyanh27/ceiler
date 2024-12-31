import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './Components.css';


const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link href="/">MyApp</Link>
      </div>
      <ul style={styles.navLinks}>
        <li>
          <Link href="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" style={styles.link}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" style={styles.link}>
            Contact
          </Link>
        </li>
      </ul>
      <div style={styles.actions}>
        <SignedOut>
          <Link href="/sign-in">
            <button style={styles.signInButton}>Sign In</button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #ddd',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '1.5rem',
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#000',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  signInButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#0056d2',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Navbar;
