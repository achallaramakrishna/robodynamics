/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
  async rewrites() {
    const javaBase = "http://127.0.0.1:8080/robodynamics";
    return [
      {
        source: "/student/content/:path*",
        destination: `${javaBase}/student/content/:path*`,
      },
      {
        source: "/course/:path*",
        destination: `${javaBase}/course/:path*`,
      },
    ];
  },
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
