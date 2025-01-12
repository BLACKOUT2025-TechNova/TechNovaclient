/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 프로젝트의 모든 파일 경로 포함
    "./public/index.html",
  ],
  theme: {
    fontFamily: {
      // 폰트 패밀리 지정
      pretendard: ["Pretendard", "sans-serif"],
    },
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
        fadeIn: "fadeIn 0.3s ease forwards",
        fadeInUp: "fadeInUp 0.4s ease forwards",
        popIn: "popIn 0.4s ease forwards",
        wobble: "wobble 2s ease-in-out infinite alternate",
      },
      keyframes: {
        wobble: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1) rotate(-5deg)" },
          "50%": { transform: "scale(0.9) rotate(5deg)" },
          "75%": { transform: "scale(1.05) rotate(-3deg)" },
        },
        popIn: {
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          fadeInUp: {
            "0%": { opacity: 0, transform: "translateY(10px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      colors: {
        primary: "#28C06F",
        secondary: "#E4EBF5",
        error: "#FF5A36",
        "on-primary": "#FFFFFF",
        "on-secondary": "#FFFFFF",
        "primary-container": "#E6F8EA",
        "secondary-container": "#E4F8F6",
        "on-primary-container": "#03BD54",
        "on-secondary-container": "#4D5259",
        surface: "#FFFFFF",
        "surface-dim": "#EAEBEE",
        outline: "#D1D3D9",
        "outline-variant": "#EAEBEE",
        "on-surface": "#212224",
        "on-surface-variant": "#ADB2BA",
        "surface-container-lowest": "#F7F8FA",
        "surface-container-low": "#F2F3F6",
        "surface-container": "#EAEBEE",
        "surface-container-high": "#DCDEE2",
        "surface-container-highest": "#D1D3D9",
        "background-overlay": "#333A40B3",
      },
      fontSize: {
        h1: ["40px", { lineHeight: "135%", fontWeight: "700" }],
        h2: ["34px", { lineHeight: "135%", fontWeight: "700" }],
        h3: ["32px", { lineHeight: "135%", fontWeight: "700" }],
        h4: ["28px", { lineHeight: "135%", fontWeight: "700" }],
        t1: ["24px", { lineHeight: "140%", fontWeight: "600" }],
        t2: ["20px", { lineHeight: "140%", fontWeight: "600" }],
        t3: ["18px", { lineHeight: "140%", fontWeight: "500" }],
        t4: ["16px", { lineHeight: "140%", fontWeight: "500" }],
        st1: ["14px", { lineHeight: "140%", fontWeight: "500" }],
        st2: ["14px", { lineHeight: "140%", fontWeight: "600" }],
        b1: ["16px", { lineHeight: "140%", fontWeight: "500" }],
        b2: ["16px", { lineHeight: "140%", fontWeight: "400" }],
        b3: ["14px", { lineHeight: "140%", fontWeight: "500" }],
        b4: ["14px", { lineHeight: "140%", fontWeight: "400" }],
        c1: ["13px", { lineHeight: "150%", fontWeight: "400" }],
        c2: ["12px", { lineHeight: "150%", fontWeight: "400" }],
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
      backgroundImage: {
        "map-svg": "url('/assets/images/main/mapImg.svg')",
        "scan-svg": "url('/assets/images/main/scanImg.svg')",
      },
    },
  },
  plugins: [],
};
