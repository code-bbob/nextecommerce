// utils/performanceMonitor.js

/**
 * Simple performance monitoring for image loading
 * Use this to track how fast your CDN images are loading
 */

export function trackImageLoadTime(imageUrl, startTime = performance.now()) {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`✅ Image loaded in ${loadTime.toFixed(2)}ms:`, imageUrl);
      resolve({ success: true, loadTime, url: imageUrl });
    };
    
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      console.error(`❌ Image failed to load after ${loadTime.toFixed(2)}ms:`, imageUrl);
      resolve({ success: false, loadTime, url: imageUrl });
    };
    
    img.src = imageUrl;
  });
}

/**
 * Batch test multiple images to compare CDN vs original performance
 */
export async function compareImageLoadTimes(originalUrls, cdnUrls) {
  console.log('🚀 Starting image load performance comparison...');
  
  const originalPromises = originalUrls.map(url => trackImageLoadTime(url));
  const cdnPromises = cdnUrls.map(url => trackImageLoadTime(url));
  
  const [originalResults, cdnResults] = await Promise.all([
    Promise.all(originalPromises),
    Promise.all(cdnPromises)
  ]);
  
  const originalAvg = originalResults.reduce((sum, r) => sum + r.loadTime, 0) / originalResults.length;
  const cdnAvg = cdnResults.reduce((sum, r) => sum + r.loadTime, 0) / cdnResults.length;
  
  console.log(`📊 Performance Results:
    Original images average: ${originalAvg.toFixed(2)}ms
    CDN images average: ${cdnAvg.toFixed(2)}ms
    Speed improvement: ${((originalAvg - cdnAvg) / originalAvg * 100).toFixed(1)}%
  `);
  
  return { originalAvg, cdnAvg, improvement: (originalAvg - cdnAvg) / originalAvg };
}

/**
 * Monitor Core Web Vitals for image loading impact
 */
export function monitorWebVitals() {
  if (typeof window === 'undefined') return;
  
  // Monitor Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('🎯 LCP:', entry.startTime.toFixed(2) + 'ms');
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // Monitor Cumulative Layout Shift (CLS)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        console.log('📏 CLS:', entry.value.toFixed(4));
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
}
