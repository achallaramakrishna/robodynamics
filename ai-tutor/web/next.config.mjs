/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async headers() {
    const noStoreHeaders = [
      { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
      { key: "Pragma", value: "no-cache" },
      { key: "Expires", value: "0" }
    ];
    return [
      { source: "/ai-tutor/vedic", headers: noStoreHeaders },
      { source: "/ai-tutor/tutor", headers: noStoreHeaders },
      { source: "/ai-tutor/learn", headers: noStoreHeaders }
    ];
  }
};

export default nextConfig;
