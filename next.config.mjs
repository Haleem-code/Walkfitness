/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Add Auth.js configuration to trust localhost
  env: {
    AUTH_TRUST_HOST: "true",
    NEXTAUTH_URL: "https://walkfit.vercel.app"
  },
};

// import "./src/backend/cronJobs.js";

export default nextConfig;
