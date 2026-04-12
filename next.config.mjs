/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Disable Vercel's paid Image Optimization - use DigitalOcean CDN instead for free
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.dgtech.com.np',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.dgtechcm.np',
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
          source: '/blog/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, s-maxage=30, stale-while-revalidate=120',
            },
          ],
        },
        {
          source: '/search',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, s-maxage=300, stale-while-revalidate=3600',
            },
          ],
        },
        {
          // Cache blog images aggressively
          source: '/api/og',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  };

export default nextConfig;
