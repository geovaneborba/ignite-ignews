import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)"],
      },
      colors: {
        white: "#FFFFFF",
        green: {
          500: "#04d361",
        },
        gray: {
          100: "#e1e1e6",
          200: "#737380",
          300: "#a8a8b3",
          700: "#323238",
          800: "#29292e",
          850: "#1f2729",
          900: "#121214",
        },
        cyan: {
          500: "#61dafb",
        },
        yellow: {
          500: "#eba417",
        },
      },
    },
  },

  plugins: [],
};
export default config;
