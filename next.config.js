/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    loader: 'custom',
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    cacheLife: 7,
    cacheHandler: 'filesystem',
  },
};
