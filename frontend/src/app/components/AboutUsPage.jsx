import React from "react";

const AboutUsPage = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Welcome to Ceiler</h1>
        <p style={styles.heroSubtitle}>
          Your trusted platform for buying and selling high-quality products.
        </p>
      </section>

      {/* Mission Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.sectionText}>
          At Ceiler, our mission is to empower individuals and businesses by
          creating a transparent, safe, and engaging marketplace. We believe in
          connecting people through products they love, building trust, and
          providing exceptional value.
        </p>
      </section>

      {/* History Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Story</h2>
        <p style={styles.sectionText}>
          Ceiler started with a simple idea: to bring transparency and joy to
          online shopping. Over the years, we’ve grown into a trusted platform
          with thousands of users, offering unique deals and opportunities for
          buyers and sellers alike.
        </p>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <strong>Secure Transactions:</strong> Your safety is our top
            priority.
          </li>
          <li style={styles.featureItem}>
            <strong>Unique Products:</strong> Discover exclusive items you
            won't find elsewhere.
          </li>
          <li style={styles.featureItem}>
            <strong>Exceptional Support:</strong> Our team is here for you 24/7.
          </li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        <div style={styles.testimonials}>
          <blockquote style={styles.testimonial}>
            "Ceiler has changed the way I shop. The deals are fantastic, and the
            service is excellent!" - Sarah L.
          </blockquote>
          <blockquote style={styles.testimonial}>
            "I love selling on Ceiler. It's easy, fast, and the support team is
            amazing!" - Mike R.
          </blockquote>
          <blockquote style={styles.testimonial}>
            "I've found some of the most unique items here. Highly recommend it
            to anyone!" - Jessica T.
          </blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.callToAction}>
        <h2 style={styles.ctaTitle}>Join Our Community</h2>
        <p style={styles.ctaText}>
          Experience the Ceiler difference today. Whether you're buying,
          selling, or both, we’ve got you covered.
        </p>
        <button style={styles.ctaButton}>Get Started</button>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    lineHeight: "1.6",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroSection: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#0056d2",
    color: "#fff",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    margin: "0",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    margin: "10px 0 0",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  sectionText: {
    fontSize: "1rem",
  },
  featureList: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  featureItem: {
    marginBottom: "10px",
  },
  testimonials: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
  },
  testimonial: {
    fontStyle: "italic",
    marginBottom: "10px",
  },
  callToAction: {
    textAlign: "center",
    padding: "30px 20px",
    backgroundColor: "#f0f8ff",
    borderRadius: "10px",
  },
  ctaTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  ctaText: {
    fontSize: "1rem",
    marginBottom: "20px",
  },
  ctaButton: {
    backgroundColor: "#0056d2",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default AboutUsPage;