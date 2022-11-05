/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ignoreBuildErrors: true,
  experimental: {
    // transpilePackages: ["youtubei.js"],
  },
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };
  //   return config;
  // },

}
module.exports = nextConfig;
