// app/providers.js
"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { useEffect } from "react";

export function Providers({ children }) {
  useEffect(() => {
    // Initialize Rocket Loader - defer non-critical JavaScript
    // This makes the page appear faster by deferring animations
    // and non-critical features until the page is interactive
    if (typeof window !== 'undefined') {
      // Mark when JavaScript is ready
      document.documentElement.classList.add('js-loaded');
      
      // Also dispatch event for components
      const event = new Event('js-ready', { bubbles: true });
      document.dispatchEvent(event);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
