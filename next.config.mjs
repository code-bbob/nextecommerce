/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http', // Or 'http' if needed
          hostname: '127.0.0.1', // Replace with your image host
          port: '8000', // Leave empty if default port
          pathname: '/**', // Or specify a specific path
        },
      ],
    },
  };

export default nextConfig;
