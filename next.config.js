/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@swc/core': false
    };
    return config;
  }
};

module.exports = nextConfig;