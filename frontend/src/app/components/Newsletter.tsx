"use client"; // Marks this as a client component

import React, { useState } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Subscribed with email: ${email}`);
    setEmail(""); // Clear the input after submission
  };

  return (
    <div style={styles.newsletter}>
      <h2 style={styles.heading}>Stay Updated with Our Newsletter!</h2>
      <p style={styles.subText}>
        Subscribe to receive the latest updates, exclusive deals, and more.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Subscribe
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  newsletter: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f7f9fc",
    borderRadius: "12px",
    margin: "2rem auto",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: "0.5rem",
  },
  subText: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    flex: "1 1 300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};

export default Newsletter;
