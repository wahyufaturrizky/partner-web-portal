/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["mdm-portal.nabatisnack.co.id"],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
