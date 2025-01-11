import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all files in the src directory
    "./src/app/**/*.{js,ts,jsx,tsx}", // For Next.js app directory
    "./src/components/**/*.{js,ts,jsx,tsx}", // For reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
