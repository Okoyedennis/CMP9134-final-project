export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red_custom: "#B91819",
        "gcs-dark": "#1a1a1a",
        "gcs-darker": "#0f0f0f",
        "gcs-card": "#2d2d2d",
        "gcs-accent": "#007bff",
      },
      animation: {
        marquee: "marquee 10s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
    boxShadow: {
      shadow1:
        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      shadow2: "0px 0px 15px 0px #1111110A",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
  plugins: [],
};
