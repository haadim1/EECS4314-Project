import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rosegold: "#b76e79",
        brown: "#5c4033",
        white: "#ffffff",
        gray: "#f5f5f5",
      },
    },
  },
  plugins: [],
} satisfies Config;
