import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#9147ff",
        secondary: "#5c16c5",
        primaryWord: "#1f1f23",
        secondaryWord: "#616a75",
        hoverColor: "#e3e3e6",
        leftBarColor: "#efeff1",
      },
      boxShadow: {
        primaryShadow: "0 0 45px -15px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [nextui()],
};
export default config;
