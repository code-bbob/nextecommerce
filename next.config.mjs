/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true, // Disable Next.js image optimization to save costs
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'digitech-ecommerce.blr1.cdn.digitaloceanspaces.com',
          port: '',
          pathname: '/**',
        },
      ],
      // No custom loader needed when unoptimized is true
    },
  };

export default nextConfig;
