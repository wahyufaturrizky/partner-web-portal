/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["mdm-portal.nabatisnack.co.id"],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/fico/:path*',
        destination: `${process.env.BASE_URL_FICO}/fico/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/fico/login',
        destination: '/login',
        permanent: false,
      },
    ];
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
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['tsx', 'jsx'],
};

module.exports = nextConfig;
