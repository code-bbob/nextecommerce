// app/sitemap.js
// Dynamic sitemap for Next.js App Router

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

/**
 * Fetch all products from the backend, following pagination if available.
 * Expects a paginated response with `results` and either `next` or `links.next`.
 */
async function fetchAllProducts() {
  const products = [];
  if (!BACKEND) return products;

  let url = `${BACKEND}shop/api/`;
  // Stop-gap to avoid runaway loops in case API keeps paginating
  for (let i = 0; i < 50 && url; i += 1) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 }, // cache daily
      });
      if (!res.ok) break;
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      products.push(...results);
      url = data.next || data?.links?.next || null;
    } catch (err) {
      console.error("sitemap: error fetching products:", err);
      break;
    }
  }
  return products;
}

function toDate(val) {
  const d = val ? new Date(val) : null;
  return Number.isNaN(d?.getTime?.()) ? new Date() : d;
}

export default async function sitemap() {
  // Static pages you want indexed
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/store", priority: 0.9, changeFrequency: "daily" },
    { path: "/deals", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/cpc", priority: 0.6, changeFrequency: "monthly" },
    { path: "/search", priority: 0.5, changeFrequency: "weekly" },
    { path: "/tracking", priority: 0.4, changeFrequency: "weekly" },
  ];

  // Known top-level categories in the app (sync with CatBar)
  const categories = [
    "laptop",
    "smartphone",
    "keyboard",
    "headphone",
    "accessories",
    "gadgets",
  ];

  // Build base entries
  const entries = [
    ...staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...categories.map((cat) => ({
      url: `${SITE}/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    })),
  ];

  // Add product pages
  try {
    const products = await fetchAllProducts();
    for (const p of products) {
      const id = p?.product_id || p?.id || p?.slug || null;
      if (!id) continue;
      const last = toDate(p?.updated_at || p?.modified || p?.updated || p?.created_at || p?.date);
      entries.push({
        url: `${SITE}/product/${encodeURIComponent(String(id))}`,
        lastModified: last,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (e) {
    // Already logged inside fetchAllProducts; fail soft with static set only
  }

  return entries;
}
