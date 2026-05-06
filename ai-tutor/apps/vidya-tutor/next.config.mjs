/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/vaani',
  assetPrefix: '/vaani',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/student/content/:path*',
          destination: 'http://127.0.0.1:8080/robodynamics/student/content/:path*',
        },
        {
          source: '/course/:path*',
          destination: 'http://127.0.0.1:8080/robodynamics/course/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
