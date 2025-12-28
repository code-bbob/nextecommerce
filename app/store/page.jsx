import publicFetch from "@/utils/publicFetch";
import { StorePageClient } from "./store-page-client";

// ISR - cache each URL (including ?page=...) for 1 hour
export const revalidate = 3600;

// Fetch products server-side with full query support
async function getInitialProducts(queryParams) {
  try {
    const qs = new URLSearchParams();
    const page = parseInt(queryParams?.page) || 1;
    qs.set("page", page.toString());

    // Map filters from URL to backend API expectations
    if (queryParams?.ordering) qs.set("ordering", queryParams.ordering);
    if (queryParams?.rating) qs.set("rating", queryParams.rating);
    if (queryParams?.min_rating) qs.set("min_rating", queryParams.min_rating);
    if (queryParams?.min_price) qs.set("min_price", queryParams.min_price);
    if (queryParams?.max_price) qs.set("max_price", queryParams.max_price);
    // Backend expects `brand`, not `brand_name`
    const brand = queryParams?.brand ?? queryParams?.brand_name;
    if (brand) qs.set("brand", brand);

    const response = await publicFetch(`shop/api/?${qs.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
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
export default async function StorePage({ searchParams }) {
  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const pageNum = parseInt(params?.page) || 1;

  // Fetch server-side using current query params so pagination + filters persist
  const initialProducts = await getInitialProducts(params);

  return (
    <StorePageClient initialProducts={initialProducts} currentPage={pageNum} />
  );
}
