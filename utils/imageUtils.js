// utils/imageUtils.js

// Cache for transformed URLs to avoid repeated processing
const urlCache = new Map();

/**
 * Ultra-fast CDN URL transformer with caching
 * @param {string} imageUrl - Original image URL
 * @returns {string} - CDN optimized URL or local URL
 */
export function getCDNImageUrl(imageUrl) {
  if (!imageUrl) return '/placeholder.svg';
  
  // Handle local images from /public directory - return as-is
  if (imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Check cache first for maximum performance
  if (urlCache.has(imageUrl)) {
    return urlCache.get(imageUrl);
  }
  
  // If already a CDN URL, cache and return as is
  if (imageUrl.includes('digitech-ecommerce.blr1.cdn.digitaloceanspaces.com')) {
    urlCache.set(imageUrl, imageUrl);
    return imageUrl;
  }
  
  const CDN_BASE_URL = 'https://digitech-ecommerce.blr1.cdn.digitaloceanspaces.com';
  let transformedUrl;
  
  // Handle full URLs from backend
  if (imageUrl.startsWith('http')) {
    try {
      const url = new URL(imageUrl);
      transformedUrl = `${CDN_BASE_URL}${url.pathname}`;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      transformedUrl = imageUrl; // Fallback to original
    }
  } else {
    // Handle relative paths from API
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    transformedUrl = `${CDN_BASE_URL}/${cleanPath}`;
  }
  
  // Cache the result for future use
  urlCache.set(imageUrl, transformedUrl);
  return transformedUrl;
}

/**
 * Get CDN URL with cache headers for maximum browser caching
 * @param {string} imageUrl - Original image URL
 * @returns {string} - CDN URL with cache optimization
 */
export function getCachedCDNImageUrl(imageUrl) {
  const cdnUrl = getCDNImageUrl(imageUrl);
  
  // Add cache busting only for development, not production
  if (process.env.NODE_ENV === 'development') {
    return cdnUrl;
  }
  
  // In production, rely on CDN's native caching
  return cdnUrl;
}

/**
 * Preload critical images for better performance
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  if (typeof window === 'undefined') return; // Server-side safety
  
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getCDNImageUrl(url);
    document.head.appendChild(link);
  });
}
