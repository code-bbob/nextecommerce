import customFetch from "@/utils/customFetch";
import { StorePageClient } from "./store-page-client";

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

// Fetch products server-side
async function getInitialProducts(page = 1) {
  try {
    const response = await customFetch(`shop/api/?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      results: [],
      count: 0,
      total_pages: 0,
      current_page: 1,
      links: { next: null, previous: null },
    };
  }
}

// Server Component - Fetches data instantly
export default async function StorePage() {
  // Data is fetched on the server before page renders
  // This means products are ALREADY LOADED when page reaches client
  const initialProducts = await getInitialProducts(1);

  // Pass pre-fetched data to client component
  // Client renders immediately with NO loading state
  return <StorePageClient initialProducts={initialProducts} currentPage={1} />;
}
