/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },
};

export default nextConfig;
