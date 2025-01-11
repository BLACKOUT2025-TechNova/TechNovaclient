/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      // 폰트 패밀리 지정
      pretendard: ["Pretendard", "sans-serif"],
    },
    extend: {
      colors: {
        // Main Colors
        primary: "#28C06F",
        secondary: "#E4EBF5",
        error: "#FF5A36",
        "on-primary": "#FFFFFF",
        "on-secondary": "#FFFFFF",

        // Containers
        "primary-container": "#E6F8EA",
        "secondary-container": "#E4F8F6",
        "on-primary-container": "#03AD54",
        "on-secondary-container": "#4D5259",

        // Surface
        surface: "#FFFFFF",
        "surface-dim": "#EAEBEE",

        // On Surface
        outline: "#D1D3D9",
        "outline-variant": "#EAEBEE",
        "on-surface": "#212224",
        "on-surface-variant": "#ADB2BA",

        // Surface Containers
        "surface-container-lowest": "#F7F8FA",
        "surface-container-low": "#F2F3F6",
        "surface-container": "#EAEBEE",
        "surface-container-high": "#DCDEE2",
        "surface-container-highest": "#D1D3D9",

        // Background Overlay
        "background-overlay": "#333A40B3",
      },
      fontSize: {
        // Headings
        h1: ["40px", { lineHeight: "135%", fontWeight: "700" }],
        h2: ["34px", { lineHeight: "135%", fontWeight: "700" }],
        h3: ["32px", { lineHeight: "135%", fontWeight: "700" }],
        h4: ["28px", { lineHeight: "135%", fontWeight: "700" }],
        // Titles
        t1: ["24px", { lineHeight: "140%", fontWeight: "600" }],
        t2: ["20px", { lineHeight: "140%", fontWeight: "600" }],
        t3: ["18px", { lineHeight: "140%", fontWeight: "500" }],
        t4: ["16px", { lineHeight: "140%", fontWeight: "500" }],
        // Subtitles
        st1: ["14px", { lineHeight: "140%", fontWeight: "500" }],
        st2: ["14px", { lineHeight: "140%", fontWeight: "600" }],
        // Body
        b1: ["16px", { lineHeight: "140%", fontWeight: "500" }],
        b2: ["16px", { lineHeight: "140%", fontWeight: "400" }],
        b3: ["14px", { lineHeight: "140%", fontWeight: "500" }],
        b4: ["14px", { lineHeight: "140%", fontWeight: "400" }],
        // Captions
        c1: ["13px", { lineHeight: "150%", fontWeight: "400" }],
        c2: ["12px", { lineHeight: "150%", fontWeight: "400" }],
        // Button
        btn1: ["16px", { lineHeight: "140%", fontWeight: "600" }],
        btn2: ["14px", { lineHeight: "140%", fontWeight: "600" }],
        btn3: ["20px", { lineHeight: "140%", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};
