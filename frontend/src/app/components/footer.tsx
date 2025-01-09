import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      {/* Newsletter Section */}
      <div style={styles.newsletterSection}>
        <input
          type="email"
          placeholder="Enter your email"
          style={styles.input}
        />
        <button style={styles.subscribeButton}>Subscribe</button>
      </div>

      {/* Description */}
      <div style={styles.description}>
        <p>Join online auctions and find unique items to buy and sell with excitement!</p>
      </div>

      {/* Social Media Icons */}
      <div style={styles.socialIcons}>
        {[
          { name: "Twitter", iconPath: "/icons/twitter.svg" },
          { name: "Facebook", iconPath: "/icons/facebook.svg" },
          { name: "Instagram", iconPath: "/icons/instagram.svg" },
          { name: "GitHub", iconPath: "/icons/github.svg" },
        ].map((icon, index) => (
          <div
            key={index}
            style={styles.iconContainer}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={icon.iconPath}
              alt={`${icon.name} icon`}
              style={styles.icon}
            />
          </div>
        ))}
      </div>

      {/* Links Section */}
      <div style={styles.linksSection}>
        {[
          {
            title: "COMPANY",
            links: ["About", "Features", "Works", "Career"],
          },
          {
            title: "HELP",
            links: [
              "Customer Support",
              "Delivery Details",
              "Terms & Conditions",
              "Privacy Policy",
            ],
          },
          {
            title: "FAQ",
            links: ["Account", "Manage Deliveries", "Orders", "Payments"],
          },
          {
            title: "RESOURCES",
            links: [
              "Free eBooks",
              "Development Tutorial",
              "How to - Blog",
              "YouTube Playlist",
            ],
          },
        ].map((section, index) => (
          <div key={index} style={styles.column}>
            <h3 style={styles.columnTitle}>{section.title}</h3>
            {section.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                style={styles.link}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <p style={styles.copyRight}>
          Ceiler © {new Date().getFullYear()}, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: "#fef5f6",
    color: "#8a2b2b",
    fontFamily: "Arial, sans-serif",
    padding: "2rem 1rem",
  },
  newsletterSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    width: "300px",
    fontSize: "1rem",
  },
  subscribeButton: {
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  description: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1rem",
    color: "#8a2b2b",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  iconContainer: {
    width: "50px",
    height: "50px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  icon: {
    width: "24px",
    height: "24px",
  },
  linksSection: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },
  column: {
    textAlign: "left",
    minWidth: "150px",
    marginBottom: "1rem",
  },
  columnTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
  },
  link: {
    display: "block",
    textDecoration: "none",
    color: "#8a2b2b",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
    textAlign: "center",
  },
  footerBottom: {
    textAlign: "center",
    borderTop: "1px solid #ddd",
    paddingTop: "1rem",
  },
  copyRight: {
    fontSize: "0.9rem",
    color: "#8a2b2b",
  },
};

export default Footer;
