// utils/imageLoader.js
import { getCDNImageUrl } from './imageUtils';

/**
 * Fast, cost-free custom image loader that handles both local and CDN images
 * @param {Object} params - Loader parameters
 * @param {string} params.src - Source URL
 * @param {number} params.width - Target width (ignored for cost savings)
 * @param {number} params.quality - Image quality (ignored for cost savings)
 * @returns {string} - Appropriate image URL
 */
export default function imageLoader({ src, width, quality }) {
  // Handle local images (from /public directory)
  if (src.startsWith('/') && !src.startsWith('http')) {
    // Local images from /public - serve as-is
    return src;
  }
  
  // Handle external/API images - transform to CDN
  return getCDNImageUrl(src);
}
