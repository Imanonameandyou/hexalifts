import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        concrete: "#141412",
        steel: "#1E1E1C",
        iron: "#2A2A28",
        ash: "#55534E",
        "chalk-muted": "#888680",
        chalk: "#C8C4BC",
        white: "#F0EDE6",
        red: "#C8352A",
        "red-dark": "#9E2318",
        "red-muted": "#6B1B12",
        green: "#4A7C59",
        amber: "#B87D22",
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        cond: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Barlow'", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
