/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: 'plus.unsplash.com',
            protocol: 'https',
        }]
    },
    reactStrictMode: false,
};

export default nextConfig;
