/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https', // Or 'http' if needed
          hostname: 'digitech-ecommerce.blr1.digitaloceanspaces.com', // Replace with your image host
          port: '', // Leave empty if default port
          pathname: '/**', // Or specify a specific path
        },
      ],
    },
  };

export default nextConfig;
