import customFetch from "@/utils/customFetch";
import { DealsPageClient } from "./deals-page-client";

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

// Fetch deals server-side
async function getInitialDeals(page = 1) {
  try {
    const response = await customFetch(`shop/api/deals/?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch deals:', error);
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
export default async function DealsPage({ searchParams }) {
  // Read page number from URL query params (?page=2)
  // In Next.js 15, searchParams is a Promise, so we need to await it
  const params = await searchParams;
  const pageNum = parseInt(params?.page) || 1;
  
  // Data is fetched on the server before page renders
  // This means products are ALREADY LOADED when page reaches client
  const initialDeals = await getInitialDeals(pageNum);

  // Pass pre-fetched data to client component
  // Client renders immediately with NO loading state
  return <DealsPageClient initialProducts={initialDeals} currentPage={pageNum} />;
}
