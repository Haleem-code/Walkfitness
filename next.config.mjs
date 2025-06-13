// next.config.mjs
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    AUTH_TRUST_HOST: "true",
    NEXTAUTH_URL: "https://walkfit.vercel.app", 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // or 'http' if needed, but 'https' is recommended
        hostname: '**', // This wildcard allows all hostnames
      },
    ],
  },
};

export default nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
