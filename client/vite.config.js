import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const tailwindcss = require("@tailwindcss/vite").default;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // บังคับให้ใช้ port 3000
    proxy: {
      // เมื่อไหร่ก็ตามที่หน้าบ้านเรียกใช้ path ที่ขึ้นต้นด้วย /api
      // มันจะส่งต่อไปยังหลังบ้านที่ Port 5000 อัตโนมัติ
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
