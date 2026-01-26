/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ebf5ff",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#a4cafe",
          400: "#76a9fa",
          500: "#3f83f8",
          600: "#1c64f2",
          700: "#1a56db",
          800: "#1e429f",
          900: "#233876",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2a37",
          900: "#111928",
        },
        blue: {
          50: "#ebf5ff",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#a4cafe",
          400: "#76a9fa",
          500: "#3f83f8",
          600: "#1c64f2",
          700: "#1a56db",
          800: "#1e429f",
          900: "#233876",
        },
        red: {
          50: "#fdf2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#f05252",
          600: "#e02424",
          700: "#c81e1e",
          800: "#9b1c1c",
          900: "#771d1d",
        },
        orange: {
          50: "#fff8f1",
          100: "#feecdc",
          200: "#fcd9bd",
          300: "#fdba8c",
          400: "#ff8a4c",
          500: "#ff5a1f",
          600: "#d03801",
          700: "#b43403",
          800: "#8a2c0d",
          900: "#771d1d",
        },
        yellow: {
          50: "#fdfdea",
          100: "#fdf6b2",
          200: "#fce96a",
          300: "#faca15",
          400: "#e3a008",
          500: "#c27803",
          600: "#9f580a",
          700: "#8e4b10",
          800: "#723b13",
          900: "#633112",
        },
        green: {
          50: "#f3faf7",
          100: "#def7ec",
          200: "#bcf0da",
          300: "#84e1bc",
          400: "#31c48d",
          500: "#0e9f6e",
          600: "#057a55",
          700: "#046c4e",
          800: "#03543f",
          900: "#014737",
        },
        teal: {
          50: "#edfafa",
          100: "#d5f5f6",
          200: "#afecef",
          300: "#7edce2",
          400: "#16bdca",
          500: "#0694a2",
          600: "#047481",
          700: "#036672",
          800: "#05505c",
          900: "#014451",
        },
        indigo: {
          50: "#f0f5ff",
          100: "#e5edff",
          200: "#cddbfe",
          300: "#b4c6fc",
          400: "#8da2fb",
          500: "#6875f5",
          600: "#5850ec",
          700: "#5145cd",
          800: "#42389d",
          900: "#362f78",
        },
        purple: {
          50: "#f6f5ff",
          100: "#edebfe",
          200: "#dcd7fe",
          300: "#cabffd",
          400: "#ac94fa",
          500: "#9061f9",
          600: "#7e3af2",
          700: "#6c2bd9",
          800: "#5521b5",
          900: "#4a1d96",
        },
        pink: {
          50: "#fdf2f8",
          100: "#fce8f3",
          200: "#fad1e8",
          300: "#f8b4d9",
          400: "#f17eb8",
          500: "#e74694",
          600: "#d61f69",
          700: "#bf125d",
          800: "#99154b",
          900: "#751a3d",
        },
      },
      fontFamily: {
        sans: ["Noto Sans TC", "Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.5" }],
        xl: ["20px", { lineHeight: "1.5" }],
        "2xl": ["24px", { lineHeight: "1.5" }],
        "3xl": ["30px", { lineHeight: "1.5" }],
        "4xl": ["36px", { lineHeight: "1.5" }],
        "5xl": ["48px", { lineHeight: "1.3" }],
        "6xl": ["60px", { lineHeight: "1.5" }],
        "7xl": ["72px", { lineHeight: "1.5" }],
        "8xl": ["96px", { lineHeight: "1.5" }],
        "9xl": ["128px", { lineHeight: "1.5" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      spacing: {
        px: "1px",
        0.5: "0.125rem", // 2px
        1.5: "0.375rem", // 6px
        2.5: "0.625rem", // 10px
        3.5: "0.875rem", // 14px
        7: "1.75rem", // 28px
        9: "2.25rem", // 36px
        11: "2.75rem", // 44px
        14: "3.5rem", // 56px
        52: "13rem", // 208px
        56: "14rem", // 224px
        60: "15rem", // 240px
        72: "18rem", // 288px
        80: "20rem", // 320px
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
        card: "20px",
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0px",
        2: "2px",
        4: "4px",
        8: "8px",
      },
      borderStyle: {
        solid: "solid",
        dashed: "dashed",
        dotted: "dotted",
        double: "double",
        none: "none",
      },
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(0,0,0,0.08)",
        DEFAULT:
          "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
        md: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.05)",
        lg: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px 0px rgba(0,0,0,0.05)",
        xl: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px 0px rgba(0,0,0,0.04)",
        "2xl": "0px 25px 50px -12px rgba(0,0,0,0.25)",
        card: "4px 4px 8px 0px rgba(226,226,230,0.4)",
        // 彩色陰影（使用 Tailwind 的顏色系統，透過 shadow-[color]/opacity 語法）
        "blue-600/50":
          "0px 10px 15px -3px rgba(28,100,242,0.5), 0px 4px 6px 0px rgba(28,100,242,0.5)",
        "green-500/50":
          "0px 10px 15px -3px rgba(14,159,110,0.5), 0px 4px 6px 0px rgba(14,159,110,0.5)",
        "teal-500/50":
          "0px 10px 15px -3px rgba(6,148,162,0.5), 0px 4px 6px 0px rgba(6,148,162,0.5)",
        "indigo-600/50":
          "0px 10px 15px -3px rgba(88,80,236,0.5), 0px 4px 6px 0px rgba(88,80,236,0.5)",
        "purple-600/50":
          "0px 10px 15px -3px rgba(126,58,242,0.5), 0px 4px 6px 0px rgba(126,58,242,0.5)",
        "pink-500/50":
          "0px 10px 15px -3px rgba(231,70,148,0.5), 0px 4px 6px 0px rgba(231,70,148,0.5)",
        "red-500/50":
          "0px 10px 15px -3px rgba(240,82,82,0.5), 0px 4px 6px 0px rgba(240,82,82,0.5)",
        "orange-500/50":
          "0px 10px 15px -3px rgba(255,90,31,0.5), 0px 4px 6px 0px rgba(255,90,31,0.5)",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/typography"),
  ],
};
