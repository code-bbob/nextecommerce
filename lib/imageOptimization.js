/**
 * Image Optimization Utilities
 * - Lazy loading strategies
 * - WebP support detection
 * - Responsive image sizing
 * - Performance monitoring
 */

/**
 * Get optimal image size based on viewport
 */
export const getImageSizes = (isFeatured = false) => {
  if (isFeatured) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px";
  }
  return "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";
};

/**
 * Get optimal quality based on device type
 */
export const getImageQuality = (priority = false) => {
  return priority ? 90 : 80;
};

/**
 * Create blur placeholder data
 */
export const getBlurPlaceholder = () => {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VmZWZmYiIvPjwvc3ZnPg==";
};

/**
 * Preload critical images
 */
export const preloadImage = (src) => {
  if (typeof window === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
};

/**
 * IntersectionObserver for lazy loading
 */
export const observeLazyImages = () => {
  if (typeof window === "undefined") return;
  
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img.lazy").forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

/**
 * Report Core Web Vitals for performance monitoring
 */
export const reportWebVitals = (metric) => {
  if (typeof window !== "undefined") {
    // Send to analytics service
    const body = JSON.stringify(metric);
    // navigator.sendBeacon('/api/analytics', body);
  }
};

/**
 * Generate responsive image srcSet
 */
export const generateSrcSet = (imagePath, sizes = [320, 640, 960, 1200]) => {
  return sizes
    .map((size) => `${imagePath}?w=${size} ${size}w`)
    .join(", ");
};
