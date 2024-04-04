import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          900: "#3D5AFE",
          800: "#516BFE",
          700: "#778BFE",
          500: "#9EACFF",
          300: "#C5CEFF",
          100: "#ECEEFF",
        },
        secondary: {
          900: "#0d1654",
          800: "#0d1654",
          700: "#565c88",
          500: "#868aaa",
          300: "#b7b9cc",
          100: "#b7b9cc",
        },
        tertiary: {
          900: "#2c2c2c",
          800: "#414141",
          700: "#6c6c6c",
          500: "#969696",
          300: "#c0c0c0",
          100: "#eaeaea",
        },
        accent: {
          900: "#a6ff98",
          800: "#c6febd",
          700: "#d4fecc",
          500: "#e0ffdb",
          300: "#ebffe9",
          100: "#f9fff9",
        },
      }
    },
  },
  plugins: [],
}
export default config
