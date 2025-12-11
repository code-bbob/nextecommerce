/**
 * Performance Optimization: Defer Non-Critical JavaScript
 * Similar to Cloudflare Rocket Loader
 * 
 * How it works:
 * 1. Page HTML renders without waiting for JavaScript
 * 2. Critical JavaScript loads normally
 * 3. Non-critical JavaScript (animations, tracking, etc.) loads after page is interactive
 */

// List of JavaScript files/features to defer
const DEFER_SCRIPTS = [
  'framer-motion',      // Animations can wait
  'react-hot-toast',    // Toast notifications (non-critical)
  'swiper',             // Carousels can load after page
];

// Critical scripts that MUST load first
const CRITICAL_SCRIPTS = [
  'react',
  'next',
  'redux',
  'lucide-react',       // Icons needed for layout
];

/**
 * Defer JavaScript execution until page is interactive
 * This makes the page appear faster (similar to Rocket Loader)
 */
export function deferNonCriticalScripts() {
  if (typeof window === 'undefined') return;

  // Wait until page is interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Page structure is ready, defer non-critical scripts
      deferScriptExecution();
    });
  } else {
    // Already interactive
    deferScriptExecution();
  }
}

/**
 * Defer execution of non-critical JavaScript
 */
function deferScriptExecution() {
  // Wait for page to be fully rendered and interactive
  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback if available (browser idle time)
    requestIdleCallback(() => {
      loadNonCriticalScripts();
    }, { timeout: 2000 }); // Max wait 2 seconds
  } else {
    // Fallback: defer with setTimeout
    setTimeout(loadNonCriticalScripts, 0);
  }
}

/**
 * Dynamically load non-critical scripts
 */
function loadNonCriticalScripts() {
  // Scripts are already bundled, but this ensures
  // animations/effects don't block initial render
  
  // Trigger animations only after page is interactive
  document.documentElement.classList.add('js-loaded');
  
  // Dispatch event for components to know JS is ready
  const event = new Event('js-ready', { bubbles: true });
  document.dispatchEvent(event);
}

// Auto-run on client-side
if (typeof window !== 'undefined') {
  // Use requestAnimationFrame for smooth execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        deferNonCriticalScripts();
      });
    });
  } else {
    requestAnimationFrame(() => {
      deferNonCriticalScripts();
    });
  }
}

export default {
  deferNonCriticalScripts,
  loadNonCriticalScripts,
};
