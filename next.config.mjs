/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Disable Vercel's paid Image Optimization - use DigitalOcean CDN instead for free
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'digitech-ecommerce.blr1.cdn.digitaloceanspaces.com',
          port: '',
          pathname: '/**',
        },
      ],
      // Cache optimized images for 365 days
      minimumCacheTTL: 31536000,
      // Use modern formats (webp, avif) when supported
      formats: ['image/avif', 'image/webp'],
      // Increase dangerouslyAllowSVG for icons/logos
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Optimize bundle size
    compress: true,
    // Enable SWR (stale-while-revalidate) for API responses
    experimental: {
      optimizePackageImports: ['lucide-react', '@radix-ui'],
    },

    async headers() {
      return [
        {
          source: '/search',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, s-maxage=300, stale-while-revalidate=3600',
            },
          ],
        },
      ];
    },
  };

export default nextConfig;
