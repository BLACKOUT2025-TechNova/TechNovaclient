import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true,

    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [react(), basicSsl()],
});
