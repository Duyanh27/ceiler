"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <header style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <Link href="/">
            <Image
              src="/images/Ceiler.png" // Replace with your image path
              alt="Ceiler Logo"
              width={240}
              height={240}
              style={styles.logoImage}
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav style={styles.navLinks}>
          <Link href="/" style={styles.link}>
            Home
          </Link>
          <Link href="/sell" style={styles.link}>
            Sell
          </Link>
          <Link href="/about-us" style={styles.link}>
            About us
          </Link>
        </nav>

        {/* Search and User Actions */}
        <div style={styles.actions}>
          {/* Search Bar */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search for products..."
              style={styles.searchInput}
            />
          </div>

          {/* Icons and User */}
          <div style={styles.userActions}>
            <span style={styles.icon}>❤️</span>
            <SignedOut>
              <Link href="/sign-in">
                <button style={styles.signInButton}>Sign In</button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    backgroundColor: "#0056d2", // Navbar background color
    padding: "1rem 0",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    transition: "background-color 0.3s",
    backgroundColor: "transparent",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  searchWrapper: {
    position: "relative",
  },
  searchInput: {
    width: "250px",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    backgroundColor: "#eaeaea",
    fontSize: "1rem",
  },
  userActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  icon: {
    fontSize: "1.5rem",
    color: "#fff",
    cursor: "pointer",
  },
  signInButton: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#fff",
    color: "#0056d2",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Navbar;