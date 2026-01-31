import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1C7ED6",
          foreground: "#F8FAFC"
        },
        secondary: {
          DEFAULT: "#E9EDF5",
          foreground: "#0B1626"
        },
        muted: {
          DEFAULT: "#F4F6FB",
          foreground: "#64748B"
        },
        accent: {
          DEFAULT: "#EEF5FF",
          foreground: "#0B1626"
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#F8FAFC"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B1626"
        }
      },
      borderRadius: {
        lg: "14px",
        md: "12px",
        sm: "10px"
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
