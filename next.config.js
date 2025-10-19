/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  cacheMaxMemorySize: 0,

  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
