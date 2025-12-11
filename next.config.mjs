/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Enable Next.js Image Optimization (fast on localhost, uses next/image benefits)
      unoptimized: false,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'digitech-ecommerce.blr1.cdn.digitaloceanspaces.com',
          port: '',
          pathname: '/**',
        },
      ],
      // Performance optimizations
      deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  };

export default nextConfig;
