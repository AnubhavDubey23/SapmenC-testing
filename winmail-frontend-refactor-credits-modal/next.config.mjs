import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        hostname: 'plus.unsplash.com',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Fix for @emotion/react duplicate loading issue
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@emotion/react': require.resolve('@emotion/react'),
        '@emotion/styled': require.resolve('@emotion/styled'),
      };
    }
    return config;
  },
};

export default nextConfig;
