// app/blog-sitemap.xml/route.js
import { generateBlogSitemap } from '@/lib/blogSEO';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const site = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  let blogs = [];

  try {
    const res = await fetch(`${site}blog/api/`, { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (res.ok) {
      blogs = await res.json();
    }
  } catch (err) {
    console.log('Failed to load blogs for sitemap', err);
  }

  const entries = generateBlogSitemap(blogs);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
