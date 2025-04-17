import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // هنا نعيد كتابة الرابط لإرسال الطلبات إلى Webhook
      "/api": {
        target: "https://webhook.site", // استبدله بعنوان الـ API الذي تريد إرسال البيانات إليه
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // حذف /api من المسار عند الإرسال إلى الخادم
      },
    },
  },
});

// الكود القديم
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
