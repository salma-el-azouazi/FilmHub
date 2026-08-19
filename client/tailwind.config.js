/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        cinema: {
          ink: "#07080d",
          panel: "#11131c",
          line: "rgba(255,255,255,0.12)",
          red: "#ff355e",
          gold: "#ffd166",
          teal: "#2de2e6"
        }
      },
      boxShadow: {
        glow: "0 0 34px rgba(255, 53, 94, 0.25)",
        teal: "0 0 34px rgba(45, 226, 230, 0.18)"
      }
    }
  },
  plugins: []
};
